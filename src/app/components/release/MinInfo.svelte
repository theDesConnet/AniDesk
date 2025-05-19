<script>
    export let release;

    function returnFlag(i) {
        switch(i) {
            case "Япония": return "./assets/icons/japan.svg";
            case "Китай" : return "./assets/icons/china.svg";
        }
    }
</script>

{#snippet minInfoItem(icon, text)}
<div class="release-minInfo-item flex-row">
    <div class="minInfo-icon">
        <img src="{icon}" alt="minInfoIcon" width="37px" height="22px">
    </div>
    <div class="minInfo-text">{text}</div>
</div>
{/snippet}

<div class="release-minInfo flex-column">
    {#if release.country != "" && release.country != null}
    {@render minInfoItem(returnFlag(release.country), `${release.country}${!release.year ? "" : `, ${release.year} г.`}`)}
    {/if}

    {@render minInfoItem("./assets/icons/episode.svg", `${utils.returnEpisodeString(release)} эп. по ~${release.duration} мин.`)}
    {@render minInfoItem("./assets/icons/status.svg", `${release.category.name}${release.status ? `, ${release.status?.name}` : ""}`)}

    {#if 
    (release.studio != null || 
    release.director != null || 
    release.author != null) &&
    (release.studio != "" ||
    release.director != "" ||
    release.author != "")}
    {@render minInfoItem("./assets/icons/studio.svg", `${!release.studio ? "" : `Студия ${release.studio}`}${!release.author ? "" : `, автор ${release.author}`}${!release.director ? "" : `, режиссер ${release.director}`}`)}
    {/if}

    {#if release.genres != null && release.genres != ""}
    {@render minInfoItem("./assets/icons/genres.svg", `${release.genres}`)}
    {/if}
</div>

<style>
    .release-minInfo {
        max-width: 433px;
        float: right;
    }

    .release-minInfo-item {
        margin-bottom: 5px;
        align-items: center;
    }

    .minInfo-icon {
        margin-right: 8px;
    }
</style>