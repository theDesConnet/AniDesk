<script>
    export let title;
    export let value = "";
    export let onChangeCallback;
    export let placeholder = "";
    export let type = "text";
    export let suffix;
    export let min;
    export let max;
    export let disabled = false;
    export let required = false;

    function _onChange(e) {
        if (min && Number(e.target.value) < Number(min)) {
            e.target.value = min;
        } else if (max && Number(e.target.value) > Number(max)) {
            e.target.value = max;
        }

        onChangeCallback(e);
    }
</script>

<div class="text-element flex-row" class:disabled={disabled}>
    <div class="text-info flex-column">
        <span class="text-title">{title}</span>
        <div
            class="flex-column text-input"
            style={suffix ? `--suffix: '${suffix}';` : ""}
        >
            <input
                {placeholder}
                onchange={_onChange}
                class="text-param"
                {type}
                {value}
                {min}
                {max}
                required={required}
            />
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
        border-radius: 10px;
        border: 1px solid var(--rate-back-color);
        padding: 0 10px;
        height: 40px;
        box-sizing: border-box;
    }

    .text-input::after {
        content: var(--suffix);
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0.5em;
        transition: all 0.05s ease-in-out;
        font-size: 14px;
        font-weight: bold;
    }

    .text-input:hover::after,
    .text-input:focus-within::after {
        right: 2em;
    }

    .text-info {
        width: 100%;
    }

    .text-input {
        gap: 20px;
        position: relative;
    }
</style>
