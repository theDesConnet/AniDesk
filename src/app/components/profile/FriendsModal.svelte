<script>
    import FriendItemRow from "../elements/FriendItemRow.svelte";
    import Preloader from "../gui/Preloader.svelte";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    export let args;
    export let showed;
    dispatch("setTitle", "Друзья");

    let page = 0;
    let allData = [];
    let firstData = anixApi.profile.getFriends({id: args.id, page: 0})

    let updateInfo = false

    async function getFriendPage() {
        const data = await anixApi.profile.getFriends({id: args.id, page, sort: 0 });
        allData = allData.concat(data.content);
        updateInfo = false;
    }

    async function scrollEvent(e) {
        if ((e.srcElement.scrollTop >= e.srcElement.scrollHeight - 2000) && !updateInfo) {
            updateInfo = true;
            page++;
            await getFriendPage();
        }
    }

</script>

{#if showed}
<div class="modal-title">Друзья пользователя</div>
{#await firstData}
    <div class="center">
        <Preloader />
    </div>
{:then i}
    <div tabindex="-1" class="modal-content" onscroll="{scrollEvent}">
        {#each i.content as d}
        <FriendItemRow profile={d} />
        {/each}
        {#each allData as d}
        <FriendItemRow profile={d} />
        {/each}
    </div>
{/await}
{/if}

<style>
    .center {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }
</style>
