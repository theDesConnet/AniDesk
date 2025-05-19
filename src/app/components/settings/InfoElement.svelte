<script>
    export let title;
    export let description;
    export let type = "info";
</script>

<div class="info-element flex-row {type}">
    <div class="info-text flex-column">
        <span class="info-title">{title}</span>
        <span class="info-description">{description}</span>
    </div>
</div>

<style>
    .info-element {
        width: max-content;
        justify-content: space-between;
        margin: 20px auto;
        width: 80%;
        border-radius: 5px;
    }

    .info-text {
        margin: 0 10px;
    }

    .info-title {
        font-size: 16px;
        font-weight: bold;
        color: var(--main-text-color);
        margin-bottom: 5px;
    }

    .info-description {
        font-size: 14px;
        color: var(--main-text-color);
    }

    .info {
        border-left: 5px solid var(--info-color);
    }

    .warning {
        border-left: 5px solid var(--warning-color);
    }

    .danger {
        border-left: 5px solid var(--danger-color);
    }
</style>