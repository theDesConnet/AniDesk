<script>
    export let profile;
    export let isMyProfile;

    import SocialInfo from "./SocialInfo.svelte";
    import Reputation from "./Reputation.svelte";
    import { Lottie } from "lottie-svelte";
    import BaseAltButton from "../buttons/BaseAltButton.svelte";
    import ProfileAvatar from "./ProfileAvatar.svelte";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    async function sendFriendRequest(p) {
        if (p.friend_status == null || p.friend_status == 1) {
            profile.friend_status = (await anixApi.profile.sendFriendRequest(profile.id)).friend_status;

            if (profile.friend_status == 2) dispatch("updateProfile");
        } else {
            profile.friend_status = (await anixApi.profile.removeFriendRequest(profile.id)).friend_status;
        }
    }
</script>

<div class="profile-info flex-row">
    <div class="profile-info-image flex-column">
        <div class="p-image">
            <ProfileAvatar
                size={{
                    width: 175,
                    height: 175,
                }}
                src={profile.avatar}
                alt={profile.login}
            />
        </div>
        {#if !isMyProfile}
            <div class="profile-info-buttons flex-column">
                <BaseAltButton
                    btnType={profile.friend_status == null || profile.friend_status == 1
                        ? "primary"
                        : "secondary"}
                    text={profile.friend_status == null || profile.friend_status == 1
                        ? "Добавить в друзья"
                        : "Удалить из друзей"}
                    onClickCallback={() => sendFriendRequest(profile)}
                />
            </div>
        {/if}
    </div>
    <div class="profile-info-main flex-column">
        <div class="profile-info-name flex-row">
            {profile.login}
            {#if profile.badge}
                {#if profile.badge.image_url.endsWith(".json")}
                    <div class="lottie-badge">
                        <Lottie
                            path={profile.badge.image_url}
                            container={document.querySelector(".lottie-badge")}
                            autoplay={true}
                            renderer="svg"
                        />
                    </div>
                {:else}
                    <img
                        height="38"
                        width="38"
                        src={profile.badge.image_url}
                        alt={profile.badge.name}
                    />
                {/if}
            {/if}
            <Reputation score={profile.rating_score} />
            <div
                class="profile-info-online flex-row"
                class:online={profile.is_online}
            >
                {profile.is_online
                    ? "в сети"
                    : `был(а) в сети ${utils.returnTimeString(profile.last_activity_time)}`}
            </div>
        </div>
        {#if profile.status.trim().length > 0}
            <div class="profile-info-status">
                {profile.status}
            </div>
        {/if}
        {#if profile.roles.length > 0}
            <div class="profile-info-roles flex-row">
                {#each profile.roles as role}
                    <div
                        class="profile-info-role flex-row"
                        style="--color: #{role.color}"
                    >
                        <div class="role-dot"></div>
                        <span>{role.name}</span>
                    </div>
                {/each}
            </div>
        {/if}
        <SocialInfo {profile} />
        {#if profile.is_banned}
            <div class="profile-info-banned flex-row">
                <div class="banned-icon">
                    <img src="./assets/icons/deny.svg" alt="banned" />
                </div>
                <div class="banned-text flex-column">
                    <span
                        >Пользователь был заблокирован за нарушение правил до {utils.returnTimeString(
                            profile.ban_expires * 1000,
                        )}</span
                    >
                    <span class="banned-reason"
                        >Причина: {profile.ban_reason}</span
                    >
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .profile-info-buttons {
        margin-top: 10px;
    }

    .banned-text {
        margin: 0;
        color: var(--ban-color);
        font-size: 14px;
    }

    .banned-icon {
        margin-right: 10px;
    }

    .profile-info-banned {
        margin-top: 10px;
        border: 1px solid var(--ban-color);
        border-radius: 10px;
        padding: 10px 20px;
    }

    .profile-info-online {
        float: right;
        margin-left: auto;
        margin-right: 0px;
        font-size: 14px;
        color: var(--secondary-text-color);
    }

    .profile-info-roles {
        margin-top: 10px;
        gap: 7px;
    }

    .profile-info-role {
        justify-items: center;
        align-items: center;
        border-radius: 20px;
        padding: 2px 10px;
        border-color: var(--color);
        border-style: solid;
        border-width: 1px;
        color: var(--color);
        font-size: 12px;
        font-weight: 300;
    }

    .role-dot {
        border-radius: 100%;
        background-color: var(--color);
        width: 8px;
        height: 8px;
        margin-right: 3px;
    }

    .online {
        color: #4aa424;
    }

    .profile-info-main {
        margin-left: 10px;
        margin-top: 95px;
        width: 100%;
    }

    .profile-info-name {
        font-size: 32px;
        font-weight: 600;
        color: var(--main-text-color);
        align-items: center;
        width: 100%;
    }

    .profile-info-name img {
        margin-left: 10px;
    }

    .lottie-badge {
        height: 38px;
        width: 38px;
    }

    .p-image {
        border-radius: 100%;
        outline-color: var(--background-color);
        outline-style: solid;
        outline-width: 6px;
        object-fit: cover;
    }
</style>
