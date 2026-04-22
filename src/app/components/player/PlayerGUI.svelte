<script>
    import PlayerDropdown from "./PlayerDropdown.svelte";
    import PlayerSettings from "./PlayerSettings.svelte";

    export let args;
    export let video;
    export let isFullscreen;
    export let isHidden;
    export let isPaused;
    export let currentTime;
    export let durationTime;
    export let progressPercent;
    export let loadedPercent;
    export let isScrubbing = false;
    export let playVideo;
    export let cEpisode = args.currentEpisode;
    export let dropdownShowed = false;
    export let transparentPercent = 50;
    export let changeQuality;
    export let changeUpscale;
    export let upscaleEnabled;
    export let changeAspectRatio;
    export let aspectRatio;
    export let togglePictureInPicture;
    export let isPictureInPictureAvailable = false;
    export let isPictureInPictureActive = false;
    export let isMuted = false;
    export let isLoading = false;

    let showTimelineMouse = false;
    let showSettings = false;
    let mousePosPercent = 0;
    let dropdownElements, dropdownType;
    let activeDropdownTrigger = null;
    export let volumePercent = 50;

    const SKIP_OPENING_SECONDS = 85;

    $: activeEpisode = cEpisode ?? args?.currentEpisode ?? args?.episodes?.[0];
    $: currentEpisodeIndex =
        args?.episodes?.findIndex((x) => x.position == activeEpisode?.position) ??
        -1;
    $: prevEpisode =
        currentEpisodeIndex > 0 ? args.episodes[currentEpisodeIndex - 1] : null;
    $: nextEpisode =
        currentEpisodeIndex >= 0
            ? args.episodes[currentEpisodeIndex + 1]
            : null;
    $: activeSource =
        (typeof activeEpisode?.source === "object" && activeEpisode?.source) ||
        args?.episodes?.find(
            (x) =>
                x?.source?.["@id"] == activeEpisode?.source ||
                x?.source?.id == activeEpisode?.source,
        )?.source ||
        args?.episodes?.[0]?.source ||
        null;
    $: activeEpisodeLabel = activeEpisode?.name ?? "Серии";
    $: activeDubberLabel = activeSource?.type?.name ?? "Озвучка";

    function togglePlaybackState() {
        if (!video) return;

        video.paused ? video.play() : video.pause();
    }

    function onClickGui(e) {
        if (showSettings) {
            showSettings = false;
        }

        if (dropdownShowed) {
            dropdownShowed = false;
        }

        const interactiveSelector = [
            ".gui-top-bar",
            ".gui-dropdown-left",
            ".gui-settings-dropdown",
            ".gui-timeline",
            ".bottom-content",
            "button",
            "input",
        ].join(", ");

        if (e.target.closest(interactiveSelector)) {
            return;
        }

        togglePlaybackState();
    }

    async function onElementClick(e) {
        const argsElement = e.detail;

        switch (argsElement.type) {
            case "episodes":
                if (argsElement.history.find((x) => x.type == "related")) {
                    let rr = argsElement.history.find(
                        (x) => x.type == "related",
                    ).selectedValue;

                    rr.related = args.release.related;
                    rr.related_count = args.release.related_count;

                    args.release = rr;
                }
                if (argsElement.history.find((x) => x.type == "dubbers"))
                    args.episodes = argsElement.elements.map((x) => x.value);

                cEpisode = argsElement.value;
                args.currentEpisode = argsElement.value;
                playVideo(argsElement.value);
                argsElement.close();
                break;

            case "dubbers":
                const r = argsElement.history.find(
                    (x) => x.type == "related",
                )?.selectedValue;

                const s = await anixApi.release.getDubberSources(
                    r ? r.id : args.release.id,
                    argsElement.value.id,
                );

                let elements = [];
                let value = argsElement.value;
                let type = "sources";

                if (s.sources.length == 1) {
                    const ep = await anixApi.release.getEpisodes(
                        r ? r.id : args.release.id,
                        argsElement.value.id,
                        s.sources[0].id,
                    );

                    type = "episodes";
                    value = s.sources[0];

                    elements = ep.episodes.map((x) => ({
                        title: x.name,
                        subtitle: `${argsElement.value.name} | ${ep.episodes[0].source.name}`,
                        value: x,
                    }));
                } else {
                    elements = s.sources.map((x) => ({
                        title: x.name,
                        subtitle: `${x.episodes_count} Эпизодов`,
                        image: {
                            type: "default",
                            src: x.icon ?? "./assets/icons/defaultDubber.svg",
                        },
                        value: x,
                    }));
                }

                argsElement.nextPage(argsElement.value, elements, type);
                break;

            case "sources":
                const related = argsElement.history.find(
                    (x) => x.type == "related",
                )?.selectedValue;

                const dubber = argsElement.history.find(
                    (x) => x.type == "dubbers",
                ).selectedValue;

                const ep = await anixApi.release.getEpisodes(
                    related ? related.id : args.release.id,
                    dubber.id,
                    argsElement.value.id,
                );
                argsElement.nextPage(
                    argsElement.value,
                    ep.episodes.map((x) => ({
                        title: x.name,
                        subtitle: `${dubber.name} | ${ep.episodes[0].source.name}`,
                        value: x,
                    })),
                    "episodes",
                );
                break;

            case "related":
                const dubbers = await anixApi.release.getDubbers(
                    argsElement.value.id,
                );
                argsElement.nextPage(
                    argsElement.value,
                    dubbers.types.map((z) => ({
                        title: z.name,
                        subtitle: `${z.episodes_count} Эпизодов`,
                        image: {
                            type: "default",
                            src: z.icon ?? "./assets/icons/defaultDubber.svg",
                        },
                        value: z,
                    })),
                    "dubbers",
                );
                break;
        }
    }

    function showEpisodesDropdown(e) {
        e.stopPropagation();
        if (dropdownShowed && activeDropdownTrigger === "episodes") {
            dropdownShowed = false;
            activeDropdownTrigger = null;
            return;
        }

        dropdownElements = args.episodes.map((x) => ({
            title: x.name,
            subtitle: `${args.episodes[0].source.type.name} | ${args.episodes[0].source.name}`,
            value: x,
        }));
        dropdownType = "episodes";
        activeDropdownTrigger = "episodes";
        dropdownShowed = true;
    }

    async function showDubbersDropdown(e) {
        e.stopPropagation();
        if (dropdownShowed && activeDropdownTrigger === "dubbers") {
            dropdownShowed = false;
            activeDropdownTrigger = null;
            return;
        }

        const dubbers = await anixApi.release.getDubbers(args.release.id);
        dropdownElements = dubbers.types.map((z) => ({
            title: z.name,
            subtitle: `${z.episodes_count} Эпизодов`,
            image: {
                type: "default",
                src: z.icon ?? "./assets/icons/defaultDubber.svg",
            },
            value: z,
        }));
        dropdownType = "dubbers";
        activeDropdownTrigger = "dubbers";

        dropdownShowed = true;
    }

    function playerMouseMove(e) {
        if (isScrubbing) {
            const timelineContainer = document.querySelector(".gui-timeline");
            const rect = timelineContainer.getBoundingClientRect();

            const percent =
                (Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width) *
                100;

            video.currentTime = (video.duration / 100) * percent;
            currentTime = utils.returnFormatedTime(video.currentTime);
            progressPercent = percent;
        }
    }

    function playerMouseUp(e) {
        if (isScrubbing) {
            isScrubbing = false;
            video.play();
        }
    }

    function timelineMouseMove(e) {
        const timelineContainer = document.querySelector(".gui-timeline");
        const rect = timelineContainer.getBoundingClientRect();

        const percent =
            (Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width) *
            100;
        mousePosPercent = percent;

        if (isScrubbing) {
            video.currentTime = (video.duration / 100) * percent;
            currentTime = utils.returnFormatedTime(video.currentTime);
            progressPercent = percent;
        }
    }

    function timelineMouseDown(e) {
        if (!isScrubbing) {
            isScrubbing = true;
            video.pause();

            const timelineContainer = document.querySelector(".gui-timeline");
            const rect = timelineContainer.getBoundingClientRect();

            const percent =
                (Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width) *
                100;

            video.currentTime = (video.duration / 100) * percent;
            currentTime = utils.returnFormatedTime(video.currentTime);
            progressPercent = percent;
        }
    }

    function timelineMouseUp(e) {
        isScrubbing = false;
        video.play();
    }

    function togglePlayback(e) {
        e.stopPropagation();
        togglePlaybackState();
        e.currentTarget.blur();
    }

    async function playAdjacentEpisode(offset, e) {
        e.stopPropagation();
        if (!args?.episodes?.length || currentEpisodeIndex < 0) return;

        const nextTargetEpisode = args.episodes[currentEpisodeIndex + offset];
        if (!nextTargetEpisode) return;

        cEpisode = nextTargetEpisode;
        args.currentEpisode = nextTargetEpisode;
        try {
            await playVideo(cEpisode);
        } catch (error) {
            console.warn("Не удалось переключить серию.", error);
        }
    }

    function skipOpening(e) {
        e.stopPropagation();
        if (!video || !video.duration) return;

        const nextTime = Math.min(
            video.duration || video.currentTime + SKIP_OPENING_SECONDS,
            video.currentTime + SKIP_OPENING_SECONDS,
        );

        video.currentTime = nextTime;
        progressPercent = (video.currentTime / video.duration) * 100;
        currentTime = utils.returnFormatedTime(video.currentTime);
    }

    function toggleMute(e) {
        e.stopPropagation();
        if (!video) return;

        video.muted = !video.muted;
    }
