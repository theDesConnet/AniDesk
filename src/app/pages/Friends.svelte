<script>
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";
    import Preloader from "../components/gui/Preloader.svelte";
    import ProfileAvatar from "../components/profile/ProfileAvatar.svelte";
    import Reputation from "../components/profile/Reputation.svelte";
    import { Lottie } from "lottie-svelte";
    import BaseMainButton from "../components/buttons/BaseMainButton.svelte";
    import BaseAltButton from "../components/buttons/BaseAltButton.svelte";
    import AuthPlaceholder from "./AuthPlaceholder.svelte";

    let uid;
    let page = 0;
    let allData = [];
    let updateInfo = false;
    let maxPages = 0;

    const user_id = localStorageWritable("user_token", null);
    user_id.subscribe((value) => (uid = JSON.parse(value)?.id));

    let firstData = getFirstData();

    async function getFriendRequests() {
        const inRequests = await anixApi.profile.getFriendRequests("in", 8);
        const outRequests = await anixApi.profile.getFriendRequests("out", 8);

        return {
            in: inRequests,
            out: outRequests,
        };
    }

    async function getFriends() {
        const friends = await anixApi.profile.getFriends({
            id: uid,
            page,
        });

        return friends;
    }

    async function getFirstData() {
        const friends = await getFriends();
        const requests = await getFriendRequests();

        maxPages = Math.ceil(friends.total_count / 25);

        return {
            requests,
            friends,
        };
    }

    async function getFullFriendInfo(friend) {
        const profileInfo = await anixApi.profile.info(friend.id);
        const blogInfo = await anixApi.channel.getBlog(friend.id);

        return {
            profile: profileInfo.profile,
            blog: blogInfo,
        };
    }

    async function acceptFriendRequest(friend) {
        await anixApi.profile.sendFriendRequest(friend.profile.id);
        firstData = await getFirstData();
        allData = [];
    }

    async function hideFriendRequest(friend) {
        await anixApi.profile.hideFriendRequest(friend.profile.id);
        firstData = await getFirstData();
        allData = [];
    }

    setViewportScrollEvent(async (e) => {
        if (
            e.srcElement.scrollTop >= e.srcElement.scrollHeight - 2000 &&
            !updateInfo &&
            page <= maxPages
        ) {
            updateInfo = true;
            page++;
            const friends = await getFriends();
            allData = allData.concat(friends.content);
            updateInfo = false;
        }
    });
</script>

