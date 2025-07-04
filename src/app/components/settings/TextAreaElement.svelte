<script>
    export let title;
    export let value = "";
    export let onChangeCallback;
    export let placeholder = "";
</script>

<div class="text-element flex-row">
    <div class="text-info flex-column">
        <span class="text-title">{title}</span>
        <div class="flex-column text-input">
            <textarea class="text-param" placeholder="{placeholder}" onchange={onChangeCallback}>{value}</textarea>
            <slot></slot>
        </div>
    </div>
</div>

<style>
    .text-element {
        width: max-content;
        justify-content: space-between;
        margin: 10px auto;
        width: 80%;
        position: relative;
        transition: opacity 0.1s ease-in-out;
    }

    .text-title {
        font-size: 16px;
        font-weight: bold;
        color: var(--main-text-color);
        margin-bottom: 5px;
    }

    .text-param {
        width: 100%;
        background-color: var(--alt-background-color);
        border-radius: 15px;
        border: 1px solid var(--rate-back-color);
        padding: 0 10px;
        font-family: "Inter", serif;
        resize: none;
        height: 80px;
        padding: 10px;
        box-sizing: border-box;
        color: var(--main-text-color);
    }

    .text-info {
        width: 100%;
    }

    .text-input {
        gap: 10px;
        width: 100%;
        align-items: center;
    }
</style>