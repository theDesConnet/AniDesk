<script>
    export let args;

    import Preloader from "../components/gui/Preloader.svelte";
    import BookmarkTypes from "../components/elements/BookmarkTypes.svelte";
    import WatchDynamic from "../components/profile/WatchDynamic.svelte";
    import ViewAllButton from "../components/buttons/ViewAllButton.svelte";
    import BookmarkStatsInfo from "../components/profile/BookmarkStatsInfo.svelte";
    import FriendList from "../components/profile/FriendList.svelte";
    import AnimeCardRow from "../components/profile/AnimeCardRow.svelte";
    import MainProfileInfo from "../components/profile/MainProfileInfo.svelte";
    import MetaInfo from "../components/gui/MetaInfo.svelte";
    import BaseModal from "../components/modal/BaseModal.svelte";
    import FriendsModal from "../components/profile/FriendsModal.svelte";
    import VotedReleasesModal from "../components/profile/VotedReleasesModal.svelte";
    import Bookmarks from "./Bookmarks.svelte";

    let showFriendsModal, showBookmarksModal, showVotesReleasesModal = false;
    let modalSubTitle = null;

    async function getProfile() {
        return {
            profileInfo: await anixApi.profile.info(args),
            blogInfo: await anixApi.channel.getBlog(args),
            friendsInfo: await anixApi.profile.getFriends({id: args, page: 0}).catch(() => null),
        }
    }

    let profile = getProfile();

    profile.then((data) => {
        discordRPC.setActivity({
            type: 3,
            state: `Смотрит профиль ${data.profileInfo.profile.login}`,
            details: "AniDesk",
            largeImageKey: `anidesk-transparent`,
            largeImageText: 'AniDesk - Anixart Client',
            instance: true,
            buttons: [
                { label: "Ссылка на профиль", url: `https://anixart.tv/profile/${data.profileInfo.profile.id}` },
                { label: "Ссылка на клиент", url: "https://anidesk.ds1nc.ru/" },
            ],
        });
    });
</script>

