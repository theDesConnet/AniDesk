<script>
    import AnimeRowItem from "../components/elements/AnimeFullRowCard.svelte";
    import MetaInfo from "../components/gui/MetaInfo.svelte";
    import Preloader from "../components/gui/Preloader.svelte";

    export let args;
    let page = 0;
    let filterArgs = { sort: 0, status_id: null, category_id: null };
    let allData = [];
    let firstData = anixApi.release.filter(page, filterArgs, true);

    let updateInfo = false;

    async function getMainPage() {
        const data = await anixApi.release.filter(page, filterArgs, true);
        allData = allData.concat(data.content);
        updateInfo = false;
    }

    function setReleasesType(type) {
        if (args.typeReleases === type) return;
        let viewport = document.getElementById("viewport");

        args.typeReleases = type;
        page = 0;
        allData = [];
        switch (type) {
            case 0:
                filterArgs = { sort: 0, status_id: null, category_id: null };
                break;

            case 1:
                filterArgs.status_id = 2;
                filterArgs.category_id = null;
                break;

            case 2:
                filterArgs.status_id = 3;
                filterArgs.category_id = null;
                break;

            case 3:
                filterArgs.status_id = 1;
                filterArgs.category_id = null;
                break;

            case 4:
                filterArgs.category_id = 2;
                filterArgs.status_id = null;
                break;
        }

        firstData = anixApi.release.filter(page, filterArgs, true);
        viewport.scrollTop = 0;
    }

    setViewportScrollEvent(async (e) => {
        if (
            e.srcElement.scrollTop >= e.srcElement.scrollHeight - 2000 &&
            !updateInfo
        ) {
            updateInfo = true;
            page++;
            await getMainPage();
        }
    });
</script>

<MetaInfo subTitle="Главная" />

<div class="releases-type flex-row">
    <button
        class="releases-type-title flex-column"
        class:selected={args?.typeReleases == 0}
        onclick={() => setReleasesType(0)}>Последние</button
    >
    <button
        class="releases-type-title flex-column"
        class:selected={args?.typeReleases == 1}
        onclick={() => setReleasesType(1)}>Онгоинги</button
    >
    <button
        class="releases-type-title flex-column"
        class:selected={args?.typeReleases == 2}
        onclick={() => setReleasesType(2)}>Анонсы</button
    >
    <button
        class="releases-type-title flex-column"
        class:selected={args?.typeReleases == 3}
        onclick={() => setReleasesType(3)}>Завершенные</button
    >
    <button
        class="releases-type-title flex-column"
        class:selected={args?.typeReleases == 4}
        onclick={() => setReleasesType(4)}>Фильмы</button
    >
</div>
<div class="releases-container flex-column">
    {#await firstData}
        <Preloader />
    {:then Releases}
        {#each Releases.content as Release}
            <AnimeRowItem anime={Release} />
        {/each}
        {#each allData as Release}
            <AnimeRowItem anime={Release} />
        {/each}
    {/await}
</div>

<style>
    .releases-container {
        width: 100%;
        height: 100%;
    }

    .releases-type {
        width: 100%;
        height: 50px;
        justify-content: center;
        align-items: center;
        position: sticky;
        top: 0;
        background-color: var(--background-color);
        z-index: 1;
    }

    .releases-type-title {
        margin-right: auto;
        height: 100%;
        padding-left: 20px;
        padding-right: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--third-text-color);
        transition: all 0.3s ease;
        font-weight: 400;
        font-size: 16px;
        position: relative;
    }

    .releases-type-title:hover {
        cursor: pointer;
        background-color: var(--alt-background-color);
    }

    .releases-type-title:last-child {
        margin-right: 80px;
    }

    .releases-type-title:first-child {
        margin-left: 80px;
    }

    .selected {
        font-weight: bold;
        color: var(--main-text-color);
    }

    .selected:hover {
        background-color: var(--background-color);
        cursor: default;
    }

    .selected::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--main-text-color);
        animation: line-grow 0.5s cubic-bezier(0.55, 0, 0.1, 1) forwards;
    }

    @keyframes line-grow {
        0% {
            width: 0; /* Линия отсутствует */
            left: 50%;
        }
        100% {
            width: 100%; /* Линия полностью растянута */
            left: 0;
        }
    }
</style>
