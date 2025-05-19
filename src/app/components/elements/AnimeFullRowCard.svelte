<script>
    import AnimePoster from "../release/AnimePoster.svelte";
    import Dot from "./Dot.svelte";
    export let inModal = false;

    export let anime;
</script>

<anime-full-row-card class="flex-row" onclick={() => updateViewportComponent(7, { id: anime.id })}>
    <div class="full-row-anime-poster">
        <AnimePoster size={{ width: 140, height: 205 }} zIndex={inModal ? 2 : 0} posterInfo={{poster: anime.image, title: anime.title}} shadow={true} borderRadius={20} posterStyle={anime.profile_list_status ?? 0}/>
    </div>
    <div class="flex-column">
        <div class="anime-item-title">{anime.title_ru}</div>
        <slot></slot>
        <div class="anime-item-epCount flex-row">{utils.returnEpisodeString(anime)} эп. {#if utils.returnEpisodeString(anime) != "?" && anime.status?.id !== 3}<Dot size={{width: 4, height: 4}} />{anime.grade.toFixed(2)} ★{/if}</div>
        <div class="anime-item-description">{anime.description}...</div>
    </div>
</anime-full-row-card>

<style>
    anime-full-row-card {
        margin-left: 20px;
        margin-bottom: 20px;
        margin-top: 20px;
        margin-right: 20px;
    }

    anime-full-row-card:hover {
        cursor: pointer;
    }

    .anime-item-title {
        font-size: var(--anime-full-row-title-size);
        font-weight: var(--anime-full-row-title-weight);
        color: var(--main-text-color);
        margin-bottom: 5px;
    }

    .anime-item-epCount {
        font-size: var(--anime-full-row-epCount-size);
        color: var(--third-text-color);
        font-weight: var(--anime-full-row-epCount-weight);
        margin-bottom: 10px;
        align-items: center;
    }

    :global(.dot) {
        margin-left: 5px;
        margin-right: 5px;
    }

    .full-row-anime-poster {
        margin-right: 25px;
    }

    .anime-item-description {
        font-size: var(--anime-full-row-description-size);
        color: var(--third-text-color);
        line-height: var(--anime-full-row-description-line-height);
        font-weight: var(--anime-full-row-description-weight);
    }
</style>