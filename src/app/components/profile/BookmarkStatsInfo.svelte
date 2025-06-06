<script>
    export let item;
    import BookmarkStatsDot from "../elements/BookmarkStatsDot.svelte";
    export let size = 16;
    export let type = "flex";
</script>

<div class="stats-info stats-{type}">
    <BookmarkStatsDot
        color="--watching-color"
        name="Смотрю"
        count={item.watching_count}
        {size}
    />
    <BookmarkStatsDot
        color="--plan-color"
        name="В планах"
        count={item.plan_count}
        {size}
    />
    <BookmarkStatsDot
        color="--completed-color"
        name="Просмотрено"
        count={item.completed_count}
        {size}
    />
    <BookmarkStatsDot
        color="--hold-on-color"
        name="Отложено"
        count={item.hold_on_count}
        {size}
    />
    <BookmarkStatsDot
        color="--dropped-color"
        name="Брошено"
        count={item.dropped_count}
        {size}
    />
</div>

<style>
    .stats-info {
        gap: 15px;
        margin-top: 15px;
    }

    .stats-flex {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 5px 15px;
        width: 100%;
    }
</style>
