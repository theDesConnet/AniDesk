<script>
    export let profile;
    import BookmarkStatsDot from "../elements/BookmarkStatsDot.svelte";
</script>

<div class="stats-info flex-row">
    <BookmarkStatsDot color="--watching-color" name="Смотрю" count={profile.watching_count} />
    <BookmarkStatsDot color="--plan-color" name="В планах" count={profile.plan_count} />
    <BookmarkStatsDot color="--completed-color" name="Просмотрено" count={profile.completed_count} />
    <BookmarkStatsDot color="--hold-on-color" name="Отложено" count={profile.hold_on_count} />
    <BookmarkStatsDot color="--dropped-color" name="Брошено" count={profile.dropped_count} />
</div>

<style>
    .stats-info {
        margin-top: 10px;
    }
</style>