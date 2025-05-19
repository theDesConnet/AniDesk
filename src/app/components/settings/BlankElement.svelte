<script>
    export let title;
    export let disabled = false;
</script>

<div class="blank-element flex-row" class:disabled={disabled}>
    <div class="blank-info flex-column">
        <span class="blank-title">{title}</span>
        <div class="flex-row blank-input">
            <slot></slot>
        </div>
    </div>
</div>

<style>
    .blank-element {
        width: max-content;
        justify-content: space-between;
        margin: 10px auto;
        width: 80%;
        transition: opacity 0.1s ease-in-out;
    }

    .blank-title {
        font-size: 16px;
        font-weight: bold;
        color: var(--main-text-color);
        margin-bottom: 5px;
    }

    .blank-info {
        width: 100%;
    }

    .blank-input {
        gap: 20px
    }
</style>