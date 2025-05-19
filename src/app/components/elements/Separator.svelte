<script>
    export let width = "195px";
    export let marginRight = 0;
</script>

<div class="separator" style="--width: {width}; --margin-right: {marginRight}px"></div>

<style>
    .separator {
        width: var(--width);
        background-color: var(--rate-back-color);
        height: 1px;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-right: var(--margin-right);
        min-height: 1px;
    }
</style>