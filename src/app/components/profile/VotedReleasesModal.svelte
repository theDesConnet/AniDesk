<script>
    import { createEventDispatcher } from "svelte";
    import Preloader from "../gui/Preloader.svelte";
    import AnimeFullRowCard from "../elements/AnimeFullRowCard.svelte";
    import Dot from "../elements/Dot.svelte";

    const dispatch = createEventDispatcher();

    export let args;
    export let showed;
    dispatch("setTitle", "Оценка релизов");

    let page = 0;
    let allData = [];
    let firstData = anixApi.profile.getVotesReleases(args.id, page);
    let updateInfo = false

    async function getRelatedPage() {
        const data = await anixApi.profile.getVotesReleases(args.id, page);
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
<div class="modal-title">Оценки релизов</div>
{#await firstData}
    <div class="center">
        <Preloader />
    </div>
{:then i}
    <div class="modal-content" onscroll="{scrollEvent}">
        {#each i.content as r}
        <AnimeFullRowCard anime={r} inModal={true}>
            <div class="info-box flex-row">
                ★ {r.my_vote} из 5 <Dot size={{width: 4, height: 4}} />
                <span class="third-text"
                    >{utils.returnTimeString(r.voted_at * 1000)}</span
                >
            </div>
        </AnimeFullRowCard>
    {/each}
    {#each allData as r}
        <AnimeFullRowCard anime={r} inModal={true}>
            <div class="info-box flex-row">
                ★ {r.my_vote} из 5 <Dot size={{width: 4, height: 4}} />
                <span class="third-text"
                    >{utils.returnTimeString(r.voted_at * 1000)}</span
                >
            </div>
        </AnimeFullRowCard>
    {/each}
    </div>
{/await}
{/if}

<style>
    .third-text {
        font-size: 14px;
        color: var(--secondary-text-color);
    }

    .info-box {
        background-color: var(--background-color);
        margin-bottom: 10px;
        border-radius: 10px;
        width: max-content;
        padding: 3px 12px;
        align-items: center;
    }
</style>


