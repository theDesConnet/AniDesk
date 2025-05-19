<script>
    import Icon from "../elements/Icon.svelte";
    import downBtnIcon from "../../icons/downBtn.svg";
    import upBtnIcon from "../../icons/upVote.svg";
    import { onDestroy, onMount } from "svelte";

    export let values;
    export let value;
    export let onChangeCallback;
    export let placeholder = "";
    export let title;
    export let disabled = false;

    let dropdownList = null;
    let showed = false;

    function handleClickOutside(e) {
        if (showed && dropdownList && !dropdownList.contains(e.target)) {
            showed = false;
        }
    };

    onMount(() => {
        document.addEventListener("click", handleClickOutside);
    })

    onDestroy(() => {
        document.removeEventListener("click", handleClickOutside);
    })
</script>

<div class="dropdown-container flex-column" class:disabled={disabled} bind:this={dropdownList}>
    <span class="text-title">{title}</span>
<div class="dropdown-settings flex-column" onclick={() => showed = !showed}>
    <button class="dropdown-settings-btn"
        >{values.find((v) => v.value == value)?.label ?? placeholder} <Icon src={showed ? upBtnIcon : downBtnIcon} size={{width: 15, height: 15}} varColor="--main-text-color" disabled={disabled}/></button
    >

    <div class="dropdown-settings-list" class:hide={!showed}>
        {#each values as v}
            <button
                class="dropdown-settings-element"
                class:selected-element={v.value == value}
                onclick={(e) => {
                    e.stopPropagation();
                    onChangeCallback(e, v.value);
                    value = v.value;
                    showed = false;
                }}
            >
                <span class="label">{v.label}</span>
                {#if v.description}<span class="description">{v.description}</span>{/if}
            </button>
        {/each}
    </div>
</div>
</div>

<style>
    .dropdown-settings-btn {
        width: 100%;
        height: 40px;
        border-radius: 10px;
        background-color: var(--alt-background-color);
        border: 1px solid var(--rate-back-color);
        color: var(--main-text-color);
        text-align: left;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .dropdown-settings-list {
        width: 100%;
        position: absolute;
        top: 50px;
        z-index: 1;
        background-color: var(--alt-background-color);
        border-radius: 10px;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        border: 1px solid var(--rate-back-color);
        max-height: 500px;
        overflow-y: auto;
    }

    .selected-element {
        background-color: var(--settings-dropdown-selected-color) !important;
        color: var(--main-text-color) !important;
    }

    .dropdown-settings-element {
        height: 40px !important;
        min-height: 40px !important;
        width: 100%;
        text-align: left;
        padding: 0 10px;
        color: var(--main-text-color);
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .dropdown-settings-element:hover {
        background-color: var(--background-color);
    }

    .label {
        font-weight: bold;
    }

    .description {
        font-weight: normal;
        font-size: 12px;
        color: var(--secondary-text-color);
    }

    .dropdown-settings {
        position: relative;
        width: 100%;
    }

    .text-title {
        font-size: 16px;
        font-weight: bold;
        color: var(--main-text-color);
        margin-bottom: 5px;
    }

    .dropdown-container {
        width: 80%;
        margin: 10px auto;
        transition: opacity 0.1s ease-in-out;
    }
</style>
