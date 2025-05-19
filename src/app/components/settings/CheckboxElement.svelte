<script>
    import SliderButton from "../buttons/SliderButton.svelte";

    export let title;
    export let description;
    export let value = false;
    export let onChangeCallback;
    export let disabled = false;
</script>

<div class="checkbox-element flex-row" class:disabled={disabled}>
    <div class="checkbox-info flex-column">
        <span class="checkbox-title">{title}</span>
        <span class="checkbox-description">{description}</span>
    </div>
    <div class="checkbox-button">
        <SliderButton bind:value={value} onClickCallback={onChangeCallback} disabled={disabled}/>
    </div>
</div>

<style>
    .checkbox-element {
        width: max-content;
        justify-content: space-between;
        margin: 10px auto;
        width: 80%;
        transition: opacity 0.1s ease-in-out;
    }

    .checkbox-title {
        font-size: 16px;
        font-weight: bold;
        color: var(--main-text-color);
        margin-bottom: 5px;
    }

    .checkbox-description {
        font-size: 14px;
        color: var(--secondary-text-color);
    }
</style>