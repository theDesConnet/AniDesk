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
    import { playerSettingsStore } from "../components/stores/pageHistory.js";
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

    const PLAYER_LAST_VOLUME_KEY = "PlayerLastVolume";
    const PLAYER_SAVE_VOLUME_ENABLED_KEY = "PlayerSaveUserVolumeEnabled";
    const MIN_INTERFACE_HIDE_DELAY = 1000;
    const MAX_INTERFACE_HIDE_DELAY = 2000;

    let currentTime,
        durationTime,
        upscaleSettings,
        playerSettings,
        playingSettings,
        volPercent,
        previousDocumentTitle = "",
        persistedVolume = null,
        persistedSaveVolumeEnabled = null;

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

    let isHidden,
        isPaused,
        isTimePosClick,
        isFullscreen,
        isPictureInPictureAvailable = false,
        isPictureInPictureActive = false;
    let pressedKeys = new Set();

    playerSettingsStore.subscribe((value) => {
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

    function updatePlayingSettings(patch) {
        playingSettings = {
            ...playingSettings,
            ...patch,
        };
        playingSettingsRaw.set(playingSettings);
    }

    function persistPlayerSettings(nextSettings) {
        playerSettings = nextSettings;
        playerSettingsStore.set(nextSettings);
        localStorage.setItem("playerSettings", JSON.stringify(nextSettings));
    }

    function rememberPlaybackSelection(source) {
        if (!playingSettings?.rememberSelection || !source) return;

        updatePlayingSettings({
            lastDubberId: source.type?.id ?? null,
            lastDubberName: source.type?.name ?? null,
            lastSourceId: source.id ?? null,
            lastSourceName: source.name ?? null,
        });
    }

    //aspect-16-9
    //aspect-4-3
    //aspect-fit
    let aspectRatio = `aspect-${playerSettings.defaultAspectRatio}`;

    function changeAspectRatio(aspect) {
        playerSettings.defaultAspectRatio = aspect;
        aspectRatio = `aspect-${aspect}`;
    }

    function clampVolume(value) {
        return Math.min(1, Math.max(0, Number(value) || 0));
    }

    function saveVolumePreference(volume) {
        if (!playerSettings?.saveUserVolume?.enabled) return;

        const normalizedVolume = clampVolume(volume);

        persistPlayerSettings({
            ...playerSettings,
            saveUserVolume: {
                ...playerSettings.saveUserVolume,
                lastValue: normalizedVolume,
            },
        });

        settings.set(PLAYER_LAST_VOLUME_KEY, normalizedVolume);
        settings.set(PLAYER_SAVE_VOLUME_ENABLED_KEY, true);
    }

    async function loadPersistedVolume() {
        const [savedVolume, savedSaveVolumeEnabled] =
            await Promise.all([
                settings.get(PLAYER_LAST_VOLUME_KEY),
                settings.get(PLAYER_SAVE_VOLUME_ENABLED_KEY),
            ]);

        persistedVolume =
            typeof savedVolume === "number" ? clampVolume(savedVolume) : null;
        persistedSaveVolumeEnabled =
            typeof savedSaveVolumeEnabled === "boolean"
                ? savedSaveVolumeEnabled
                : null;
    }

    function getPersistedPlayerSettings() {
        try {
            const rawSettings = localStorage.getItem("playerSettings");
            return rawSettings ? JSON.parse(rawSettings) : null;
        } catch (error) {
            return null;
        }
    }

    function getEffectivePlayerSettings() {
        const effectiveSettings = {
            ...utils.playerDefaultSettings,
            ...(getPersistedPlayerSettings() ?? playerSettings ?? {}),
        };

        if (persistedSaveVolumeEnabled !== null) {
            effectiveSettings.saveUserVolume = {
                ...effectiveSettings.saveUserVolume,
                enabled: persistedSaveVolumeEnabled,
            };
        }

        return effectiveSettings;
    }

    function getInitialVolume() {
        const effectivePlayerSettings = getEffectivePlayerSettings();

        if (
            effectivePlayerSettings?.saveUserVolume?.enabled &&
            persistedVolume !== null
        ) {
            return persistedVolume;
        }

        if (effectivePlayerSettings?.saveUserVolume?.enabled) {
            return clampVolume(
                effectivePlayerSettings.saveUserVolume.lastValue ??
                    effectivePlayerSettings.defaultVolume / 100,
            );
        }

        return clampVolume(effectivePlayerSettings?.defaultVolume / 100);
    }

    function syncPersistedVolume() {
        if (!video || video.muted) return;

        saveVolumePreference(video.volume);
    }

    function syncVolumeUI(volume = video?.volume ?? 0) {
        const normalizedVolume = clampVolume(volume);

        volPercent = normalizedVolume * 100;
        if (volControl) {
            volControl.value = normalizedVolume;
        }
    }

    function setVolume(volume, persist = true) {
        if (!video) return;

        const normalizedVolume = clampVolume(volume);
        video.volume = normalizedVolume;
        syncVolumeUI(normalizedVolume);

        if (persist) {
            saveVolumePreference(normalizedVolume);
        }
    }

    function syncPictureInPictureAvailability() {
        isPictureInPictureAvailable = Boolean(
            document.pictureInPictureEnabled &&
                video &&
                typeof video.requestPictureInPicture === "function",
        );
    }

    async function togglePictureInPicture() {
        if (!video) return;

        syncPictureInPictureAvailability();
        if (!isPictureInPictureAvailable) return;

        try {
            if (document.pictureInPictureElement === video) {
                await document.exitPictureInPicture();
            } else {
                await video.requestPictureInPicture();
            }
        } catch (error) {
            console.warn("Не удалось переключить Picture-in-Picture.", error);
        }
    }

    function syncPictureInPictureTitle(isActive) {
        if (typeof document === "undefined") return;

        if (isActive) {
            previousDocumentTitle = document.title;
            document.title = "AniDesk";
            return;
        }

        if (previousDocumentTitle) {
            document.title = previousDocumentTitle;
            previousDocumentTitle = "";
        }
    }

    function getInterfaceHideDelay() {
        return Math.min(
            MAX_INTERFACE_HIDE_DELAY,
            Math.max(
                MIN_INTERFACE_HIDE_DELAY,
                Number(playerSettings?.timeHideInterface) ||
                    utils.playerDefaultSettings.timeHideInterface,
            ),
        );
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
        }, getInterfaceHideDelay());

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

        rememberPlaybackSelection(source);

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
        await loadPersistedVolume();

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

        video.volume = getInitialVolume();

        volControl = await waitForElm("#volume-position");

        syncVolumeUI(video.volume);
        syncPictureInPictureAvailability();

        volControl.oninput = () => {
            setVolume(volControl.value);
        };

        saveVolumePreference(video.volume);

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

        video.onvolumechange = () => {
            syncVolumeUI(video.volume);
            syncPersistedVolume();
        };
        video.onenterpictureinpicture = () => {
            isPictureInPictureActive = true;
            syncPictureInPictureTitle(true);
        };
        video.onleavepictureinpicture = () => {
            isPictureInPictureActive = false;
            syncPictureInPictureTitle(false);
        };

        if (avaliableGPU) await renderUpscale();
        await video.play();

        window.onwheel = (e) => {
            if (e.deltaY > 0) {
                setVolume(video.volume - 0.05);
            } else if (e.deltaY < 0) {
                setVolume(video.volume + 0.05);
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

        rememberPlaybackSelection(source);

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
        video.onvolumechange = null;
        video.onenterpictureinpicture = null;
        video.onleavepictureinpicture = null;
        syncPictureInPictureTitle(false);

        if (video && !video.muted) {
            syncPersistedVolume();
        }
        if (document.pictureInPictureElement === video) {
            document.exitPictureInPicture().catch(() => {});
        }
        video = null;

        if (volControl) {
            volControl.oninput = null;
        }
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
        {togglePictureInPicture}
        {isPictureInPictureAvailable}
        {isPictureInPictureActive}
        aspectRatio={utils.aspectRatioValues.find(
            (x) => x.value == playerSettings.defaultAspectRatio,
        ).label}
        bind:volumePercent={volPercent}
    />

    <span class:hide={!loading} class="loader"></span>

    {#if isPictureInPictureActive}
        <div class="pip-placeholder flex-column">
            <span class="pip-placeholder-badge">PiP</span>
            <span class="pip-placeholder-title">
                Режим "картинка в картинке" включен
            </span>
            <span class="pip-placeholder-text">
                Видео вынесено в отдельное окно. Встроенный плеер временно
                скрыт, чтобы картинка не дублировалась.
            </span>
            <button class="pip-placeholder-button" onclick={togglePictureInPicture}>
                Вернуть видео в приложение
            </button>
        </div>
    {/if}

    {#if avaliableGPU}
        <canvas
            class="player-canvas {aspectRatio}"
            class:pip-hidden={isPictureInPictureActive}
            width={screen.width}
            height={screen.height}
        ></canvas>
    {/if}
    <video
        class="player-video"
        crossorigin="anonymous"
        class:full={!avaliableGPU}
        class:canvas-source={avaliableGPU}
        class:pip-hidden={isPictureInPictureActive}
        playsinline
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

    .player-video {
        width: 100%;
        height: 100%;
    }

    .pip-hidden {
        opacity: 0 !important;
        pointer-events: none;
    }

    .player-video.canvas-source {
        position: absolute;
        inset: 0;
        opacity: 0;
        pointer-events: none;
    }

    .pip-placeholder {
        position: absolute;
        inset: 0;
        z-index: 4;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 32px;
        text-align: center;
        background:
            radial-gradient(circle at top, rgba(255, 255, 255, 0.12), transparent 45%),
            rgba(0, 0, 0, 0.82);
        color: var(--main-text-color);
    }

    .pip-placeholder-badge {
        padding: 4px 10px;
        border-radius: 999px;
        background-color: rgba(255, 255, 255, 0.14);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
    }

    .pip-placeholder-title {
        font-size: 28px;
        font-weight: 600;
    }

    .pip-placeholder-text {
        max-width: 520px;
        color: var(--secondary-text-color);
        line-height: 1.5;
    }

    .pip-placeholder-button {
        margin-top: 4px;
        padding: 14px 22px;
        border-radius: 999px;
        background-color: var(--alt-background-color);
        color: var(--main-text-color);
        transition: background-color 0.2s ease-in-out;
    }

    .pip-placeholder-button:hover {
        background-color: var(--select-button-left-color);
    }

    .pip-placeholder-button:active {
        background-color: var(--click-on-button-player-color);
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
        position: relative;
    }
</style>
