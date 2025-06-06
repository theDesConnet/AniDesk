<script>
    export let profile;
    import { Lottie } from "lottie-svelte";
    import ProfileAvatar from "../profile/ProfileAvatar.svelte";
</script>

<button class="friend-item-row flex-row" on:click={() => updateViewportComponent(9, profile.id)}>
    <div class="friend-item-row-image">
        <ProfileAvatar
            size={{ height: 40, width: 40 }}
            src={profile.avatar}
            alt={profile.login}
            isOnline={profile.is_online}
            outlineWidth={2}
        />
    </div>
    <div class="friend-item-row-info flex-column">
        <div
            class="friend-item-row-username flex-row"
        >
            {profile.login}
            {#if profile.badge_url}
                <div class="badge">
                    {#if profile.badge_url.endsWith(".json")}
                        <Lottie
                            src={profile.badge_url}
                            height="20"
                            width="20"
                        />
                    {:else}
                        <img
                            height="20"
                            width="20"
                            src={profile.badge_url}
                            alt={profile.badge_name}
                        />
                    {/if}
                </div>
            {/if}

            {#if profile.is_verified}
                <div class="verified">                    
                    <img height="20" width="20" src="./assets/icons/verified.svg" alt="verified" />
                </div>
            {/if}
        </div>
        <div class="friend-item-row-status flex-row">
            {profile.friend_count} друзей
        </div>
    </div>
</button>

<style>
    .verified {
        display: flex;
        align-content: center;
        margin-left: 3px;
    }

    .friend-item-row {
        margin-bottom: 10px;
        cursor: pointer;
        border-bottom: 1px solid var(--third-text-color);
    }

    .friend-item-row-username {
        line-height: 20px;
    }

    .badge {
        margin-left: 3px;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .friend-item-row-image {
        margin-right: 10px;
        margin-bottom: 8px;
    }

    .friend-item-row-status {
        font-size: 12px;
        color: var(--third-text-color);
    }
</style>
