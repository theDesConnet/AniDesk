<script>
    import AnimeRowItem from "../components/elements/AnimeFullRowCard.svelte";
    import MetaInfo from "../components/gui/MetaInfo.svelte";
    import Preloader from "../components/gui/Preloader.svelte";
    import AuthPlaceholder from "./AuthPlaceholder.svelte";
    import DropdownButton from "../components/buttons/DropdownButton.svelte"
    import utils from "../utils";

    export let args;

    const HISTORY_TYPE = 6;

    let page = 0;
    let total_count,
        firstData_count = null;
    let allData = [];
    let firstData = getPageData(0);

    let updateInfo = false;

    function isHistoryType(type = args.typeBookmark) {
        return type == HISTORY_TYPE;
    }

    function getProfileId() {
        return args?.id ?? anixApi.client.token?.id ?? null;
    }

    function isCurrentProfileHistory() {
        const currentProfileId = anixApi.client.token?.id ?? null;
        const selectedProfileId = getProfileId();

        return !selectedProfileId || selectedProfileId == currentProfileId;
    }

    async function getHistoryData(pageToLoad = 0) {
        const profileId = getProfileId();

        if (isCurrentProfileHistory()) {
            const historyLoaders = [
                () => anixApi.release.getHistory(pageToLoad),
                () => anixApi.release.getHistory({ page: pageToLoad }),
                () => anixApi.release.getHistory(profileId, pageToLoad),
            ];

            for (const loader of historyLoaders) {
                try {
                    const data = await loader();
                    if (data?.content) {
                        return data;
                    }
                } catch (error) {}
            }
        }

        const profile = await anixApi.profile.info(profileId);
        return {
            content: profile.profile.history ?? [],
            total_count: profile.profile.history?.length ?? 0,
        };
    }

    function getPageData(pageToLoad = page) {
        if (isHistoryType()) {
            return getHistoryData(pageToLoad);
        }

        if (args.typeBookmark == 0 && !args?.id) {
            return anixApi.profile.getFavorites({
                page: pageToLoad,
                sort: args.sort,
                filter_announce: 0,
            });
        }

        return anixApi.profile.getBookmarks({
            type: args.typeBookmark,
            id: args?.id ?? null,
            sort: args.sort,
            page: pageToLoad,
        });
    }

    async function getMainPage() {
        let data = await getPageData(page);
        allData = allData.concat(data.content);
        updateInfo = false;
    }

    function setTotalCount(count) {
        total_count = count;
    }

    function setFirstDataCount(count) {
        firstData_count = count;
    }

    function setReleasesType(type) {
        if (args.typeBookmark === type) return;
        let viewport = document.getElementById("viewport");

        args.typeBookmark = type;
        page = 0;
        allData = [];
        firstData = getPageData(0);

        if (viewport) {
            viewport.scrollTop = 0;
        }
    }

    const scrollEvent = async (e) => {
        if (
            e.srcElement.scrollTop >= e.srcElement.scrollHeight - 2000 &&
            !updateInfo &&
            total_count > allData.length + firstData_count
        ) {
            updateInfo = true;
            page++;
            await getMainPage();
        }
    };

    if (args?.isModal) {
        waitForElm(".releases-container.modal-content").then((elem) => {
            elem.addEventListener("scroll", scrollEvent);
        });
    } else {
        setViewportScrollEvent(scrollEvent);
    }
</script>

<MetaInfo subTitle="Закладки" />

{#if !anixApi.client.token && !args?.isModal}
    <AuthPlaceholder />
{:else}
    <div
        class="releases-type flex-row"
        tabindex="-1"
        class:modal-title={args?.isModal}
    >
        {#if !args?.isModal}
            <button
                class="releases-type-title flex-column"
                class:selected={args.typeBookmark == 0}
                onclick={() => setReleasesType(0)}
            >
                Избранное
            </button>
        {/if}
        <button
            class="releases-type-title flex-column"
            class:selected={args.typeBookmark == HISTORY_TYPE}
            onclick={() => setReleasesType(HISTORY_TYPE)}
        >
            История
        </button>
        <button
            class="releases-type-title flex-column"
            class:selected={args.typeBookmark == 1}
            onclick={() => setReleasesType(1)}
        >
            Смотрю
        </button>
        <button
            class="releases-type-title flex-column"
            class:selected={args.typeBookmark == 2}
            onclick={() => setReleasesType(2)}
        >
            В планах
        </button>
        <button
            class="releases-type-title flex-column"
            class:selected={args.typeBookmark == 3}
            onclick={() => setReleasesType(3)}
        >
            Просмотрено
        </button>
        <button
            class="releases-type-title flex-column"
            class:selected={args.typeBookmark == 4}
            onclick={() => setReleasesType(4)}
        >
            Отложено
        </button>
        <button
            class="releases-type-title flex-column"
            class:selected={args.typeBookmark == 5}
            onclick={() => setReleasesType(5)}
        >
            Брошено
        </button>
    </div>
    <div
        tabindex="-1"
        class="releases-container flex-column"
        class:modal-content={args?.isModal}
        id:modal-bookmark={args?.isModal}
    >
        <div class="flex-row releases-title">
            <span>Всего {total_count}</span>
            {#if !isHistoryType()}
                <DropdownButton values={utils.bookmarkSortValues} value={args.sort} width={300} onChange={(e, v) => {
                    args.sort = v;
                    page = 0;
                    allData = [];
                    firstData = getPageData(0);
                }}/>
            {/if}
        </div>
        {#await firstData}
            <Preloader />
        {:then Releases}
            {setTotalCount(Releases.total_count ?? Releases.content.length)}
            {setFirstDataCount(Releases.content.length)}
            {#each Releases.content as Release}
                <AnimeRowItem anime={Release} inModal={args?.isModal} />
            {/each}
            {#each allData as Release}
                <AnimeRowItem anime={Release} inModal={args?.isModal} />
            {/each}
        {/await}
    </div>
{/if}

<style>
    .releases-container {
        width: 100%;
        height: 100%;
    }

    .releases-title {
        margin-top: var(--margin-title, 16px);
        margin-left: 23px;
        margin-right: 23px;
        justify-content: space-between;
    }

    .releases-container.modal-content {
        width: 100% !important;
        height: 94.3% !important;
        margin-top: 0 !important;
    }

    .releases-type.modal-title {
        padding: 0 !important;
        margin: 0 !important;
        flex-direction: row !important;
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
        font-size: 16px !important;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--third-text-color);
        transition: all 0.3s ease;
        font-weight: 400;
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
            width: 0;
            left: 50%;
        }
        100% {
            width: 100%;
            left: 0;
        }
    }
</style>
