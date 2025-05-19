<script>
    import { createEventDispatcher } from "svelte";

    export let modalComponent;
    export let modalArgs;
    export let modalTitle = null;
    export let showed;
    export let modalSize = {
        width: "1000px",
        height: "600px"
    };
    export let canCloseOnBackground = true;

    const dispatch = createEventDispatcher();

    function closeModal() {
        showed = false;
        modalTitle = null;
        dispatch("closeModal");
    }

    function updateComponent(newComponent) {
        modalComponent = newComponent;
    }

</script>

<div
    class="modal-background"
    style="--display: {showed ? 'flex' : 'none'}"
    onclick={() => {if (canCloseOnBackground) closeModal();}}
>
    <div tabindex="-1" class="modal" style="--width: {modalSize.width}; --height: {modalSize.height};" onclick={(event) => event.stopPropagation()}>
        {#if showed}
            <svelte:component this={modalComponent} args={modalArgs} on:setTitle={(e) => modalTitle = e.detail} showed={showed} on:updateComponent={(e) => updateComponent(e.detail)} on:closeModal={() => closeModal()}></svelte:component>
        {/if}
    </div>
</div>

<style>
    .modal-background {
        display: var(--display);
        position: fixed;
        top: 22px;
        left: 75px;
        width: calc(100vw - 75px);
        height: calc(100vh - 22px);
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 5;
        align-items: center;
        justify-content: center;
    }

    .modal {
        background-color: var(--background-color);
        width: var(--width);
        height: var(--height);
        border-radius: 15px;
        overflow: hidden;
    }

    :global(.modal-title) {
        font-size: 26px;
        font-weight: bold;
        color: var(--main-text-color);
        margin-top: 25px;
        margin-left: 35px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
    }

    :global(.modal-content) {
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        width: 100%;
        height: 85%;
        padding-left: 40px;
        padding-right: 40px;
        padding-bottom: 10px;
        overflow-y: auto;
    }

    :global(.full-content) {
        height: 100% !important;
    }

    :global(.modal-content::-webkit-scrollbar) {
        width: 10px;
        height: 17px;
    }

    /* Track */
    :global(.modal-content::-webkit-scrollbar-track) {
        background-color: #1a1919;
        border-radius: 10px;
        opacity: 0.01;
    }

    /* Handle */
    :global(.modal-content::-webkit-scrollbar-thumb) {
        background: #828282;
        border-radius: 10px;
        box-shadow: inset 0 0 6px var(--scroll-bar-handle-bg-color);
        -webkit-box-shadow: inset 0 0 6px var(--scroll-bar-handle-bg-color);
    }

    :global(.modal-content::-webkit-scrollbar-thumb:window-inactive) {
        background: var(--scroll-bar-track-bg-color);
    }
</style>
