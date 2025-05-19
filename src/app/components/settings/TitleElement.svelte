<script>
    export let title;
</script>

<span class="text-title">{title}</span>

<style>
    .text-title {
        font-size: 20px;
        font-weight: bold;
        color: var(--main-text-color);
        width: 80%;
        margin-top: 5px;
        margin-bottom: 15px;
        transition: opacity 0.1s ease-in-out;
    }
</style>