{#snippet friendCard(f, raw, type = "friend")}
    <button
        onclick={() => updateViewportComponent(8, f.profile.id)}
        class="friend flex-row"
        class:card-background={f.blog.channel?.cover}
        style="--background-image: url({f.blog.channel?.cover})"
    >
        <div class="friends-main flex-row">
            <ProfileAvatar
                src={f.profile.avatar}
                alt={f.profile.login}
                size={{ width: 108, height: 108 }}
                isOnline={f.profile.is_online}
            />
            <div class="friend-info flex-column">
                <div class="friend-name flex-row">
                    <span class="friend-username">{f.profile.login}</span>
                    {#if f.profile.badge}
                        {#if f.profile.badge.image_url.endsWith(".json")}
                            <div class="lottie-badge">
                                <Lottie
                                    path={f.profile.badge.image_url}
                                    container={document.querySelector(
                                        ".lottie-badge",
                                    )}
                                    autoplay={true}
                                    renderer="svg"
                                />
                            </div>
                        {:else}
                            <img
                                class="friend-badge"
                                height="25"
                                width="25"
                                src={f.profile.badge.image_url}
                                alt={f.profile.badge.name}
                            />
                        {/if}
                    {/if}
                    <Reputation
                        score={f.profile.rating_score}
                        size={{ width: 25, height: 21 }}
                        fontSize={12}
                    />
                </div>
                <div class="friends-count">{raw.friend_count} {utils.getNumericWord(raw.friend_count, ['друг', 'друга', 'друзей'])}</div>
                <span class="friend-status">{f.profile.status}</span>
            </div>
        </div>
        <div class="friend-buttons flex-column">
            {#if type === "in"}
                <BaseAltButton
                    btnType="primary"
                    text="Принять"
                    btnWidth="100px"
                    btnHeight="40px"
                    dropShadow={true}
                    font={{ weight: 500 }}
                    onClickCallback={(e) => {
                        e.stopPropagation();
                        acceptFriendRequest(f);
                    }}
                ></BaseAltButton>
                <BaseAltButton
                    btnType="secondary"
                    text="Скрыть"
                    btnWidth="100px"
                    btnHeight="40px"
                    dropShadow={true}
                    font={{ weight: 500 }}
                    onClickCallback={(e) => {
                        e.stopPropagation();
                        hideFriendRequest(f);
                    }}
                ></BaseAltButton>
            {:else if type === "out"}{:else}{/if}
        </div>
    </button>
{/snippet}

{#snippet friendCardSkeleton()}
    <div class="friend-skeleton flex-row">
        <div class="profile-avatar-skeleton"></div>
        <div class="friend-info flex-column">
            <div class="friend-username-skeleton"></div>
            <div class="friend-status-skeleton"></div>
        </div>
    </div>
{/snippet}

{#if anixApi.client.token}
    <div class="friends-page flex-column">
        {#await firstData}
            <Preloader />
        {:then fData}
            {#if fData.requests.in.content.length > 0}
                <div class="incoming-friends flex-column">
                    <span class="friends-title">Входящие заявки</span>
                    {#each fData.requests.in.content as rIn}
                        {#await getFullFriendInfo(rIn)}
                            {@render friendCardSkeleton()}
                        {:then f}
                            {@render friendCard(f, rIn, "in")}
                        {/await}
                    {/each}
                </div>
            {/if}
            {#if fData.requests.out.content.length > 0}
                <div class="outgoing-friends flex-column">
                    <span class="friends-title">Исходящие заявки</span>
                    {#each fData.requests.out.content as rOut}
                        {#await getFullFriendInfo(rOut)}
                            {@render friendCardSkeleton()}
                        {:then f}
                            {@render friendCard(f, rOut, "out")}
                        {/await}
                    {/each}
                </div>
            {/if}
            <div class="friends-list flex-column">
                <span class="friends-title">Друзья</span>
                {#each fData.friends.content as friend}
                    {#await getFullFriendInfo(friend)}
                        {@render friendCardSkeleton()}
                    {:then f}
                        {@render friendCard(f, friend)}
                    {/await}
                {/each}
                {#each allData as friend}
                    {#await getFullFriendInfo(friend)}
                        {@render friendCardSkeleton()}
                    {:then f}
                        {@render friendCard(f, friend)}
                    {/await}
                {/each}
            </div>
        {/await}
    </div>
{:else}
    <AuthPlaceholder />
{/if}

<style>
    .friends-page {
        height: 100%;
        margin: 40px 60px;
    }

    .friend-info {
        margin-left: 15px;
        text-align: left;
    }

    .friend-username {
        font-size: 20px;
        color: var(--main-text-color);
        font-weight: 600;
        line-height: 25px;
    }

    .friends-list {
        gap: 20px;
        padding-bottom: 40px;
    }

    .friend-skeleton {
        height: 170px;
        width: 100%;
        border-radius: 15px;
        align-items: center;
        padding: 0 15px;
        background-color: var(--alt-background-color);
    }

    .friend-username-skeleton {
        width: 100px;
        height: 20px;
        border-radius: 5px;
        background-color: var(--skeleton-background-color);
        animation: skeletonAnimation 3s ease-in-out 100ms infinite forwards;
        margin-bottom: 10px;
    }

    .friend-status-skeleton {
        width: 150px;
        height: 14px;
        border-radius: 5px;
        background-color: var(--skeleton-background-color);
        animation: skeletonAnimation 3s ease-in-out 100ms infinite forwards;
    }

    .profile-avatar-skeleton {
        width: 108px;
        height: 108px;
        border-radius: 108%;
        background-color: var(--skeleton-background-color);
        animation: skeletonAnimation 3s ease-in-out 100ms infinite forwards;
    }

    .friend-status {
        font-size: 14px;
        font-weight: 400;
    }

    .card-background {
        position: relative;
        z-index: 1;
        overflow: hidden;
    }

    .outgoing-friends {
        margin-bottom: 30px;
        gap: 20px;
    }

    .card-background:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 15px;
        background-image: var(--background-image);
        background-size: cover;
        background-position: center;
        opacity: 0.5;
        z-index: -1;
    }

    .friend {
        height: 170px;
        width: 100%;
        border-radius: 15px;
        align-items: center;
        padding: 0 15px;
        cursor: pointer;
        background-color: var(--alt-background-color);
        box-shadow: 9px 11px 13px 0px rgba(0, 0, 0, 0.2);
        justify-content: space-between;
    }

    .friends-title {
        font-size: 24px;
        color: var(--main-text-color);
        font-weight: 500;
        width: fit-content;
    }

    .lottie-badge {
        height: 25px;
        width: 25px;
    }

    .friend-badge {
        margin-left: 10px;
    }

    .friend-name {
        align-items: center;
    }

    .friends-count {
        background-color: var(--background-color);
        color: var(--secondary-text-color);
        font-size: 12px;
        padding: 5px 10px;
        align-items: center;
        border-radius: 6px;
        margin-top: 5px;
        margin-bottom: 3px;
        display: flex;
        width: fit-content;
    }

    .incoming-friends {
        margin-bottom: 20px;
        gap: 20px;
    }

    .friends-main {
        align-items: center;
    }

    .friend-buttons {
        gap: 10px;
    }
</style>
