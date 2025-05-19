<script>
    export let subTitle;
    export let title = "AniDesk";
</script>

<svelte:head>
    <title>{subTitle ? `${subTitle} - ${title}` : title}</title>
</svelte:head>