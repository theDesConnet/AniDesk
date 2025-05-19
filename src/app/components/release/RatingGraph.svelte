<script>
    export let release;
</script>

{#snippet ratingBar(name, value)}
    <div class="rate-bar flex-row">
        <div class="rate-bar-name">{name}</div>
        <div class="rate-bar-value" style="--value: {value}%"></div>
    </div>
{/snippet}

<div class="rate-graph flex-column">
    {@render ratingBar("5", (release.vote_5_count/release.vote_count) * 100)}
    {@render ratingBar("4", (release.vote_4_count/release.vote_count) * 100)}
    {@render ratingBar("3", (release.vote_3_count/release.vote_count) * 100)}
    {@render ratingBar("2", (release.vote_2_count/release.vote_count) * 100)}
    {@render ratingBar("1", (release.vote_1_count/release.vote_count) * 100)}
</div>

<style>
    .rate-graph {
        margin-left: 15px;
        width: 100%;
        margin-right: 5px;
        margin-top: 3px;
    }

    .rate-bar {
        align-items: center;
        gap: 10px;
        justify-content: center;
    }

    .rate-bar-name {
        font-size: 12px;
        font-weight: bold;
        color: var(--third-text-color);
    }

    .rate-bar-value {
        flex: 1;
        height: 10px;
        background-color: var(--rate-back-color);
        border-radius: 10px;
        position: relative;
        overflow: hidden;
        width: 100%;
    }

    .rate-bar-value::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: var(--value, 0%);
        background-color: var(--main-text-color);
        transition: all 0.3s ease;
        border-radius: 10px;
    }
</style>