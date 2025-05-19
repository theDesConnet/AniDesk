<script>
    import Preloader from "../gui/Preloader.svelte";
    import { createEventDispatcher } from "svelte";
    import { AniLibriaParser, SibnetParser, KodikParser } from "anixartjs";
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";

    const dispatch = createEventDispatcher();

    export let args;
    export let showed;

    let state = 0;

    let dubberId, sourceId, sourceName, playingSettings;

    const playingSettingsRaw = localStorageWritable(
        "playingSettings",
        utils.playingDefaultSettings,
    );

    playingSettingsRaw.subscribe((value) => {
        playingSettings = value;
    });

    function setTitle(title) {
        dispatch("setTitle", title);
    }

    async function getEpisodes(id, dubberId, sourceId) {
        if (typeof sourceId === "string") {
            const sources = await anixApi.release.getDubberSources(
                id,
                dubberId,
            );
            let matched = sources.sources.find((x) => x.name === sourceId);

            if (!matched) {
                state = 1;
                return null;
            }

            sourceId = matched.id;
        }
        return await anixApi.release.getEpisodes(id, dubberId, sourceId);
    }
</script>

{#snippet baseCard(type, x, clickCallback)}
    <div class="base-card" onclick={clickCallback}>
        {#if type === "dub" || type === "source"}
            <div class="base-card-image">
                {#if !x?.icon || x.icon.trim() === ""}
                    <img
                        src="./assets/icons/defaultDubber.svg"
                        alt="defaultDubber"
                    />
                {:else}
                    <img width="65" height="65" src={x.icon} alt={x.name} />
                {/if}
            </div>
        {/if}
        <div class="base-card-name">
            {x.name}
            {#if type === "dub"}
                <div class="base-card-episodes">
                    {x.episodes_count} эпизодов
                </div>
            {/if}
        </div>
        {#if type === "dub" || type === "source"}
            <div class="base-card-views">
                {#if type === "dub"}
                    {x.view_count}
                    <img src="./assets/icons/view.svg" alt="view" />
                {:else}
                    {x.episodes_count} Эпизодов
                {/if}
            </div>
        {/if}
        {#if type === "episode"}
            <div class="right-menu flex-row">
                {#if x.is_watched}
                    <img src="./assets/icons/checkmark.svg" alt="check" />
                {/if}
            </div>
        {/if}
    </div>
{/snippet}

{#if state === 0}
    {setTitle("Выбор озвучки")}
    <div class="modal-title">Выберите озвучку</div>
    {#await anixApi.release.getDubbers(args.id)}
        <div class="center">
            <Preloader />
        </div>
    {:then i}
        <div class="modal-content">
            {#each i.types as d}
                {@render baseCard("dub", d, () => {
                    dubberId = d.id;
                    state = playingSettings?.defaultSource != null ? 2 : 1;
                    sourceName = utils.sourceValues.find(
                        (x) => x.value === playingSettings?.defaultSource,
                    ).label;
                })}
            {/each}
        </div>
    {/await}
{:else if state === 1}
    {setTitle("Выбор источника")}
    <div class="modal-title">Выберите источник</div>
    {#await anixApi.release.getDubberSources(args.id, dubberId)}
        <div class="center">
            <Preloader />
        </div>
    {:then i}
        <div class="modal-content">
            {#each i.sources as d}
                {@render baseCard("source", d, () => {
                    sourceId = d.id;
                    sourceName = d.name;
                    state = 2;
                })}
            {/each}
        </div>
    {/await}
{:else if state === 2}
    {setTitle("Выбор зпизода")}
    <div class="modal-title">Выберите эпизод</div>

    {#await getEpisodes(args.id, dubberId, sourceId ?? sourceName)}
        <div class="center">
            <Preloader />
        </div>
    {:then i}
        <div class="modal-content">
            {#each i.episodes as d}
                {@render baseCard("episode", d, async () => {
                    let avaliableQuality, link;
                    switch (sourceName) {
                        case "Kodik":
                            let aQ = {};
                            const kLinks = await KodikParser.getDirectLinks(
                                d.url,
                            );
                            for (const [key, value] of Object.entries(kLinks)) {
                                aQ[key] = {
                                    src: value[0].src,
                                };
                            }
                            avaliableQuality = aQ;
                            break;

                        case "Libria":
                            const aLinks = await AniLibriaParser.getDirectLinks(
                                d.url,
                            );
                            avaliableQuality = aLinks.files.filter(
                                (x) => x.id == `s${d.position}`,
                            )[0].file;
                            break;

                        case "Sibnet":
                            avaliableQuality = {
                                "720": {
                                    src: await Sibnet.Parse(
                                        d.url,
                                    ),
                                },
                            };
                            break;
                    }

                    if (!playingSettings.disableHistory) {
                        anixApi.release.markEpisodeAsWatched(
                            args.id,
                            sourceId ?? i.episodes[0].source.id,
                            d.position,
                        );
                        anixApi.release.addToHistory(
                            args.id,
                            sourceId ?? i.episodes[0].source.id,
                            d.position,
                        );
                    }

                    const url =
                        avaliableQuality[String(playingSettings.defaultQuality)]
                            ?.src ?? avaliableQuality["720"]?.src;

                    updateViewportComponent(10, {
                        src: `${URL.canParse(url) ? url : `https:${url}`}`,
                        currentQuality: 720,
                        avaliableQuality,
                        release: args,
                        episodes: i.episodes,
                        currentEpisode: d,
                    });
                })}
            {/each}
        </div>
    {/await}
{/if}

<style>
    .center {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .base-card {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        border-bottom: 1px solid var(--secondary-text-color);
        margin-top: 10px;
        padding-bottom: 5px;
    }

    .base-card:first-child {
        margin-top: 0px;
    }

    .base-card-name {
        margin-left: 10px;
        font-size: 18px;
        font-weight: bold;
        color: var(--main-text-color);
        display: flex;
        flex-direction: column;
    }

    .base-card-episodes {
        font-size: 14px;
        color: var(--secondary-text-color);
    }

    .base-card-views {
        font-size: 14px;
        color: var(--secondary-text-color);
        font-weight: bold;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: auto;
        margin-right: 0px;
        float: right;
    }

    .base-card-views img {
        margin-left: 5px;
    }

    .base-card-image img {
        border-radius: 100%;
    }

    .right-menu {
        margin-left: auto;
        margin-right: 0;
        justify-items: center;
    }
</style>
