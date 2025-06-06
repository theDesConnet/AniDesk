<script>
    export let types;

    function getPercentType(type) {
        return (
            (type /
                (types.watching +
                    types.plan +
                    types.completed +
                    types.hold_on +
                    types.dropped)) *
            100
        );
    }
</script>

<div class="bookmarks-bar flex-row">
    <div
        class="segment watching"
        style="--segment-width: {getPercentType(types.watching)}%;"
    ></div>
    <div
        class="segment plan"
        style="--segment-width: {getPercentType(types.plan)}%;"
    ></div>
    <div
        class="segment completed"
        style="--segment-width: {getPercentType(types.completed)}%;"
    ></div>
    <div
        class="segment hold-on"
        style="--segment-width: {getPercentType(types.hold_on)}%;"
    ></div>
    <div
        class="segment dropped"
        style="--segment-width: {getPercentType(types.dropped)}%;"
    ></div>
</div>

<style>
    .bookmarks-bar {
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: var(--bookmark-height, 22px);
        border-radius: var(--bookmark-radius, 5px);
        overflow: hidden;
        position: relative;
    }

    .bookmarks-bar::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        background-color: var(--alt-background-color);
        z-index: -1;
    }

    .segment {
        position: relative;
        height: 100%;
        width: var(--segment-width, 0%);
    }

    .watching {
        background-color: var(--watching-color);
    }

    .plan {
        background-color: var(--plan-color);
    }

    .completed {
        background-color: var(--completed-color);
    }

    .hold-on {
        background-color: var(--hold-on-color);
    }

    .dropped {
        background-color: var(--dropped-color);
    }
</style>
