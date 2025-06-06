<script>
    import { Lottie } from "lottie-svelte";
    import ProfileAvatar from "./ProfileAvatar.svelte";

    export let friendsInfo;
</script>

<div class="profile-friends-list">
    {#each friendsInfo.content.slice(0, 5) as friend}
    <button class="friend-profile" on:click={() => updateViewportComponent(9, friend.id)}>
        <ProfileAvatar src={friend.avatar} alt={friend.login} size={{width: 120, height: 120}} isOnline={friend.is_online}/>
        <div class="friend-profile-info">
            <div class="friend-profile-username">{friend.login}
                {#if friend.badge_id}
                {#if (friend.badge_url).endsWith('.json')}
                <div class="lottie-badge">
                    <Lottie path={friend.badge_url} container={document.querySelector(".lottie-badge")} autoplay={true} renderer="svg"/>
                </div>
                {:else}
                <img height="20" width="20" src={friend.badge_url} alt={friend.badge_name} />
                {/if}
                {/if}
                {#if friend.is_verified}
                <div class="verified">                    
                    <img height="20" width="20" src="./assets/icons/verified.svg" alt="verified" />
                </div>
                {/if}
            </div>
            <div class="friend-profile-status">{friend.friend_count} друзей</div>
        </div>
    </button>
    {/each}
</div>

<style>
    .verified {
        display: flex;
        align-content: center;
        margin-left: 3px;
    }

    .profile-friends-list {
        display: flex;
        flex-direction: row;
        margin-top: 25px;
    }

    .friend-profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 15px;
    }

    .friend-profile:last-child {
        margin-right: 0px;
    }

    .friend-profile-info {
        margin-top: 5px;
        align-items: center;
        text-align: center;
    }

    .friend-profile-username {
        font-size: 16px;
        color: var(--main-text-color);
        display: flex;
        flex-direction: row;
        justify-content: center;
        line-height: 28px;
        align-items: center;
    }

    .friend-profile-username img {
        margin-left: 5px;
        object-fit: cover;
    }

    .lottie-badge {
        height: 20px; 
        width: 20px;
    }

    .friend-profile-status {
        font-size: 12px;
        color: var(--secondary-text-color);
    }
</style>