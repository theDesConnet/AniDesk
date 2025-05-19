<script>
    export let src, alt;
    export let size = {
        width: 100,
        height: 100,
    };
    export let skeletonZIndex = 0;

    let isLoaded = false;
    const id = window.crypto.randomUUID();

    function onImgLoad() {
        const img = document.getElementById(id);
        isLoaded = true;
        size.width = img.width;
    }
</script>

<div
    class="slider-item"
    style="--width: {size.width}px; --height: {size.height}px;"
>
    <div class="slider-item-skeleton" class:hide={isLoaded}></div>
    <img onload={onImgLoad} height={size.height} {src} alt={alt ?? "Item"} id={id} />
</div>

<style>
    .slider-item {
        height: var(--height);
        position: relative;
        margin-right: 10px;
        min-width: var(--width);
    }

    .slider-item-skeleton {
        width: var(--width);
        height: var(--height);
        border-radius: 13px;
        background-color: var(--skeleton-background-color);
        position: absolute;
        z-index: var(--z-index);
        animation: skeletonAnimation 3s ease-in-out 100ms infinite forwards;
    }

    .slider-item img {
        border-radius: 16px;
        object-fit: cover;
        height: var(--height);
    }
</style>
