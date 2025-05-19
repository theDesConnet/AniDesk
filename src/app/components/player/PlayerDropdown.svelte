<script>
    import { createEventDispatcher } from "svelte";

    export let elements;
    export let isShow = false;
    export let historyElements = [];
    export let type;
    let updatedScroll = false;
    let page = 0;
    

    const dispatch = createEventDispatcher();

    function closeDropdown() {
        isShow = false;
        historyElements = [];
        elements = [];
        type = null;
    }

    function nextPage(value, newElements, newType) {
        historyElements.push({
            type,
            elements,
            selectedValue: value,
        });
        type = newType;
        elements = newElements;
    }
</script>

<div
    class="dropdown flex-column"
    class:hide={!isShow}
    onclick={(e) => e.stopPropagation()}
    onwheel={(e) => e.stopPropagation()}
    onscroll={(e) => {
        if (
            e.srcElement.scrollTop >= e.srcElement.scrollHeight - 2000 &&
            !updatedScroll
        ) {
            dispatch("scroll-ending", {
                updatedScroll,
                elements,
                type,
                page
            })
        }
    }}
>
    {#each elements as e}
        <button
            class:top-align={e.image?.type == "poster"}
            class="dropdown-element flex-row"
            onclick={(x) => {
                dispatch("elementClick", {
                    type,
                    value: e.value,
                    elements,
                    close: closeDropdown,
                    nextPage: nextPage,
                    history: historyElements,
                });
            }}
        >
            {#if e.image}
                <img class="element-image" class:image-circle={e.image.type === "default"} class:image-poster={e.image.type === "poster"} src={e.image.src} alt="Image" />
            {/if}
            <div class="flex-column" class:top-align-container={e.image?.type == "poster"}>
                <span class="element-title">{e.title}</span>
                {#if e.subtitle}
                    <span class="element-subtitle">{e.subtitle}</span>
                {/if}
                {#if e.description}
                    <span class="element-description">{e.description}</span>
                {/if}
            </div>
        </button>
    {/each}
</div>

<style>
    .dropdown {
        background-color: var(--background-color);
        margin-left: 20px;
        margin-right: auto;
        padding: 20px 10px;
        min-width: 400px;
        max-height: 400px;
        overflow-y: auto;
        border-radius: 10px;
        gap: 10px;
        max-width: 800px;
    }

    .element-image {
        margin-right: 10px;
    }

    .image-circle {
        border-radius: 100%;
        width: 50px;
        height: 50px;
    }

    .image-poster {
        border-radius: 15px;
        height: 150px;
        width: 100px;
        object-fit: cover;
    }

    .dropdown-element {
        padding: 10px 20px;
        background-color: var(--alt-background-color);
        border-radius: 15px;
        cursor: pointer;
        align-items: center;
        text-align: left;
    }
    
    .top-align {
        align-items: flex-start;
    }

    .top-align-container {
        margin-top: 10px;
    }

    .element-description {
        margin-top: 8px;
    }

    .element-subtitle {
        text-align: left;
        color: var(--secondary-text-color);
    }

    .element-title {
        font-size: 20px;
        font-weight: 600;
    }
</style>
