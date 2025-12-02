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
    export let outsideElement = document;

    export let width = 200;
    export let height = 30;
    export let radius = 15;
    export let iconSize = {
        width: 25,
        height: 25,
    };
    export let maxListHeight = 400;

    let showed = false;
    let dropdownElem;

    function handleOutsideClick(e) {
        if (showed && dropdownElem && !dropdownElem.contains(e.target)) {
            showed = false;
        }
    }

    onMount(() => {
        outsideElement.addEventListener("click", handleOutsideClick);
    });

    onDestroy(() => {
        outsideElement.removeEventListener("click", handleOutsideClick);
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
        <div class="value-info items-center flex-row">
            {#if values?.find((v) => v.value === value)?.icon}
                <img
                    class="icon-value"
                    style="--width: {iconSize.width}px; --height: {iconSize.height}px;"
                    src={values.find((v) => v.value === value)?.icon}
                    alt="icon"
                />
            {/if}
            <span
                >{values.find((v) => v.value === value)?.label ||
                    placeholder}</span
            >
        </div>
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
                <div class="value-info flex-row">
                    {#if v?.icon}
                        <img
                            class="icon-value"
                            style="--width: {iconSize.width}px; --height: {iconSize.height}px;"
                            src={v?.icon}
                            alt="icon"
                        />
                    {/if}
                    <div class="flex-column">
                        <span class="label">{v.label}</span>
                        {#if v.description}
                            <span class="description">{v.description}</span>
                        {/if}
                    </div>
                </div>
            </button>
        {/each}
    </div>
</div>

<style>
    .dropdown-wrapper {
        position: relative;
        width: var(--width);
    }

    .items-center {
        align-items: center;
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

    .icon-value {
        width: var(--width);
        height: var(--height);
        border-radius: 100%;
    }

    .value-info {
        gap: 5px;
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
