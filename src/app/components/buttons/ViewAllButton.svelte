<script>
    import BaseMainButton from "./BaseMainButton.svelte";
    export let width = "auto";
    export let marginLeft = "auto";
    export let title = "Посмотреть всё";

    export let onClickCallback;
</script>

<div style="--margin-left: {marginLeft}; margin-left: var(--margin-left); margin-right: 10px;">
<BaseMainButton customClasses="view-all-button" onClickCallback={onClickCallback} width={width} borderRadius={6}>{title}</BaseMainButton>
</div>

<style>
    :global(.view-all-button) {
        margin-left: var(--margin-left);
        margin-right: 10px;
        font-size: 12px;
        font-weight: bold;
        padding-left: 10px;
        padding-right: 10px;
    }
</style>
