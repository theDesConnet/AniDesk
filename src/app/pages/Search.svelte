<script>
    import AnimeFullRowCard from "../components/elements/AnimeFullRowCard.svelte";
    import Preloader from "../components/gui/Preloader.svelte";
    import BaseModal from "../components/modal/BaseModal.svelte";
    import RelatedModal from "../components/search/RelatedModal.svelte";
    import MetaInfo from "../components/gui/MetaInfo.svelte";
    import utils from "../utils";

    export let args;

    let firstData = [];
    let allData = [];

    let timeout, relatedModalSubTitle, searchBoxElement;
    let relatedModalShowed = false;

    function search() {
        firstData = anixApi.search.releases({
            query: args.query,
            searchBy: 0,
            page: 0,
        });
    }

    function inputEvent(e) {
        args.query = e.srcElement.value;

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => search(), 1500);
    }

    if (args.query) {
        search();
    }
</script>

<div class="search-top-div flex-row">
    <div class="search-box flex-row">
        <input
            bind:this={searchBoxElement}
            class="search-box-text"
            oninput={inputEvent}
            type="text"
            placeholder="Введите запрос..."
            value={args.query}
        />
    </div>
</div>
<div class="result-content flex-column">
    {#await firstData}
        <Preloader />
    {:then data}
        {#key relatedModalSubTitle}
            <MetaInfo
                subTitle={relatedModalSubTitle === null
                    ? args.query
                    : `${relatedModalSubTitle} | ${args.query}`}
            />
        {/key}
        <span class="title">Результаты поиска</span>
        {#if data.related}
            <button onclick={() => (relatedModalShowed = true)}>
                <div class="related-release flex-row">
                    <div class="release-images flex-row">
                        {#each { length: 3 } as _, i}
                            <img
                                src={data.related.images[i] ??
                                    "./assets/images/no_image.jpg"}
                                width="180px"
                                height="240px"
                                alt="Release"
                            />
                        {/each}
                    </div>
                    <div class="flex-column related-info">
                        <span class="related-title">{data.related.name_ru}</span
                        >
                        <span class="related-count"
                            >{data.related.release_count}
                            {utils.getNumericWord(data.related.release_count, [
                                "релиз в",
                                "релиза во",
                                "релизов в",
                            ])} франшизе</span
                        >
                        <span class="related-description"
                            >{data.related.description}</span
                        >
                    </div>
                </div>
            </button>

            <BaseModal
                modalComponent={RelatedModal}
                modalArgs={data.related}
                showed={relatedModalShowed}
                modalSize={{ width: "80%", height: "90%" }}
                bind:modalTitle={relatedModalSubTitle}
                on:closeModal={() => (relatedModalShowed = false)}
            />
        {/if}
        {#each data.releases as r}
            <AnimeFullRowCard anime={r} />
        {/each}
    {/await}
</div>

<style>
    .related-title {
        font-size: 20px;
        font-weight: 700;
        margin-top: 15px;
    }

    .title {
        margin-left: 30px;
        margin-top: 10px;
        font-weight: 700;
        font-size: 18px;
    }

    .related-info {
        margin-right: 40px;
        z-index: -1;
        text-align: left;
        margin-top: 10px;
    }

    .release-images {
        justify-items: center;
        align-items: center;
        position: relative;
        width: 360px;
        height: 240px;
        min-width: 360px;
        min-height: 240px;
        margin-left: 25px;
        z-index: -1;
    }

    .release-images img:first-child,
    .release-images img:last-child {
        height: 204px;
        width: 140px;
        position: relative;
        z-index: 0;
    }

    .release-images {
        margin-left: 40px;
        margin-right: 20px;
    }

    .release-images img:first-child {
        left: 0px;
        height: 204px;
        width: 140px;
        position: relative;
        border-radius: 15px;
    }

    .release-images img:last-child {
        left: 80px;
        height: 204px;
        width: 140px;
        position: relative;
        border-radius: 15px;
    }

    .release-images img {
        width: 180px;
        height: 240px;
        background-color: var(--alt-background-color);
        position: absolute;
        left: 80px;
        z-index: 1;
        border-radius: 15px;
        object-fit: cover;
        box-shadow: 6px 7px 13px 0px rgb(0 0 0 / 82%);
    }

    .related-release {
        position: relative;
        width: 100%;
        height: fit-content;
        margin-top: 30px;
        margin-bottom: 25px;
    }

    .related-description {
        margin-top: 10px;
        font-size: 14px;
    }

    .related-count {
        font-size: 14px;
        color: var(--secondary-text-color);
    }

    .search-box {
        border-radius: 30px;
        padding: 0 15px;
        border-color: var(--secondary-text-color);
        border-style: solid;
        background-color: var(--alt-background-color);
        margin-top: 10px;
        width: 70%;
        border-width: 1px;
        z-index: 20;
    }

    .search-box-text {
        height: 35px;
        width: 100%;
        background-color: var(--alt-background-color);
        border: none;
        outline: none;
        color: var(--main-text-color);
    }

    .search-box-text:active {
        border: none;
    }

    .search-top-div {
        justify-content: center;
        position: sticky;
        top: 0;
    }

    .result-content {
        height: 100%;
    }
</style>
