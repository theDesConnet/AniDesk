<script>
    import AnimePoster from "../release/AnimePoster.svelte";
    import Dot from "./Dot.svelte";

    export let anime;
    export let currentRelease;
</script>

<button class="related-anime-item" onclick={() => updateViewportComponent(7, { id: anime.id })}>
    <AnimePoster size={{ width: 57, height: 84 }} posterInfo={{poster: anime.image, title: anime.title}} shadow={true} borderRadius={10} />
    <div class="related-anime-item-info">
        {#if currentRelease}
            <div class="related-anime-item-title">{anime.title_ru} <Dot size={{width: 4, height: 4}} color="--main-text-color"/> Вы здесь.</div>
        {:else}
            <div class="related-anime-item-title">{anime.title_ru}</div>
        {/if}
        
        {#if anime.status.id !== 3}
            <div class="related-anime-item-date">{anime.year} г. <Dot size={{width: 3, height: 3}}/> {anime.grade.toFixed(2)} ★</div>
        {/if}
        <div class="related-anime-item-type">{anime.category.name}</div>
    </div>
</button>

<style>
    .related-anime-item {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
    }

    .related-anime-item-title {
        font-size: 16px;
        font-weight: bold;
        color: var(--main-text-color);
        margin-bottom: 5px;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .related-anime-item-type {
        display: flex;
        font-size: 14px;
        color: var(--main-text-color);
        font-weight: bold;
        margin-bottom: 10px;
        background-color: var(--alt-background-color);
        border-radius: 6px;
        justify-content: center;
        width: 80px;
        height: 27px;
        align-items: center;
    }

    .related-anime-item-info {
        display: flex;
        flex-direction: column;
        margin-left: 17px;
    }

    .related-anime-item-date {
        display: flex;
        font-size: 14px;
        color: var(--secondary-text-color);
        font-weight: bold;
        margin-bottom: 5px;
        align-items: center;
    }
</style>