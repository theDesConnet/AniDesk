<script>
    import AnimeRowItem from "../components/elements/AnimeFullRowCard.svelte";
    import MetaInfo from "../components/gui/MetaInfo.svelte";
    import Preloader from "../components/gui/Preloader.svelte";
    import AuthPlaceholder from "./AuthPlaceholder.svelte";
    import DropdownButton from "../components/buttons/DropdownButton.svelte"
    import utils from "../utils";

    export let args;

    let page = 0;
    let sort = 1;
    let typeBookmark = args?.id ? 1 : 0;
    let total_count,
        firstData_count = null;
    let allData = [];
    let firstData = args?.id
        ? anixApi.profile.getBookmarks({
              type: typeBookmark,
              id: args?.id ?? null,
              sort: sort,
              page,
          })
        : anixApi.profile.getFavorites({
              page: 0,
              sort: sort,
              filter_announce: 0,
          });

    let updateInfo = false;

    async function getMainPage() {
        let data;

        if (typeBookmark == 0) {
            data = await anixApi.profile.getFavorites({
                page,
                sort: sort,
                filter_announce: 0,
            });
        } else {
            data = await anixApi.profile.getBookmarks({
                type: typeBookmark,
                id: args?.id ?? null,
                sort: 1,
                page,
            });
        }

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
        if (typeBookmark === type) return;
        let viewport = document.getElementById("viewport");

        typeBookmark = type;
        page = 0;
        allData = [];
        switch (type) {
            case 0:
                firstData = anixApi.profile.getFavorites({
                    page: 0,
                    sort: 1,
                    filter_announce: 0,
                });
                break;

            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                firstData = anixApi.profile.getBookmarks({
                    type: typeBookmark,
                    id: args?.id ?? null,
                    sort: 1,
                    page,
                });
                break;
        }

        viewport.scrollTop = 0;
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
                class:selected={typeBookmark == 0}
                onclick={() => setReleasesType(0)}
            >
                Избранное
            </button>
        {/if}
        <button
            class="releases-type-title flex-column"
            class:selected={typeBookmark == 1}
            onclick={() => setReleasesType(1)}
        >
            Смотрю
        </button>
        <button
            class="releases-type-title flex-column"
            class:selected={typeBookmark == 2}
            onclick={() => setReleasesType(2)}
        >
            В планах
        </button>
        <button
            class="releases-type-title flex-column"
            class:selected={typeBookmark == 3}
            onclick={() => setReleasesType(3)}
        >
            Просмотрено
        </button>
        <button
            class="releases-type-title flex-column"
            class:selected={typeBookmark == 4}
            onclick={() => setReleasesType(4)}
        >
            Отложено
        </button>
        <button
            class="releases-type-title flex-column"
            class:selected={typeBookmark == 5}
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
            <DropdownButton values={utils.bookmarkSortValues} value={sort} width={300} onChange={(e, v) => {
                sort = v;
                page = 0;
                allData = [];
                firstData = anixApi.profile.getBookmarks({
                    type: typeBookmark,
                    id: args?.id ?? null,
                    sort: sort,
                    page,
                });
            }}/>
        </div>
        {#await firstData}
            <Preloader />
        {:then Releases}
            {setTotalCount(Releases.total_count)}
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
