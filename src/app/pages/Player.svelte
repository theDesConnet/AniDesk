<!--Anidesk player-->

<script>
    export let args;
    import {
        Original,
        ModeA,
        render,
        ModeBB,
        ModeB,
        DoG,
        BilateralMean,
        CNNM,
        CNNSoftM,
        CNNSoftVL,
        CNNVL,
        CNNUL,
        CNNx2M,
        CNNx2VL,
        DenoiseCNNx2VL,
        GANx3L,
        GANx4UUL,
        GANUUL,
        ModeAA,
        ModeCA,
        CNNx2UL,
        ModeC,
    } from "anime4k-webgpu";
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";
    import PlayerGui from "../components/player/PlayerGUI.svelte";
    import { onMount, onDestroy } from "svelte";
    import { AniLibriaParser, SibnetParser, KodikParser } from "anixartjs";
    import utils from "../utils";

    const upscaleModeMap = {
        0: DoG,
        1: BilateralMean,
        2: CNNM,
        3: CNNSoftM,
        4: CNNSoftVL,
        5: CNNVL,
        6: CNNUL,
        7: GANUUL,
        8: CNNx2M,
        9: CNNx2VL,
        10: DenoiseCNNx2VL,
        11: CNNx2UL,
        12: GANx3L,
        13: GANx4UUL,
        14: ModeA,
        15: ModeB,
        16: ModeC,
        17: ModeAA,
        18: ModeBB,
        19: ModeCA,
    };

    let currentTime,
        durationTime,
        upscaleSettings,
        playerSettings,
        playingSettings,
        volPercent;

    let defaultCanvasSize = {
        width: screen.width,
        height: screen.height,
    };

    let video,
        canvas,
        timePos,
        volControl,
        timeout,
        mainDiv,
        hls,
        currentEpisode,
        startTimestamp;

    let progressPercent, loadedPercent;

    let isHidden, isPaused, isTimePosClick, isFullscreen;
    let pressedKeys = new Set();

    const playerSettingsRaw = localStorageWritable(
        "playerSettings",
        utils.playerDefaultSettings,
    );

    playerSettingsRaw.subscribe((value) => {
        playerSettings = value;
    });

    const playingSettingsRaw = localStorageWritable(
        "playingSettings",
        utils.playingDefaultSettings,
    );

    playingSettingsRaw.subscribe((value) => {
        playingSettings = value;
    });

    const upscaleSettingsRaw = localStorageWritable(
        "upscaleSettings",
        utils.upscaleDefaultSettings,
    );

    upscaleSettingsRaw.subscribe((value) => {
        upscaleSettings = value;
    });

    let upscaleEnabled = upscaleSettings.enabled;

    async function changeUpscale(enabled) {
        upscaleEnabled = enabled;
        await renderUpscale();
    }

    //aspect-16-9
    //aspect-4-3
    //aspect-fit
    let aspectRatio = `aspect-${playerSettings.defaultAspectRatio}`;

    function changeAspectRatio(aspect) {
        playerSettings.defaultAspectRatio = aspect;
        aspectRatio = `aspect-${aspect}`;
    }

    let loading = true;

    function hideOnIdle() {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            if (!isHidden) {
                isHidden = true;
            }
        }, playerSettings.timeHideInterface);

        if (isHidden) {
            isHidden = false;
        }
    }

    function handleResize(event) {
        isFullscreen = window.innerHeight === screen.height;
    }

    document.addEventListener("mousemove", hideOnIdle);

    window.addEventListener("resize", handleResize);

    onMount(async () => {
        init();
    });

    async function playVideo(episode) {
        let avaliableQuality, link;
        let source =
            typeof episode.source == "number"
                ? args.episodes.find((x) => episode.source == x.source["@id"])
                      .source
                : episode.source;

        switch (source.name) {
            case "Kodik":
                let aQ = {};
                const kLinks = await KodikParser.getDirectLinks(episode.url);
                for (const [key, value] of Object.entries(kLinks)) {
                    aQ[key] = {
                        src: value[0].src,
                    };
                }
                avaliableQuality = aQ;
                break;

            case "Liberty":
            case "Libria":
                await utils.fallback(async (success) => {
                    console.log(episode.url);
                    const aLinks = await AniLibriaParser.getDirectLinks(
                        episode.url,
                    );
                    avaliableQuality = aLinks;

                    success = true;
                }, 3);
                break;

            case "Sibnet":
                await utils.fallback(async (success) => {
                    const link = await Sibnet.Parse(episode.url);
                    if (!link) return;

                    avaliableQuality = {
                        "720": {
                            src: link,
                        },
                    };

                    success = true;
                }, 3);
                break;
        }

        const url =
            avaliableQuality[String(playingSettings.defaultQuality)]?.src ??
            avaliableQuality["720"]?.src;

        args.avaliableQuality = avaliableQuality;

        link = `${URL.canParse(url) ? url : `https:${url}`}`;

        if (Hls.isSupported() && !new URL(link).pathname.endsWith(".mp4")) {
            hls.detachMedia();
            hls.destroy();

            hls = new Hls();

            hls.on(Hls.Events.BUFFER_APPENDING, (e, data) => {
                loadedPercent =
                    (data.frag._streams.video.endPTS / video.duration) * 100;
            });

            hls.loadSource(link);
            hls.attachMedia(video);
        } else {
            video.src = link;
        }

        args.src = link;

        await video.play();

        if (!playingSettings.disableHistory) {
            anixApi.release.markEpisodeAsWatched(
                args.release.id,
                args.episodes[0].source.id,
                currentEpisode.position,
            );
            anixApi.release.addToHistory(
                args.release.id,
                args.episodes[0].source.id,
                currentEpisode.position,
            );
        }

        analytics.trackEvent("play_anime", {
            source: source.name,
            name: episode.name,
            releaseTitle: args.release.title_ru,
            dubber: source.type.name,
        });

        startTimestamp = Date.now();

        discordRPC.setActivity({
            type: 3,
            state: `${episode.name}`,
            details: args.release.title_ru.slice(0, 127),
            largeImageKey: "anidesk-transparent",
            largeImageText: "AniDesk - Anixart Client",
            startTimestamp: startTimestamp - video.currentTime * 1000,
            endTimestamp:
                startTimestamp + (video.duration - video.currentTime) * 1000,
            instance: true,
            buttons: [
                {
                    label: "Ссылка на релиз",
                    url: `https://anixart.app/release/${args.release.id}`,
                },
                { label: "Ссылка на клиент", url: "https://anidesk.ds1nc.ru/" },
            ],
        });
    }

    async function renderUpscale() {
        canvas = await waitForElm(".player-canvas");
        await render({
            video,
            canvas,
            pipelineBuilder: (device, inputTexture) => {
                const nativeDimensions = {
                    width: video.videoWidth,
                    height: video.videoHeight,
                };

                const targetDimensions = {
                    width: defaultCanvasSize.width,
                    height: defaultCanvasSize.height,
                };

                return [
                    upscaleEnabled
                        ? new upscaleModeMap[upscaleSettings.mode]({
                              device,
                              inputTexture,
                              nativeDimensions,
                              targetDimensions,
                          })
                        : new Original({
                              device,
                              inputTexture,
                              nativeDimensions,
                              targetDimensions,
                          }),
                ];
            },
        });
    }

    async function changeQuality(quality) {
        const qualitySrc = args.avaliableQuality[String(quality)]?.src;
        if (!qualitySrc) return;

        const url = URL.canParse(qualitySrc)
            ? qualitySrc
            : `https:${qualitySrc}`;

        if (Hls.isSupported()) {
            const currentTime = video.currentTime;
            const isPausedNow = video.paused;

            hls.detachMedia();
            hls.destroy();

            hls = new Hls();

            hls.on(Hls.Events.BUFFER_APPENDING, (e, data) => {
                loadedPercent =
                    (data.frag._streams.video.endPTS / video.duration) * 100;
            });

            hls.loadSource(url);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.currentTime = currentTime;
                if (!isPausedNow) {
                    video.play();
                }
            });
        } else {
            video.src = url;
            video.play();
        }

        if (avaliableGPU) await renderUpscale();

        args.src = url;
        args.currentQuality = quality;
    }

    async function init() {
        mainDiv = await waitForElm(".anidesk-player");
        video = await waitForElm(".player-video");

        if (Hls.isSupported() && !new URL(args.src).pathname.endsWith(".mp4")) {
            hls = new Hls();

            hls.on(Hls.Events.BUFFER_APPENDING, (e, data) => {
                loadedPercent =
                    (data.frag._streams.video.endPTS / video.duration) * 100;
            });

            hls.loadSource(args.src);
            hls.attachMedia(video);
        } else {
            video.src = args.src;
        }

        video.volume = playerSettings.saveUserVolume.enabled
            ? (playerSettings.saveUserVolume.lastValue ??
              playerSettings.defaultVolume / 100)
            : playerSettings.defaultVolume / 100;

        volControl = await waitForElm("#volume-position");

        volControl.value = video.volume;
        volPercent = video.volume * 100;

        volControl.oninput = () => {
            video.volume = volControl.value;

            if (playerSettings.saveUserVolume.enabled) {
                playerSettings.saveUserVolume.lastValue = volControl.value;
                playerSettingsRaw.set(playerSettings);
            }
        };

        video.onloadedmetadata = () => {
            loading = true;
            durationTime = utils.returnFormatedTime(video.duration);
        };

        video.onwaiting = () => {
            loading = true;
        };

        video.onplaying = () => {
            loading = false;
        };

        if (avaliableGPU) await renderUpscale();
        await video.play();

        window.onwheel = (e) => {
            switch (true) {
                case e.deltaY > 0 && volControl.value > 0:
                    volControl.value = volControl.value - 0.05;
                    video.volume -= 0.05;
                    volPercent = video.volume * 100;
                    break;

                case e.deltaY < 0 && volControl.value < 1:
                    volControl.value = parseFloat(volControl.value) + 0.05;
                    video.volume += 0.05;
                    volPercent = video.volume * 100;
                    break;
            }
        };

        window.onkeydown = (e) => {
            pressedKeys.add(e.code);

            for (const [action, keys] of Object.entries(
                playerSettings.hotkeys,
            )) {
                if (keys.length !== pressedKeys.size) continue;

                if (keys.every((key) => pressedKeys.has(key))) {
                    switch (action) {
                        case "hotkeyPlayPause":
                            isPaused ? video.play() : video.pause();
                            break;

                        case "hotkeyMute":
                            video.muted = !video.muted;
                            break;

                        case "hotkeyFullscreen":
                            isFullscreen
                                ? elecWindow.exitFullscreen()
                                : elecWindow.enterFullscreen();
                            break;

                        case "hotkeyForward":
                            video.currentTime += 10;
                            break;

                        case "hotkeyBackward":
                            video.currentTime -= 10;
                            break;

                        case "hotkeySkipOpening":
                            video.currentTime += 85;
                            break;

                        case "hotkeyNextEpisode":
                            let e =
                                args.episodes[
                                    args.episodes.findIndex(
                                        (x) =>
                                            x.position ==
                                            currentEpisode.position,
                                    ) + 1
                                ];

                            if (e) {
                                currentEpisode = e;
                                playVideo(currentEpisode);
                            }
                            break;

                        case "hotkeyPrevEpisode":
                            let p =
                                args.episodes[
                                    args.episodes.findIndex(
                                        (x) =>
                                            x.position ==
                                            currentEpisode.position,
                                    ) - 1
                                ];

                            if (p) {
                                currentEpisode = p;
                                playVideo(currentEpisode);
                            }
                            break;
                    }

                    pressedKeys.clear();
                    break;
                }
            }

            switch (e.code) {
                case "Escape":
                    if (isFullscreen) {
                        elecWindow.exitFullscreen();
                    }
                    updateViewportComponent(8, { id: args.release.id });
                    break;
            }
        };

        window.onkeyup = (e) => {
            pressedKeys.delete(e.code);
        };

        // Очищаем массив нажатых клавиш при потере фокуса окна, чтобы небыло проблем
        // когда клавиша осталась в массиве из-за чего хоткеи перестают работать
        window.onblur = () => {
            pressedKeys.clear();
        }

        durationTime = utils.returnFormatedTime(video.duration);
        startTimestamp = Date.now();

        video.onpause = () => {
            isPaused = true;
            loading = false;

            discordRPC.setActivity({
                type: 3,
                state: `${currentEpisode.name}`,
                details: args.release.title_ru.slice(0, 127),
                largeImageKey: "anidesk-transparent",
                largeImageText: "AniDesk - Anixart Client",
                instance: true,
                buttons: [
                    {
                        label: "Ссылка на релиз",
                        url: `https://anixart.app/release/${args.release.id}`,
                    },
                    {
                        label: "Ссылка на клиент",
                        url: "https://anidesk.ds1nc.ru/",
                    },
                ],
            });
        };

        video.onplay = (e) => {
            isPaused = false;
            loading = false;

            startTimestamp = Date.now();

            console.log(e.target.duration, e.target.currentTime);

            discordRPC.setActivity({
                type: 3,
                state: `${currentEpisode.name}`,
                details: args.release.title_ru.slice(0, 127),
                largeImageKey: "anidesk-transparent",
                largeImageText: "AniDesk - Anixart Client",
                startTimestamp: startTimestamp - video.currentTime * 1000,
                endTimestamp:
                    startTimestamp +
                    (video.duration - video.currentTime) * 1000,
                instance: true,
                buttons: [
                    {
                        label: "Ссылка на релиз",
                        url: `https://anixart.tv/release/${args.release.id}`,
                    },
                    {
                        label: "Ссылка на клиент",
                        url: "https://anidesk.ds1nc.ru/",
                    },
                ],
            });
        };

        video.onended = async () => {
            if (playerSettings.autoplayEpisode) {
                let e = args.episodes.find(
                    (x) => x.position == currentEpisode.position + 1,
                );

                if (e) {
                    currentEpisode = e;
                    await playVideo(currentEpisode);
                }
            }
        };

        video.ontimeupdate = () => {
            currentTime = utils.returnFormatedTime(video.currentTime);
            progressPercent = (video.currentTime / video.duration) * 100;
        };

        let source =
            typeof args.currentEpisode.source == "number"
                ? args.episodes.find(
                      (x) => args.currentEpisode.source == x.source["@id"],
                  ).source
                : args.currentEpisode.source;

        analytics.trackEvent("play_anime", {
            source: source.name,
            name: args.currentEpisode.name,
            releaseTitle: args.release.title_ru,
            dubber: source.type.name,
        });

        discordRPC.setActivity({
            type: 3,
            state: `${currentEpisode.name}`,
            details: args.release.title_ru.slice(0, 127),
            largeImageKey: "anidesk-transparent",
            largeImageText: "AniDesk - Anixart Client",
            startTimestamp: startTimestamp - video.currentTime * 1000,
            endTimestamp:
                startTimestamp + (video.duration - video.currentTime) * 1000,
            instance: true,
            buttons: [
                {
                    label: "Ссылка на релиз",
                    url: `https://anixart.tv/release/${args.release.id}`,
                },
                { label: "Ссылка на клиент", url: "https://anidesk.ds1nc.ru/" },
            ],
        });
    }

    onDestroy(() => {
        //Destroy all event listeners
        if (hls) {
            hls.detachMedia();
            hls.destroy();
        }
        document.removeEventListener("mousemove", hideOnIdle);
        window.removeEventListener("resize", handleResize);
        window.onwheel = null;
        window.onkeydown = null;
        window.onkeyup = null;
        window.onblur = null;
        video.onpause = null;
        video.onplay = null;
        video.ontimeupdate = null;
        video.onloadedmetadata = null;
        video.onwaiting = null;
        video.onplaying = null;
        video = null;

        volControl.oninput = null;
        clearTimeout(timeout);
    });
