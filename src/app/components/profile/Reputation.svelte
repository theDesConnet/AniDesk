<script>
    export let score;
    export let size = {
        width: 30,
        height: 24
    }

    export let fontSize = 12
</script>

<div class="reputation" style="--width: {size.width}px; --height: {size.height}px; --font-size: {fontSize}px" class:good={score >= 0} class:bad={score < 0}>{score}</div>

<style>
    .reputation {
        font-size: var(--font-size);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin-left: 10px;
        width: var(--width);
        height: var(--height);
    }

    .good {
        background-color: transparent;
        border: 1px solid var(--good-reputation-color);
        color: var(--good-reputation-color)
    }

    .bad {
        background-color: transparent;
        border: 1px solid var(--bad-reputation-color);
        color: var(--bad-reputation-color)
    }
</style>