{#await profile}
    <Preloader />
{:then p}
{#key modalSubTitle}
<MetaInfo subTitle={`${modalSubTitle ? `${modalSubTitle} | ` : ``}Профиль ${p.profileInfo.profile.login}`} />
{/key}
<div class="profile-container">
    {#if p.blogInfo?.channel?.cover}
    <div class="profile-cover">
        <img height="400" src={p.blogInfo.channel.cover} alt={p.profileInfo.profile.login} />
    </div>
    {/if}
    <div class="profile" class:cover-margin={p.blogInfo?.channel?.cover} class:minify-margin={!p.blogInfo?.channel?.cover}>
        <MainProfileInfo profile={p.profileInfo.profile} isMyProfile={p.profileInfo.is_my_profile} on:updateProfile={async () => profile = await getProfile()}/>
        {#if p.profileInfo.profile.is_counts_hidden || p.profileInfo.profile.is_stats_hidden || p.profileInfo.profile.is_social_hidden}
        <div class="profile-info-hidden">
            У пользователя установлены настройки приватности. Некоторая информация может быть для вас недоступна.
        </div>
        {/if}
        {#if !p.profileInfo.profile.is_stats_hidden}    
        <div class="profile-info-stats">
            <div class="stats-title"><span class=stats-text>Статистика</span> <ViewAllButton onClickCallback={() => {
                if (p.profileInfo.is_my_profile) updateViewportComponent(1);
                else showBookmarksModal = true;
            }}/></div>
            <BookmarkTypes --bookmark-radius="10px" --bookmark-height="28px" types={{
                watching: p.profileInfo.profile.watching_count, 
                plan: p.profileInfo.profile.plan_count, 
                completed: p.profileInfo.profile.completed_count, 
                hold_on: p.profileInfo.profile.hold_on_count, 
                dropped: p.profileInfo.profile.dropped_count}} 
                />

            <BookmarkStatsInfo item={p.profileInfo.profile} />
            <div class="stats-watch">
                <div>Просмотрено серий: <span>{p.profileInfo.profile.watched_episode_count}</span></div>
                <div>Время просмотра: <span>~ {utils.returnFullStringTime(p.profileInfo.profile.watched_time)}</span></div> 
            </div>
        </div>
        {/if}
        <div class="container">
            {#if p.profileInfo.profile.watch_dynamics.length > 0 && !p.profileInfo.profile.is_counts_hidden}
            <div class="profile-dynamic-watch">
                Динамика просмотра
                <WatchDynamic src={p.profileInfo.profile.watch_dynamics} />
            </div>
            {/if}
            {#if p.profileInfo.is_my_profile && p.friendsInfo.content.length > 0 || p.profileInfo.profile.friend_status == 2 && p.friendsInfo.content.length > 0 || !p.profileInfo.profile.is_private && p.friendsInfo.content.length > 0 }
            <div class="profile-friends">
                <div class="profile-friends-header">
                    Друзья
                    {#if p.profileInfo.profile.friend_count > 5}
                        <ViewAllButton onClickCallback={() => showFriendsModal = true}/>
                    {/if}
                </div>
                <FriendList friendsInfo={p.friendsInfo} />
            </div>
            {/if}
        </div>
        {#if p.profileInfo.profile.votes.length > 0}
        <div class="container">
            <div class="release-rates">
                <div class="release-rates-header">
                    Оценка релизов
                    {#if p.profileInfo.profile.votes.length >= 5}
                        <ViewAllButton onClickCallback={() => showVotesReleasesModal = true}/>
                    {/if}
                </div>
                <AnimeCardRow releases={p.profileInfo.profile.votes} type="rate" />
            </div>
        </div>
        {/if}

        {#if p.profileInfo.profile.history.length > 0 && !p.profileInfo.profile.is_counts_hidden}
        <div class="container">
            <div class="watch-history">
                <div class="watch-history-header">
                    История просмотра
                </div>
                <AnimeCardRow releases={p.profileInfo.profile.history} type="watched" />
            </div>
        </div>
        {/if}
    </div>
    <BaseModal modalComponent={FriendsModal} showed={showFriendsModal} modalArgs={p.profileInfo.profile} bind:modalTitle={modalSubTitle} on:closeModal={() => showFriendsModal = false} />
    <BaseModal modalComponent={Bookmarks} showed={showBookmarksModal} modalArgs={{ id: p.profileInfo.profile.id, isModal: true }} modalSize={{width: "80%", height: "90%"}} bind:modalTitle={modalSubTitle} on:closeModal={() => showBookmarksModal = false} />
    <BaseModal modalComponent={VotedReleasesModal} showed={showVotesReleasesModal} modalArgs={{ id: p.profileInfo.profile.id }} bind:modalTitle={modalSubTitle} modalSize={{width: "80%", height: "70%"}} />
</div>
{/await}

<style>
    .watch-history-header {
        font-size: 24px;
        color: var(--main-text-color);
        margin-bottom: 20px;
        margin-top: 10px;
        font-weight: 500;
    }


    .watch-history {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .minify-margin {
        margin-top: 30px;
    }

    .stats-title {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .release-rates {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-top: 15px;
    }

    .release-rates-header {
        font-size: 24px;
        color: var(--main-text-color);
        margin-bottom: 20px;
        font-weight: 500;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .profile-friends-header {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .profile-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: max-content;
        position: relative;
    }

    .profile-cover {
        width: 100%;
        height: 400px;
        overflow: hidden;
        -webkit-box-shadow: 0px 9px 8px 0px rgba(0, 0, 0, 0.2);
        -moz-box-shadow: 0px 9px 8px 0px rgba(0, 0, 0, 0.2);
        box-shadow: 0px 9px 8px 0px rgba(0, 0, 0, 0.2);
        position: absolute;
    }

    .profile-cover img {
        width: 100%;
        object-fit: cover;
        object-position: center;
    }
    
    .profile {
        z-index: 1;
        min-width: 930px;
        max-width: 1200px;
    }

    .cover-margin {
        margin-top: 312px;
    }

    .profile-info-stats {
        display: flex;
        flex-direction: column;
        margin-top: 15px;
        justify-content: center;
    }

    .profile-info-stats span {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 10px;
    }

    .stats-watch {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 8px;
        color: var(--third-text-color);
        font-size: 16px;
    }

    .stats-watch div {
        margin-right: 15px;
    }

    .stats-watch span {
        font-size: 16px;
        font-weight: 500;
        color: var(--main-text-color);
    }

    .container {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    .profile-info-hidden {
        display: flex;
        flex-direction: row;
        font-size: 14px;
        color: var(--secondary-text-color);
        font-weight: 500;
        margin-top: 15px;
        box-shadow: inset 0 0 0 2px var(--secondary-text-color);
        border-radius: 10px;
        width: 100%;
        padding: 15px;
    }

    .profile-dynamic-watch {
        display: flex;
        flex-direction: column;
        font-size: 24px;
        color: var(--main-text-color);
        font-weight: 500;
        margin-top: 20px;
    }

    .profile-friends {
        display: flex;
        flex-direction: column;
        font-size: 24px;
        color: var(--main-text-color);
        font-weight: 500;
        margin-top: 20px;
        margin-left: 20px;
    }
</style>