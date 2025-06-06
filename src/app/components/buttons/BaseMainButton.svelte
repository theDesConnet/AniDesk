<script>
    export let onClickCallback;
    export let height = 30;
    export let borderRadius = 20;
    export let customClasses = "";
    export let width = "auto";
    export let style = "default"
    export let disabled = false;
    export let type = "button";
    export let currentColorVar = "--main-text-color";

    export let isLoading = false;

    function handleClick(event) {
        if (!disabled && !isLoading && onClickCallback) {
            onClickCallback(event);
        }
    }
</script>

<button class="base-main-button {customClasses} {style}" type={type} disabled={disabled || isLoading} style="--current-color: var({currentColorVar}); --height: {height}px; --width: {width}; --border-radius: {borderRadius}px;" on:click='{handleClick}'>
    {#if isLoading}
        <span class="loader"></span>
    {:else}
        <slot></slot>
    {/if}
</button>

<style>
    .base-main-button {
        align-items: center;
        display: flex;
        justify-content: center;
        cursor: pointer;
        height: var(--height);
        border-radius: var(--border-radius);
        width: var(--width);
    }

    .default {
        background-color: var(--alt-background-color);
        color: var(--main-text-color);
    }

    .primary {
        background-color: var(--main-text-color);
        color: var(--alt-background-color);
    }

    .primary:hover {
        background-color: var(--secondary-text-color);
    }

    .primary:disabled {
        background-color: var(--alt-background-color) !important;
        color: var(--main-text-color);
    }

    .transparent {
        background-color: transparent;
        color: var(--current-color);
        border: solid 1px var(--current-color);
    }

    .loader {
        width: 20px;
        height: 20px;
        border: 3px solid var(--main-text-color);
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>