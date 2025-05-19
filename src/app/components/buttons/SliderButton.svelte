<script>
    export let value = false;
    export let onClickCallback;
    export let disabled = false;

    function setSlider(e) {
        value = !value;
        onClickCallback(value);
    }
</script>

<button class="slider-button" class:active={value} onclick={setSlider} disabled={disabled}></button>

<style>
    .slider-button {
        width: 50px;
        height: 28px;
        border-radius: 15px;
        display: flex;
        transition: all 0.2s cubic-bezier(0.65, 0, 0.35, 1);
        background-color: var(--slider-button-inactive-color);
        position: relative;
    }

    .slider-button::after {
        content: "";
        position: absolute;
        width: 20px;
        left: 5px;
        height: 20px;
        background-color: var(--slider-button-dot-color);
        border-radius: 100%;
        top: 50%;
        transform: translateY(-50%);
        transition: left 0.2s cubic-bezier(0.65, 0, 0.35, 1);
    }

    .slider-button.active {
        background-color: var(--slider-button-active-color);
    }

    .slider-button.active::after {
        left: 25px;
    }
</style>
