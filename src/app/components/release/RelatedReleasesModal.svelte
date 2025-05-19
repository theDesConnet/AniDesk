<script>
    import AnimeFullRowCard from "../elements/AnimeFullRowCard.svelte";
    import Preloader from "../gui/Preloader.svelte";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    export let args;
    export let showed;
    dispatch("setTitle", "Связанные релизы");

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
<div class="modal-title">Связанные релизы</div>
{#await firstData}
    <div class="center">
        <Preloader />
    </div>
{:then i}
    <div class="modal-content" onscroll="{scrollEvent}">
        {#each i.content as d}
            <AnimeFullRowCard anime={d} inModal={true}></AnimeFullRowCard>
        {/each}
        {#each allData as d}
            <AnimeFullRowCard anime={d} inModal={true}></AnimeFullRowCard>
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
</style>
