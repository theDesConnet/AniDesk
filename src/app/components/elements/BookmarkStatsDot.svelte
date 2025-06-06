<script>
    export let color;
    export let name;
    export let count;
    export let size = 16;
</script>

<div class="stats-dot flex-row" style="--size: {size}px"><div class="stats-dot-color" style:background-color="var({color})"></div><span>{name}</span> <span class="stats-dot-count">{count}</span></div>

<style>
    .stats-dot {
        align-items: center;
        text-align: center;
        width: max-content;
    }

    .stats-dot-color {
        width: calc(var(--size) + 2px);
        height: calc(var(--size) + 2px);
        border-radius: 100%;
        margin-right: 10px;
    }

    .stats-dot-color {
        margin-right: 8px;
    }

    .stats-dot-count {
        font-weight: 500 !important;
        color: var(--main-text-color) !important;
    }

    .stats-dot span {
        font-size: var(--size);
        font-weight: 400;
        margin-bottom: 0px;
        color: var(--third-text-color);
        margin-right: 6px;
    }
</style>