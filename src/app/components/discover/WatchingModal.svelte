<script>
    import AnimeFullRowCard from "../elements/AnimeFullRowCard.svelte";
    import Preloader from "../gui/Preloader.svelte";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();
    
    export let showed;
    dispatch("setTitle", "Сейчас смотрят");

    let page = 0;
    let allData = [];
    let firstData = anixApi.discover.getWatching(page);

    let updateInfo = false

    async function getWatchingPage() {
        const data = await anixApi.discover.getWatching(page);
        allData = allData.concat(data.content);
        updateInfo = false;
    }

    async function scrollEvent(e) {
        if ((e.srcElement.scrollTop >= e.srcElement.scrollHeight - 2000) && !updateInfo) {
            updateInfo = true;
            page++;
            await getWatchingPage();
        }
    }

</script>

{#if showed}
<div class="modal-title">Сейчас смотрят</div>
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
