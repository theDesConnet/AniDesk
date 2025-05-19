<!-- <script>
    import Icon from "../elements/Icon.svelte";
    import downBtnIcon from "../../icons/downBtn.svg";
    import upBtnIcon from "../../icons/upVote.svg";

    export let buttonLabel;
    export let values;
    export let onSelectCallback;
    export let buttonColor;
    export let buttonSelectColor;
    export let dropdownListColor;
    export let dropdownElementSelectColor;
    export let heigthList = 500;
    export let size = {
        width: 100,
        heigth: 28
    };
    export let buttonRadius = 15;

    export let showed = false;
</script>

<div class="dropdown-container flex-column" style="--btn-color: {buttonColor}; --btn-select-color: {buttonSelectColor}; --width: {size.width}px; --heigth: {size.heigth}px; --button-radius: {buttonRadius}px;
--list-heigth: {heigthList}px;">
    <button class="dropdown-button flex-row" onclick={() => showed = !showed}>
        {buttonLabel}
         <Icon src={showed ? upBtnIcon : downBtnIcon} size={{width: 15, height: 15}} varColor="--main-text-color"/>
    </button>

    <div class="dropdown-list" class:hide={!showed}>
        {#each values as v}
        <button class="dropdown-list-element" onclick={(e) => {
            onSelectCallback(e, v.value);
            buttonLabel = v.label;
            showed = false;
        }}>
            {v.label}
    </button>
        {/each}
    </div>
</div>

<style>
    .dropdown-container {
        position: relative;
        width: var(--width);
    }

    .dropdown-button {
        width: var(--width);
        border-radius: var(--button-radius);
        height: var(--heigth);
        background-color: var(--alt-background-color);
        justify-content: space-between;
        align-items: center;
    }

    .dropdown-button img {
        margin-left: 5px;
    }

    .dropdown-list {
        position: absolute;
        margin-top: calc(var(--heigth) + 10px);
        z-index: 1;
        width: var(--width);
        background-color: var(--btn-color, --alt-background-color);
        max-height: var(--list-heigth);
        border-radius: var(--button-radius);
        overflow-y: hidden;
    }

    .dropdown-list-element {
        padding: 3px 10px;
        transition: all 0.2s ease-in-out;
        border-radius: var(--button-radius);
    }

    .dropdown-list-element:hover {
        background-color: var(--btn-select-color, --select-button-color);
    }
</style>

 -->

<script>
    import Icon from "../elements/Icon.svelte";
    import downBtnIcon from "../../icons/downBtn.svg";
    import upBtnIcon from "../../icons/upVote.svg";
    import { onMount, onDestroy } from "svelte";

    export let values = [];
    export let value = null;
    export let onChange = () => {};
    export let placeholder = "";
    export let title = "";
    export let disabled = false;

    export let width = 200;
    export let height = 30;
    export let radius = 15;
    export let maxListHeight = 400;

    let showed = false;
    let dropdownElem;

    function handleOutsideClick(e) {
        if (showed && dropdownElem && !dropdownElem.contains(e.target)) {
            showed = false;
        }
    }

    onMount(() => {
        document.addEventListener("click", handleOutsideClick);
    });

    onDestroy(() => {
        document.removeEventListener("click", handleOutsideClick);
    });

    function selectItem(e, v) {
        e.stopPropagation();
        value = v.value;
        onChange(e, v.value);
        showed = false;
    }
</script>

<div
    bind:this={dropdownElem}
    class="dropdown-wrapper"
    on:click={() => !disabled && (showed = !showed)}
    style="--width: {width}px; --height: {height}px; --radius: {radius}px;"
>
    <button class="dropdown-btn">
        {values.find((v) => v.value === value)?.label || placeholder}
        <Icon
            src={showed ? upBtnIcon : downBtnIcon}
            size={{ width: 15, height: 15 }}
        />
    </button>

    <div
        class="dropdown-list"
        class:hide={!showed}
        style="--list-height: {maxListHeight}px;"
    >
        {#each values as v}
            <button
                class="dropdown-item"
                class:selected={v.value === value}
                on:click={(e) => selectItem(e, v)}
            >
                <span class="label">{v.label}</span>
                {#if v.description}
                    <span class="description">{v.description}</span>
                {/if}
            </button>
        {/each}
    </div>
</div>

<style>
    .dropdown-wrapper {
        position: relative;
        width: var(--width);
    }

    .dropdown-btn {
        width: 100%;
        height: var(--height);
        padding: 0 10px;
        border-radius: var(--radius);
        background-color: var(--alt-background-color);
        border: 1px solid var(--rate-back-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--main-text-color);
        cursor: pointer;
    }

    .dropdown-list {
        position: absolute;
        top: calc(var(--height) + 5px);
        z-index: 10;
        width: 100%;
        max-height: var(--list-height);
        overflow-y: auto;
        background-color: var(--alt-background-color);
        border: 1px solid var(--rate-back-color);
        border-radius: var(--radius);
        display: flex;
        flex-direction: column;
    }

    .dropdown-item {
        text-align: left;
        padding: 8px 10px;
        background: none;
        border: none;
        cursor: pointer;
        transition: background 0.2s;
        display: flex;
        flex-direction: column;
    }

    .dropdown-item:hover {
        background-color: var(--background-color);
    }

    .dropdown-item.selected {
        background-color: var(--settings-dropdown-selected-color);
        color: var(--main-text-color);
    }

    .label {
        font-weight: bold;
    }

    .description {
        font-size: 12px;
        color: var(--secondary-text-color);
    }

    .hide {
        display: none;
    }

    .disabled {
        opacity: 0.5;
        pointer-events: none;
    }
</style>
