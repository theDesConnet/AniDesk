<script>
    export let src;

    let lastDate = src.slice(-10);

    let maxCount = lastDate.map(obj => obj.count).reduce((a, b) => Math.max(a, b), lastDate[0].count);
</script>

{#snippet graphColumn(obj)}
    <div class="watch-dynamic-column flex-column">
        <div class="watch-dynamic-column-count">{obj.count}</div>
        <div class="watch-dynamic-column-line" style:--height="{obj.count > 0 ? Math.floor((obj.count/maxCount*95)) + 5 : 5}%"></div>
        <div class="watch-dynamic-column-date">{utils.getShortDate(obj.timestamp)}</div>
    </div>
{/snippet}

<div class="watch-dynamic flex-row">
    {#each lastDate as obj}
    {@render graphColumn(obj)}
    {/each}
</div>

<style>
    .watch-dynamic {
        align-items: center;
        font-size: 12px;
        color: var(--main-text-color);
        height: 188px;
        max-height: 188px;
        margin-top: 15px;
    }

    .watch-dynamic-column-count {
        font-weight: 500;
        color: var(--main-text-color);
    }

    .watch-dynamic-column-line {
        width: 17px;
        display: flex;
        background-color: var(--main-text-color);
        height: var(--height, 0%);
        border-radius: 10px 10px 0px 0px;
        margin-bottom: 5px;
        transition: height 0.3s ease;
    }

    .watch-dynamic-column {
        align-items: center;
        margin-right: 15px;
        justify-content: end;
        height: 100%;
    }
</style>