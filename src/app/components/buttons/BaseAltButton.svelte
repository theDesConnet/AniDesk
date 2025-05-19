<script>
    export let onClickCallback;
    export let btnType;
    export let text;
    export let btnWidth = "auto";
    export let btnHeight = 30;
    export let font = {
        size: 14,
        weight: 400
    }
    export let dropShadow = false
</script>

<button
    class="alt-button flex-row {btnType} {dropShadow ? 'drop-shadow-btn' : ''}"
    style="--btn-width: {btnWidth}; --btn-height: {btnHeight}px; --font-size: {font.size}px; --font-weight: {font.weight};"
    onclick={onClickCallback}
>
    <slot></slot>
    {text}
</button>

<style>
    .alt-button {
        width: var(--btn-width);
        height: 30px;
        align-items: center;
        justify-content: center;
        border-radius: 50px;
        min-height: var(--btn-height);
        font-size: var(--font-size);
        font-weight: var(--font-weight);
        transition: all 0.3s ease-in-out;
    }

    .primary {
        background-color: var(--main-text-color);
        color: var(--alt-background-color);
    }

    .primary:hover {
        background-color: var(--secondary-text-color);
    }

    .secondary {
        background-color: var(--select-button-color);
        color: var(--main-text-color);
    }

    .secondary:hover {
        background-color: var(--alt-background-color);
    }

    .drop-shadow-btn {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
</style>
