<script>
    import CollectionFullRowCard from "../components/elements/CollectionFullRowCard.svelte";
    import Preloader from "../components/gui/Preloader.svelte";
    import DropdownButton from "../components/buttons/DropdownButton.svelte";
    import MetaInfo from "../components/gui/MetaInfo.svelte";
    import AuthPlaceholder from "./AuthPlaceholder.svelte";

    let page = 0;
    let sort = 4;
    let allData = [];
    let firstData = anixApi.collection.all(page, sort);

    let updateInfo = false;

    async function getCollectionPage() {
        const data =
            sort == 0
                ? await anixApi.collection.getCollectionFavorites(page)
                : await anixApi.collection.all(page, sort);
        allData = allData.concat(data.content);
        updateInfo = false;
    }

    setViewportScrollEvent(async (e) => {
        if (
            e.srcElement.scrollTop >= e.srcElement.scrollHeight - 2000 &&
            !updateInfo
        ) {
            updateInfo = true;
            page++;
            await getCollectionPage();
        }
    });
</script>

<MetaInfo subTitle="Коллекции" />

<div class="button-container">
    <DropdownButton
        values={utils.collectionSortValues}
        value={sort}
        onChange={(e, v) => {
            sort = v;
            page = 0;
            allData = [];
            firstData =
                sort == 0
                    ? anixApi.collection.getCollectionFavorites(page)
                    : anixApi.collection.all(page, sort);
        }}
    />
</div>

{#if sort == 0 && !anixApi.client.token}
    <AuthPlaceholder />
{:else}
    {#await firstData}
        <Preloader />
    {:then data}
        {#each data.content as collection}
            <CollectionFullRowCard {collection} />
        {/each}
        {#each allData as collection}
            <CollectionFullRowCard {collection} />
        {/each}
    {/await}
{/if}

<style>
    .button-container {
        margin-top: 20px;
        margin-left: 20px;
    }
</style>
