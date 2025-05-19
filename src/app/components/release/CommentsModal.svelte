<script>
    import AuthPlaceholder from "../../pages/AuthPlaceholder.svelte";
    import CommentItem from "../elements/CommentItem.svelte";
    import NotAvaliable from "../../pages/NotAvaliable.svelte";
    import Preloader from "../gui/Preloader.svelte";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    export let args;
    export let showed;
    dispatch("setTitle", "Комментарии");

    let page = 0;
    let allData = [];
    let firstData = anixApi.release.getComments({id: args.id, page, sort: 0 });

    let updateInfo = false

    async function getCommentPage() {
        const data = await anixApi.release.getComments({id: args.id, page, sort: 0 });
        allData = allData.concat(data.content);
        updateInfo = false;
    }

    async function scrollEvent(e) {
        if ((e.srcElement.scrollTop >= e.srcElement.scrollHeight - 2000) && !updateInfo) {
            updateInfo = true;
            page++;
            await getCommentPage();
        }
    }

</script>

{#if showed}
<div class="modal-title">Комментарии</div>
{#await firstData}
    <div class="center">
        <Preloader />
    </div>
{:then i}
    <div class="modal-content" onscroll="{scrollEvent}">
        {#each i.content as d}
        {#if d.parent_comment_id === null}
            <CommentItem comment={d} on:showAuthModal={() => dispatch("updateComponent", AuthPlaceholder)}  on:notAvaliable={() => dispatch("updateComponent", NotAvaliable)}/>
        {/if}
        {/each}
        {#each allData as d}
        {#if d.parent_comment_id === null}
            <CommentItem comment={d} on:showAuthModal={() => dispatch("updateComponent", AuthPlaceholder)}  on:notAvaliable={() => dispatch("updateComponent", NotAvaliable)}/>
        {/if}
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
