<script>
    import Preloader from "../gui/Preloader.svelte";
    import { createEventDispatcher } from "svelte";
    import { AniLibriaParser, KodikParser } from "anixartjs";
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";
    import DropdownButton from "../buttons/DropdownButton.svelte";

    const dispatch = createEventDispatcher();

    export let args;
    export let showed;

    let currentDubberId,
        currentSourceId,
        currentSourceName,
        playingSettings,
        episodes;

    let dubberList = [];
    let backgroundModal = document.querySelector(".modal-background");

    anixApi.release.getDubbers(args.id).then((v) => {
        selectDubber(v.types[0].id);
        dubberList = v.types.map((x) => ({
            label: x.name,
            value: x.id,
            icon:
                x.icon == "" || !x.icon
                    ? "./assets/icons/defaultDubber.svg"
                    : x.icon,
            description: `${x.view_count} просмотров | ${x.episodes_count} эпизодов`,
        }));
    });

    let sourceList = {
        sources: [],
    };

    const playingSettingsRaw = localStorageWritable(
        "playingSettings",
        utils.playingDefaultSettings,
    );

    playingSettingsRaw.subscribe((value) => {
        playingSettings = value;
    });

    let favoriteSourceName = utils.sourceValues.find(
        (x) => x.value === playingSettings?.defaultSource,
    ).label;

    async function selectDubber(id) {
        currentDubberId = id;

        episodes = null;

        sourceList = await anixApi.release.getDubberSources(
            args.id,
            currentDubberId,
        );

        let matchedSource = sourceList.sources.find(
            (x) => x.name == favoriteSourceName,
        );

        currentSourceId = !matchedSource
            ? sourceList.sources[0].id
            : matchedSource.id;

        currentSourceName = !matchedSource
            ? sourceList.sources[0].name
            : matchedSource.name;

        episodes = getEpisodes();

        return sourceList;
    }

    function selectSource(src) {
        currentSourceId = src;
        currentSourceName = sourceList.sources.find((x) => x.id == src).name;
    }

    function setTitle(title) {
        dispatch("setTitle", title);
    }

    async function getEpisodes() {
        return await anixApi.release.getEpisodes(
            args.id,
            currentDubberId,
            currentSourceId,
        );
    }
</script>

{#snippet baseCard(x, clickCallback)}
    <button class="base-card" onclick={clickCallback}>
        <div class="base-card-name">
            {x.name}
        </div>
        <div class="right-menu flex-row">
            {#if x.is_watched}
                <img src="./assets/icons/checkmark.svg" alt="check" />
            {/if}
        </div>
    </button>
{/snippet}

<div class="modal-title">
    <span class="title">Выбор эпизода</span>
    <div class="modal-buttons flex-row">
        <DropdownButton
            placeholder="Озвучка"
            bind:values={dubberList}
            value={currentDubberId}
            onChange={(e, v) => {
                selectDubber(v);
            }}
            height={35}
            width={280}
            outsideElement={backgroundModal}
        />
        <DropdownButton
            placeholder="Источник"
            values={sourceList.sources.map((x) => ({
                label: x.name,
                value: x.id,
                description: `${x.episodes_count} эпизодов`,
            }))}
            value={currentSourceId}
            onChange={(e, v) => {
                selectSource(v);
                episodes = getEpisodes();
            }}
            height={35}
            width={150}
            outsideElement={backgroundModal}
        />
    </div>
</div>
<div class="modal-content">
    {#key currentSourceId}
        {#if episodes}
            {#await episodes}
                <div class="center">
                    <Preloader />
                </div>
            {:then i}
                {#each i.episodes as d}
                    {@render baseCard(d, async () => {
                        let avaliableQuality, link;

                        switch (currentSourceName) {
                            case "Kodik":
                                let aQ = {};
                                const kLinks = await KodikParser.getDirectLinks(
                                    d.url,
                                );
                                for (const [key, value] of Object.entries(
                                    kLinks,
                                )) {
                                    aQ[key] = {
                                        src: value[0].src,
                                    };
                                }
                                avaliableQuality = aQ;
                                break;

                            case "Liberty":
                            case "Libria":
                                console.log(d.url);
                                const aLinks =
                                    await AniLibriaParser.getDirectLinks(d.url);
                                avaliableQuality = aLinks;
                                break;

                            case "Sibnet":
                                await utils.fallback(async (success) => {
                                    const link = await Sibnet.Parse(d.url);
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

                        if (!playingSettings.disableHistory) {
                            anixApi.release.markEpisodeAsWatched(
                                args.id,
                                currentSourceId ?? i.episodes[0].source.id,
                                d.position,
                            );
                            anixApi.release.addToHistory(
                                args.id,
                                currentSourceId ?? i.episodes[0].source.id,
                                d.position,
                            );
                        }

                        const url =
                            avaliableQuality[
                                String(playingSettings.defaultQuality)
                            ]?.src ?? avaliableQuality["720"]?.src;

                        updateViewportComponent(11, {
                            src: `${URL.canParse(url) ? url : `https:${url}`}`,
                            currentQuality: 720,
                            avaliableQuality,
                            release: args,
                            episodes: i.episodes,
                            currentEpisode: d,
                        });
                    })}
                {/each}
            {/await}
        {:else}
            <div class="center">
                <Preloader />
            </div>
        {/if}
    {/key}
</div>

<style>
    .center {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .modal-buttons {
        width: fit-content;
        margin-right: 25px;
        gap: 10px;
    }

    .modal-title {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .base-card {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        height: 40px;
        min-height: 40px;
        border-radius: 7px;
    }

    .base-card:hover {
        background-color: var(--select-button-color);
    }

    .base-card-name {
        margin-left: 10px;
        font-size: 18px;
        font-weight: bold;
        color: var(--main-text-color);
        display: flex;
        flex-direction: column;
    }

    .right-menu {
        margin-left: auto;
        margin-right: 0;
        justify-items: center;
    }
</style>