</script>

<div class="anidesk-player full">
    <PlayerGui
        {playVideo}
        {args}
        {isHidden}
        {isFullscreen}
        {isPaused}
        {video}
        {isTimePosClick}
        {timePos}
        {progressPercent}
        {loadedPercent}
        {volControl}
        {canvas}
        {mainDiv}
        {currentTime}
        {durationTime}
        bind:cEpisode={currentEpisode}
        transparentPercent={playerSettings.opacityInterface}
        {changeQuality}
        {changeUpscale}
        {upscaleEnabled}
        {changeAspectRatio}
        aspectRatio={utils.aspectRatioValues.find(
            (x) => x.value == playerSettings.defaultAspectRatio,
        ).label}
        bind:volumePercent={volPercent}
    />

    <span class:hide={!loading} class="loader"></span>

    {#if avaliableGPU}
        <canvas
            class="player-canvas {aspectRatio}"
            width={screen.width}
            height={screen.height}
        ></canvas>
    {/if}
    <video
        class="player-video"
        crossorigin="anonymous"
        class:full={!avaliableGPU}
        class:hide={avaliableGPU}
    ></video>
</div>

<style>
    .full {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .loader {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 30px;
        height: 30px;
        border: 3px solid var(--player-timeline-progress-color);
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
        z-index: 1;
    }

    @keyframes rotation {
        0% {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }

    canvas,
    video {
        cursor: none;
    }

    .player-canvas {
        height: 100%;
        overflow: hidden;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .aspect-16-9 {
        aspect-ratio: 16 / 9;
    }

    .aspect-4-3 {
        aspect-ratio: 4 / 3;
    }

    .aspect-fit {
        width: 100%;
    }

    .anidesk-player {
        background-color: black;
    }
</style>
