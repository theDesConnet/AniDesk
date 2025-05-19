<script>
    export let color;
    export let name;
    export let count;
</script>

<div class="stats-dot flex-row"><div class="stats-dot-color" style:background-color="var({color})"></div><span>{name}</span> <span class="stats-dot-count">{count}</span></div>

<style>
    .stats-dot {
        align-items: center;
        text-align: center;
        margin-right: 15px;
        margin-top: 8px;
    }

    .stats-dot-color {
        width: 18px;
        height: 18px;
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
        font-size: 16px;
        font-weight: 400;
        margin-bottom: 0px;
        color: var(--third-text-color);
        margin-right: 6px;
    }
</style>