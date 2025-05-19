<script>
    import utils from "../../utils";
    import SliderButton from "../buttons/SliderButton.svelte";
    import { fly } from "svelte/transition";
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";

    export let currentSettings;
    export let isShow;
    export let changeQuality;
    export let changeUpscale;
    export let changeAspectRatio;
    export let video;

    let page = 0;
    let transitionDirection = 1;

    let upscaleSettings;

    const upscaleSettingsRaw = localStorageWritable(
        "upscaleSettings",
        utils.upscaleDefaultSettings,
    );

    upscaleSettingsRaw.subscribe((value) => {
        upscaleSettings = value;
    });
</script>

{#if isShow}
    <div
        class="player-settings flex-column"
        onclick={(e) => e.stopPropagation()}
        onwheel={(e) => e.stopPropagation()}
    >
        {#if page === 0}
            <div
                class="page"
                in:fly={{ x: 300 * transitionDirection, duration: 250 }}
                out:fly={{ x: -300 * transitionDirection, duration: 250 }}
            >
                <button
                    class="player-settings-element"
                    onclick={() => {
                        transitionDirection = 1;
                        page = 1;
                    }}
                >
                    <span class="btn-title">Качество:</span>
                    <span>{currentSettings.currentQuality}p →</span>
                </button>
                <div class="player-settings-element" class:disabled={!upscaleSettings.enabled || !avaliableGPU}>
                    <span class="btn-title">Улучшение качества:</span>
                    <SliderButton
                        disabled={!upscaleSettings.enabled || !avaliableGPU}
                        value={!avaliableGPU ? false : currentSettings.upscaleEnabled}
                        onClickCallback={(value) => changeUpscale(value)}
                    />
                </div>
                <button
                    class="player-settings-element"
                    onclick={() => {
                        transitionDirection = 1;
                        page = 2;
                    }}
                >
                    <span class="btn-title">Соотношение сторон:</span>
                    <span>{currentSettings.aspectRatio} →</span>
                </button>
                <button
                    class="player-settings-element"
                    onclick={() => {
                        transitionDirection = 1;
                        page = 3;
                    }}
                >
                    <span class="btn-title">Скорость:</span>
                    <span
                        >{utils.playerSpeedValues.find(
                            (x) => x.value == video.playbackRate,
                        ).label} →</span
                    >
                </button>
            </div>
        {:else if page === 1}
            <div
                class="page"
                in:fly={{ x: 300 * transitionDirection, duration: 250 }}
                out:fly={{ x: -300 * transitionDirection, duration: 250 }}
            >
                <button
                    class="player-settings-element back"
                    onclick={() => {
                        transitionDirection = -1;
                        page = 0;
                    }}
                >
                    ← Назад
                </button>
                {#each Object.keys(currentSettings.avaliableQuality).reverse() as option}
                    <button
                        class="player-settings-element"
                        onclick={() => {
                            transitionDirection = -1;
                            changeQuality(option);
                            page = 0;
                        }}
                    >
                        {option}p
                    </button>
                {/each}
            </div>
        {:else if page === 2}
            <div
                class="page"
                in:fly={{ x: 300 * transitionDirection, duration: 250 }}
                out:fly={{ x: -300 * transitionDirection, duration: 250 }}
            >
                <button
                    class="player-settings-element back"
                    onclick={() => {
                        transitionDirection = -1;
                        page = 0;
                    }}
                >
                    ← Назад
                </button>
                {#each utils.aspectRatioValues as option}
                    <button
                        class="player-settings-element"
                        onclick={() => {
                            transitionDirection = -1;
                            currentSettings.aspectRatio = option.label;
                            changeAspectRatio(option.value);
                            page = 0;
                        }}
                    >
                        {option.label}
                    </button>
                {/each}
            </div>
        {:else if page === 3}
            <div
                class="page"
                in:fly={{ x: 300 * transitionDirection, duration: 250 }}
                out:fly={{ x: -300 * transitionDirection, duration: 250 }}
            >
                <button
                    class="player-settings-element back"
                    onclick={() => {
                        transitionDirection = -1;
                        page = 0;
                    }}
                >
                    ← Назад
                </button>
                {#each utils.playerSpeedValues as option}
                    <button
                        class="player-settings-element"
                        onclick={() => {
                            transitionDirection = -1;
                            video.playbackRate = option.value;
                            page = 0;
                        }}
                    >
                        {option.label}
                    </button>
                {/each}
            </div>
        {/if}
    </div>
{/if}

<style>
    .player-settings {
        background-color: var(--background-color);
        width: 250px;
        border-radius: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        overflow: hidden;
        position: relative;
    }

    .btn-title {
        font-weight: bold;
    }

    .page {
        width: 250px !important;
        height: 100% !important;
        min-width: 250px !important;
        display: flex;
        flex-direction: column;
    }

    .player-settings-element {
        height: 40px;
        font-size: 14px;
        color: var(--main-text-color);
        text-align: left;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 15px;
        box-sizing: border-box;
    }

    .player-settings-element:hover {
        background-color: var(--alt-background-color);
    }
</style>
