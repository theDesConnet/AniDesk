<script>
    import Icon from "../elements/Icon.svelte";

    export let viewportComponentIndex;
    export let icon;
    export let selected
</script>

<button class="left-menu-button" onclick={() => updateViewportComponent(viewportComponentIndex)} class:selected={selected}>
    <Icon src={icon} varColor="--main-text-color" size={{width: 20, height: 20}}/>
</button>

<style>
    .left-menu-button {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 50px;
        width: 100%;
        transition: all 0.3s;
    }

    .left-menu-button:hover {
        background-color: var(--select-button-left-color);
    }

    .selected {
        background-color: var(--select-button-left-color);
    }

    .selected:hover {
        background-color: var(--background-color);
    }
</style>