<script>
    import AnimeFullRowCard from "../elements/AnimeFullRowCard.svelte";
    import Preloader from "../gui/Preloader.svelte";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    export let args;
    export let showed;
    dispatch("setTitle", `Франшиза - ${args.name_ru}`);

    let page = 0;
    let allData = [];
    let firstData = anixApi.release.getRelatedReleases(args.id, page);
    let updateInfo = false

    async function getRelatedPage() {
        const data = await anixApi.release.getRelatedReleases(args.id, page);
        allData = allData.concat(data.content);
        updateInfo = false;
    }

    async function scrollEvent(e) {
        if ((e.srcElement.scrollTop >= e.srcElement.scrollHeight - 2000) && !updateInfo) {
            updateInfo = true;
            page++;
            await getRelatedPage();
        }
    }

</script>

{#if showed}
{#await firstData}
    <div class="center">
        <Preloader />
    </div>
{:then i}
    <div class="modal-content full-content" onscroll="{scrollEvent}">
        <div class="related-info flex-column">
            {#if args.image !== ""}
            <img src={args.image}  alt="RelatedPoster" class="related-poster">
            {/if}
            <span class="related-title">{args.name_ru}</span>
            <span class="related-description">{args.description}</span>
        </div>
        {#each i.content as d}
            <AnimeFullRowCard anime={d}></AnimeFullRowCard>
        {/each}
        {#each allData as d}
            <AnimeFullRowCard anime={d}></AnimeFullRowCard>
        {/each}
    </div>
{/await}
{/if}

<style>
    .related-poster {
        border-radius: 20px;
        width: 100%;
        height: 624px;
        object-fit: cover;
    }

    .related-title {
        font-size: 30px;
        font-weight: 700;
        text-align: center;
        margin-top: 15px;
    }

    .related-description {
        margin-top: 10px;
        margin-bottom: 20px;
    }

    .center {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }
</style>
