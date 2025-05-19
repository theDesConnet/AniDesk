<script>
    export let release;

    import ViewAllButton from "../buttons/ViewAllButton.svelte";
    import RelatedAnimeItem from "../elements/RelatedAnimeItem.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
</script>

<div class="related-releases flex-column">
    <div class="related-releases-title flex-row">
        <span>Связанные релизы</span>
    </div>
    {#each release.related_releases as rr}
        {#if rr.id === release.id}
            <RelatedAnimeItem anime={rr} currentRelease={true} />
        {:else}
            <RelatedAnimeItem anime={rr} currentRelease={false} />
        {/if}
    {/each}
    {#if release.related_count > 3}
        <ViewAllButton onClickCallback={() => dispatch("viewAllCalled")}  marginLeft={"0"} width={"150px"}/>
    {/if}
</div>

<style>
    .related-releases-title {
        align-items: center;
        margin-bottom: 20px;
    }

    .related-releases {
        margin-top: 10px;
        font-size: 20px;
        font-weight: bold;
        color: var(--main-text-color);
    }
</style>
