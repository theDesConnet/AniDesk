<script>
    import SliderItem from "./SliderItem.svelte";

    export let images = [];
    export let params = {
        id: "slide",
        heightImg: 242,
        widthSlider: 880,
        heightSlider: 250,
        minHeightSlider: 250,
        minWidthSlider: 440,
        scrollParam: 440,
    };

    let windowWidth, windowHeight, height, width;
    let isScrolling = false;

    $: if (windowWidth < 1700) {
        height = params.minHeightSlider;
        width = params.minWidthSlider;
    } else {
        height = params.heightSlider;
        width = params.widthSlider;
    }

    function scroll(type) {
        if (isScrolling) return;
        let element = document.querySelector(`#${params.id}`);

        switch (type.toLowerCase()) {
            case "right":
                if (
                    element.scrollLeft + params.scrollParam <
                    element.childElementCount * 340
                ) {
                    isScrolling = true;
                    element.scrollLeft += params.scrollParam;
                    setTimeout(() => (isScrolling = false), 650);
                }
                break;

            case "left":
                if (element.scrollLeft > 0) {
                    isScrolling = true;
                    element.scrollLeft -= params.scrollParam;
                    setTimeout(() => (isScrolling = false), 650);
                }
                break;
        }
    }
</script>

<svelte:window bind:outerWidth={windowWidth} bind:outerHeight={windowHeight} />

<div class="slider" style="--height: {height}px; --width: {width}px;">
    <button class="slider-button back" onclick={() => scroll("left")}>‹</button>
    <div id={params.id} class="slider">
        {#each images as img}
            <SliderItem
                src={img}
                size={{
                    width: 433,
                    height: params.heightImg,
                }}
            />
        {/each}
    </div>
    <button class="slider-button next" onclick={() => scroll("right")}>›</button>
</div>

<style>
    .slider {
        position: relative;
        height: var(--height);
        width: var(--width);
        display: flex;
        overflow: hidden;
        scroll-behavior: smooth;
        align-items: center;
    }

    .slider img {
        object-fit: cover;
        transition: all 0.7s;
        border-radius: 16px;
    }

    .slider-button {
        position: absolute;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 30px;
        background-color: var(--alt-background-color);
        border-radius: 10px;
        transition: all 0.3s;
        font-size: 1.1em;
        padding-bottom: 4px;
    }

    .slider-button:hover {
        background-color: #575353;
    }

    .back {
        left: 15px;
    }

    .next {
        right: 15px;
    }
</style>