</script>

<div
    class="player-gui"
    class:hide-gui={isHidden && !isPaused}
    style="--back-transparent: {transparentPercent / 100}"
    onmousemove={playerMouseMove}
    onmouseup={playerMouseUp}
    onclick={onClickGui}
>
    <div class="gui-top-bar">
        <div class="gui-top-content">
            <div class="gui-title flex-column">
                <span class="gui-release-title">{args.release.title_ru}</span>
                <div class="gui-release-episode">
                    <button
                        class="gui-release-meta-button"
                        onclick={showDubbersDropdown}
                        title="Открыть список озвучек"
                    >
                        {activeDubberLabel}
                    </button>
                    <span class="gui-release-meta-separator">|</span>
                    <button
                        class="gui-release-meta-button"
                        onclick={showEpisodesDropdown}
                        title="Открыть список серий"
                    >
                        {activeEpisodeLabel}
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="gui-middle-bar">
        <button
            class="gui-side-button"
            class:disabled-button={!prevEpisode}
            disabled={!prevEpisode}
            onclick={(e) => {
                if (prevEpisode) {
                    playAdjacentEpisode(-1, e);
                }
            }}
        >
            <img
                class="rotated-icon"
                src="./assets/icons/next.svg"
                alt="previous episode"
                width="16px"
                height="16px"
            />
        </button>
        <button class="gui-play-button" onclick={togglePlayback}>
            {#if isLoading}
                <span class="play-loader"></span>
            {:else if isPaused}
                <span class="play-icon"></span>
            {:else}
                <span class="pause-icon">
                    <span></span>
                    <span></span>
                </span>
            {/if}
        </button>
        <button
            class="gui-side-button"
            class:disabled-button={!nextEpisode}
            disabled={!nextEpisode}
            onclick={(e) => {
                if (nextEpisode) {
                    playAdjacentEpisode(1, e);
                }
            }}
        >
            <img
                src="./assets/icons/next.svg"
                alt="next episode"
                width="16px"
                height="16px"
            />
        </button>
    </div>
    <div class="gui-dropdown-left flew-column">
        <PlayerDropdown
            elements={dropdownElements}
            bind:isShow={dropdownShowed}
            bind:type={dropdownType}
            on:elementClick={onElementClick}
        />
    </div>
    <div class="gui-settings-dropdown flew-column">
        <PlayerSettings
            bind:isShow={showSettings}
            currentSettings={{
                currentQuality: args.currentQuality,
                avaliableQuality: args.avaliableQuality,
                upscaleEnabled,
                aspectRatio,
            }}
            {changeQuality}
            {changeUpscale}
            {changeAspectRatio}
            {video}
        />
    </div>
    <div class="gui-bottom-bar flex-column">
        <div class="top-content container flex-row">
            <div class="bottom-status-row">
                <div class="time-container">
                    <div class="time-info flex-row">
                        <span id="current-time">{currentTime ?? "00:00"}</span>
                        <span class="delimiter">/</span>
                        <span id="duration-time">{durationTime ?? "00:00"}</span
                        >
                    </div>
                </div>
                <div class="bottom-secondary-actions flex-row">
                    <div
                        class="gui-volume-shell"
                        onclick={(e) => e.stopPropagation()}
                    >
                        <button
                            class="player-icon-button gui-volume-button"
                            class:active-button={!isMuted && volumePercent > 0}
                            onclick={toggleMute}
                            title={isMuted ? "Включить звук" : "Выключить звук"}
                        >
                            {#if isMuted}
                                <svg
                                    class="utility-icon volume-symbol"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M4 10.5C4 9.94772 4.44772 9.5 5 9.5H8.08579L12.2929 5.29289C12.9229 4.66292 14 5.10919 14 6V18C14 18.8908 12.9229 19.3371 12.2929 18.7071L8.08579 14.5H5C4.44772 14.5 4 14.0523 4 13.5V10.5Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M17.25 9.25L20.75 12.75M20.75 9.25L17.25 12.75"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                    />
                                </svg>
                            {:else}
                                <svg
                                    class="utility-icon volume-symbol"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M4 10.5C4 9.94772 4.44772 9.5 5 9.5H8.08579L12.2929 5.29289C12.9229 4.66292 14 5.10919 14 6V18C14 18.8908 12.9229 19.3371 12.2929 18.7071L8.08579 14.5H5C4.44772 14.5 4 14.0523 4 13.5V10.5Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M17.5 9.5C18.3284 10.3284 18.7938 11.4519 18.7938 12.6235C18.7938 13.7951 18.3284 14.9186 17.5 15.747"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                    />
                                    <path
                                        d="M15.75 7.25C17.1753 8.67525 17.976 10.6084 17.976 12.624C17.976 14.6397 17.1753 16.5728 15.75 17.998"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                    />
                                </svg>
                            {/if}
                        </button>
                        <div class="gui-volume-slider">
                            <input
                                type="range"
                                id="volume-position"
                                min="0"
                                max="1"
                                step="0.01"
                                class="volume-input"
                                style="--volume-position: {volumePercent}%"
                                oninput={function () {
                                    volumePercent =
                                        ((this.value - this.min) /
                                            (this.max - this.min)) *
                                        100;
                                }}
                            />
                        </div>
                    </div>
                    <button
                        class="player-icon-button"
                        onclick={skipOpening}
                        title="Пропуск опенинга"
                    >
                        <img
                            class="utility-icon"
                            src="./assets/icons/skipOp.svg"
                            alt="skip opening"
                        />
                    </button>
                    <button
                        class="player-icon-button"
                        onclick={(e) => {
                            e.stopPropagation();
                            showSettings = !showSettings;
                        }}
                        title="Настройки"
                    >
                        <img
                            class="utility-icon"
                            src="./assets/icons/settingsFilled.svg"
                            alt="settings"
                        />
                    </button>
                    <button
                        class="player-icon-button"
                        class:disabled-button={!isPictureInPictureAvailable}
                        class:active-button={isPictureInPictureActive}
                        onclick={() => {
                            if (isPictureInPictureAvailable) {
                                togglePictureInPicture();
                            }
                        }}
                        title="PiP"
                    >
                        <img
                            class="utility-icon"
                            src="./assets/icons/pipButton.svg"
                            alt="PiP"
                        />
                    </button>
                    <button
                        class="player-icon-button"
                        onclick={() => {
                            isFullscreen
                                ? elecWindow.exitFullscreen()
                                : elecWindow.enterFullscreen();
                        }}
                        title="Полный экран"
                    >
                        <img
                            class="utility-icon"
                            src="./assets/icons/{isFullscreen
                                ? 'exitFullscreen.svg'
                                : 'joinFullscreen.svg'}"
                            alt="fullscreen"
                        />
                    </button>
                </div>
            </div>
        </div>
        <div class="middle-content container flex-row">
            <div
                class="gui-timeline"
                onmouseenter={() => {
                    showTimelineMouse = true;
                }}
                onmouseleave={() => {
                    showTimelineMouse = false;
                }}
                onmousemove={timelineMouseMove}
                onmousedown={timelineMouseDown}
                onmouseup={timelineMouseUp}
            >
                <div
                    class="timeline"
                    style="--progress-position: {progressPercent}%; --loaded-position: {loadedPercent}%"
                >
                    <div
                        class="timeline-dot"
                        style={isScrubbing ? "--scale: 1.6" : ""}
                    ></div>
                    <div
                        class="timeline-mouse"
                        style="--mouse-position: {mousePosPercent}%"
                        class:hide={!showTimelineMouse || isScrubbing}
                    ></div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :global(:root) {
        --player-utility-button-size: 40px;
    }

    .player-gui {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 2;
        background-color: rgba(0, 0, 0, var(--back-transparent));
        transition: opacity 0.5s;
        opacity: 1;
    }

    .gui-dropdown-left {
        position: absolute;
        top: 78px;
        left: 0;
        z-index: 3;
    }

    .gui-settings-dropdown {
        position: absolute;
        bottom: 88px;
        right: 15px;
        z-index: 5;
    }

    .bottom-disabled {
        opacity: 0.7;
    }

    .bottom-disabled:hover {
        background-color: var(--alt-background-color) !important;
    }

    .bottom-disabled:active {
        background-color: var(--alt-background-color) !important;
    }

    .bottom-disabled:hover {
        cursor: default;
    }

    .player-bottom-button {
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0 18px;
        border-radius: 40px;
        background-color: rgba(26, 26, 26, 0.82);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: background-color 0.15s ease-in-out;
        color: var(--main-text-color);
        box-sizing: border-box;
    }

    .player-bottom-button:hover {
        background-color: var(--select-button-left-color);
    }

    .player-bottom-button:active {
        background-color: var(--click-on-button-player-color);
    }

    .player-bottom-button img {
        margin-right: 8px;
    }

    .player-bottom-button span {
        font-size: 14px;
        font-weight: 500;
        white-space: pre;
    }

    .timeline {
        width: 100%;
        height: 5px;
        background-color: var(--alt-background-color);
        border-radius: 5px;
        position: relative;
    }

    .timeline .timeline-mouse {
        position: absolute;
        left: 0;
        height: 5px;
        background-color: var(--main-text-color);
        opacity: 0.4;
        width: var(--mouse-position, 0);
        border-radius: 5px;
    }

    .timeline .timeline-dot {
        --scale: 1.3;
        position: absolute;
        left: var(--progress-position, 0);
        transform: translateX(-50%) scale(var(--scale));
        transition: transform 150ms ease-in-out;
        aspect-ratio: 1 / 1;
        border-radius: 100%;
        height: 200%;
        top: -50%;
        background-color: var(--main-text-color);
        z-index: 2;
    }

    .timeline .timeline-dot:hover {
        --scale: 1.6;
    }

    .timeline::before {
        content: "";
        width: var(--loaded-position, 0);
        background-color: var(--player-timeline-loaded-color);
        height: 5px;
        border-radius: 5px;
        position: absolute;
        left: 0;
        transition: all 0.1s ease-in-out;
    }

    .timeline::after {
        content: "";
        width: var(--progress-position, 0);
        background-color: var(--player-timeline-progress-color);
        height: 5px;
        border-radius: 5px;
        position: absolute;
        left: 0;
    }

    .time-info {
        align-items: center;
        justify-content: center;
        justify-items: center;
        background-color: var(--alt-background-color);
        color: var(--main-text-color);
        border-radius: 50px;
        padding: 0 15px;
        font-size: 12px;
        width: max-content;
        height: 30px;
        margin-bottom: 5px;
        min-width: 76px;
    }

    .delimiter {
        margin: 0 auto;
    }

    .hide-gui {
        animation: hide-gui 0.25s forwards;
    }

    /* Keyframe animations */
    @keyframes hide-gui {
        100% {
            opacity: 0;
            display: none;
        }
    }

    .gui-bottom-bar {
        position: absolute;
        bottom: 10px;
        left: 0;
        right: 0;
        display: flex;
        z-index: 3;
        justify-content: flex-end;
        color: var(--main-text-color);
        font-size: 12px;
        align-items: center;
        vertical-align: middle;
    }

    .gui-middle-bar {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        right: 0;
        z-index: 3;
        display: flex;
        width: max-content;
        margin: 0 auto;
        gap: 14px;
        align-items: center;
    }

    .time-container {
        height: 100%;
        display: flex;
        align-items: end;
    }

    .bottom-status-row {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 0 15px 8px;
        box-sizing: border-box;
        flex-wrap: wrap;
    }

    .gui-timeline {
        width: 100%;
        margin: 5px 15px;
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
        position: relative;
        height: 15px;
    }

    .gui-play-button {
        display: flex;
        border-radius: 100%;
        width: 72px;
        height: 72px;
        text-align: center;
        justify-content: center;
        align-items: center;
        background-color: var(--player-middle-button);
        transition: background-color 0.2s ease-in-out;
        color: var(--main-text-color);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
        box-sizing: border-box;
    }

    .gui-play-button:hover {
        background-color: var(--player-middle-button-select);
    }

    .play-loader {
        width: 28px;
        height: 28px;
        border: 3px solid currentColor;
        border-bottom-color: transparent;
        border-radius: 50%;
        box-sizing: border-box;
        animation: play-loader-rotation 0.8s linear infinite;
    }

    .gui-side-button {
        display: flex;
        width: 38px;
        height: 38px;
        border-radius: 100%;
        justify-content: center;
        align-items: center;
        background-color: rgba(26, 26, 26, 0.82);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition:
            background-color 0.2s ease-in-out,
            transform 0.2s ease-in-out;
        box-sizing: border-box;
    }

    .gui-side-button:hover {
        background-color: rgba(255, 255, 255, 0.18);
        transform: scale(1.03);
    }

    .gui-top-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 4;
        padding: 20px 24px 0;
        box-sizing: border-box;
    }

    .gui-top-content {
        display: flex;
        align-items: flex-start;
    }

    .gui-title {
        margin: 0;
        min-width: 0;
        flex: 1 1 auto;
    }

    .gui-release-title {
        font-size: 24px;
        color: #fff;
        font-weight: 400;
        line-height: 1.15;
    }

    .gui-release-meta-button,
    .gui-release-meta-separator {
        color: var(--secondary-text-color);
        font-size: 15px;
        line-height: 1.35;
    }

    .gui-release-meta-button {
        display: block;
        flex: 0 1 auto;
        min-width: 0;
        padding: 0;
        border: none;
        background: transparent;
        text-align: left;
        text-decoration: none;
        transition: color 0.15s ease-in-out;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .gui-release-meta-button:hover {
        color: var(--main-text-color);
        text-decoration: underline;
        text-underline-offset: 3px;
    }

    .gui-release-meta-button:active {
        color: var(--main-text-color);
    }

    .gui-release-meta-separator {
        margin: 0 6px;
        user-select: none;
    }

    .gui-release-episode {
        display: flex;
        align-items: center;
        width: fit-content;
        max-width: min(100%, 560px);
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
    }

    .gui-fullscreen {
        display: flex;
        margin-left: 10px;
        margin-top: 5px;
        margin-bottom: 5px;
        margin-right: 5px;
        border-radius: 10px;
        width: 40px;
        height: 25px;
        text-align: center;
        justify-content: center;
        align-items: center;
        background-color: var(--alt-background-color);
    }

    .gui-bottom-button {
        width: 45px;
        height: 45px;
        border-radius: 100%;
        display: flex;
        margin: 3px;
        background-color: rgba(26, 26, 26, 0.82);
        transition: background-color 0.2s ease-in-out;
        justify-content: center;
        align-items: center;
        color: var(--main-text-color);
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .gui-bottom-button:hover {
        background-color: var(--player-middle-button-select);
    }

    .disabled-button {
        opacity: 0.6;
        cursor: default;
    }

    .disabled-button:hover {
        background-color: transparent;
    }

    .active-button {
        background-color: var(--player-middle-button-select);
    }

    .container {
        width: 100%;
        box-sizing: border-box;
    }

    .bottom-secondary-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
    }

    .bottom-secondary-actions {
        margin-left: auto;
        justify-content: flex-end;
    }

    .player-icon-button {
        width: var(--player-utility-button-size);
        height: var(--player-utility-button-size);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
        border-radius: 100%;
        background-color: rgba(26, 26, 26, 0.82);
        color: var(--main-text-color);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: background-color 0.2s ease-in-out;
        box-sizing: border-box;
        flex: 0 0 var(--player-utility-button-size);
    }

    .utility-icon {
        width: 20px;
        height: 20px;
        display: block;
        flex: 0 0 20px;
        object-fit: contain;
    }

    .player-icon-button:hover {
        background-color: var(--player-middle-button-select);
    }

    .gui-volume-shell {
        display: flex;
        align-items: center;
        width: var(--player-utility-button-size);
        height: var(--player-utility-button-size);
        margin: 0;
        padding-right: 0;
        border-radius: 999px;
        background-color: rgba(26, 26, 26, 0.82);
        border: 1px solid rgba(255, 255, 255, 0.08);
        overflow: hidden;
        box-sizing: border-box;
        flex: 0 0 auto;
        transition:
            width 0.2s ease-in-out,
            padding-right 0.2s ease-in-out,
            background-color 0.2s ease-in-out,
            border-color 0.2s ease-in-out;
    }

    .gui-volume-shell:hover,
    .gui-volume-shell:focus-within {
        width: 124px;
        padding-right: 10px;
        background-color: rgba(34, 34, 34, 0.94);
        border-color: rgba(255, 255, 255, 0.14);
    }

    .gui-volume-button {
        flex: 0 0 var(--player-utility-button-size);
        border: none;
        background: transparent;
        box-shadow: none;
    }

    .gui-volume-slider {
        width: 0;
        opacity: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 0;
        overflow: hidden;
        transition:
            width 0.2s ease-in-out,
            opacity 0.15s ease-in-out;
    }

    .gui-volume-shell:hover .gui-volume-slider,
    .gui-volume-shell:focus-within .gui-volume-slider {
        width: 66px;
        opacity: 1;
    }

    .rotated-icon {
        transform: rotate(180deg);
    }

    .play-icon {
        width: 0;
        height: 0;
        margin-left: 5px;
        border-top: 12px solid transparent;
        border-bottom: 12px solid transparent;
        border-left: 18px solid currentColor;
    }

    .pause-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .pause-icon span {
        width: 8px;
        height: 28px;
        border-radius: 999px;
        background-color: currentColor;
    }

    .volume-symbol {
        color: currentColor;
    }

    .volume-input {
        appearance: none;
        width: 100%;
        height: 6px;
        border-radius: 9999px;
        background: linear-gradient(90deg, #ffffff var(--volume-position, 0), #5a5a5a var(--volume-position, 0));
        cursor: pointer;
    }

    .volume-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 9999px;
        background: #f0f0f0;
        box-shadow: none;
    }

    @keyframes play-loader-rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 960px) {
        .gui-top-bar {
            padding: 18px 16px 0;
        }

        .gui-dropdown-left {
            top: 72px;
        }

        .gui-release-episode {
            max-width: 100%;
        }

        .gui-play-button {
            width: 62px;
            height: 62px;
        }

        .pause-icon span {
            height: 24px;
        }

        .gui-side-button {
            width: 36px;
            height: 36px;
        }

        .bottom-status-row {
            gap: 10px;
        }

        .bottom-secondary-actions {
            gap: 4px;
        }

        .gui-volume-shell:hover,
        .gui-volume-shell:focus-within {
            width: 114px;
        }

        .gui-volume-shell:hover .gui-volume-slider,
        .gui-volume-shell:focus-within .gui-volume-slider {
            width: 56px;
        }
    }
</style>
