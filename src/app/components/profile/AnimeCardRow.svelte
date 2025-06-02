<script>
    export let releases;
    export let type;

    import Dot from "../elements/Dot.svelte";
    import AnimePoster from "../release/AnimePoster.svelte";
</script>

<div class="anime-card-row flex-row">
    {#each releases as r}
        <button class="anime-card-release flex-column" onclick={() => updateViewportComponent(7, { id: r.id })}>
            <AnimePoster
                size={{ width: 169, height: 242 }}
                posterInfo={{ poster: r.image, title: r.title }}
                shadow={true}
                borderRadius={15}
            />
            <div class="anime-release-info flex-column">
                {#if type}
                    <div class="anime-release-addon flex-row">
                        {#if type == "rate"}
                            ★ {r.my_vote} из 5 <Dot />
                            <span class="third-text"
                                >{utils.returnTimeString(r.voted_at * 1000)}</span
                            >
                        {:else if type == "watched"}
                            {r.last_view_episode.name}
                            <Dot />
                            <span class="third-text"
                                >{utils.returnTimeString(
                                    r.last_view_timestamp * 1000,
                                )}</span
                            >
                        {/if}
                    </div>
                {/if}
                <div class="anime-release-title">
                    {r.title_ru}
                </div>
            </div>
        </button>
    {/each}
</div>

<style>
    .anime-card-row {
        width: 100%;
    }

    .anime-card-row:last-child {
        margin-bottom: 20px;
    }

    :global(.anime-release-addon svg) {
        margin-left: 8px;
        margin-right: 6px;
    }

    .anime-release-addon {
        align-items: center;
        font-size: 16px;
        color: var(--main-text-color);
        font-weight: 600;
        margin-bottom: 4px;
        margin-top: 2px;
        justify-content: center;
    }

    .third-text {
        color: var(--third-text-color);
        font-size: 12px;
        font-weight: 500;
    }

    .anime-card-release {
        margin-right: auto;
        max-width: 179px;
    }

    .anime-card-release:last-child {
        margin-right: 0px;
    }

    .anime-release-title {
        font-size: 14px;
        color: var(--main-text-color);
        font-weight: 600;
    }

    .anime-release-info {
        width: 100%;
        margin-top: 5px;
    }
</style>
