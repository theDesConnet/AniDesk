<script>
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";
    import LeftMenuButton from "../left-menu/Button.svelte";
    import LeftMenuAvatar from "../left-menu/Avatar.svelte";
    import Home from "../../pages/Home.svelte";
    import Release from "../../pages/Release.svelte";
    import Profile from "../../pages/Profile.svelte";
    import Login from "../../pages/Login.svelte";
    import Player from "../../pages/Player.svelte";
    import Bookmarks from "../../pages/Bookmarks.svelte";
    import { pageHistory } from "../stores/pageHistory.js";
    import Discover from "../../pages/Discover.svelte";
    import Search from "../../pages/Search.svelte";
    import HomeIcon from "../../icons/home.svg";
    import BookmarkIcon from "../../icons/bookmark.svg";
    import FriendsIcon from "../../icons/friends.svg";
    import DiscoverIcon from "../../icons/discover.svg";
    import SearchIcon from "../../icons/search.svg";
    import NotificationIcon from "../../icons/notification.svg";
    import SettingsIcon from "../../icons/settings.svg";
    import Settings from "../../pages/Settings.svelte";
    import Friends from "../../pages/Friends.svelte";
    import NotAvaliable from "../../pages/NotAvaliable.svelte";
    import CollectionIcon from "../../icons/collection.svg";
    import CollectionList from "../../pages/CollectionList.svelte";
    import Collection from "../../pages/Collection.svelte";
    import Notifications from "../../pages/Notifications.svelte";
    import NotifiactionAvaliable from "../../icons/notificationAvaliable.svg";
    import { notificationCount } from "../stores/notificationCount";

    export const views = [
        Home,
        Bookmarks,
        Friends,
        CollectionList,
        Discover,
        Search,
        NotAvaliable,
        Settings,
        Release,
        Profile,
        Login,
        Player,
        Collection
    ];

    export let viewportComponent = null;
    export let argsComponent = null;

    export let viewInfoOld = {
        viewportComponent: null,
        args: null,
    };

    let utoken;

    $: nCount = $notificationCount;

    const user_token = localStorageWritable("user_token", null);
    user_token.subscribe((value) => (utoken = JSON.parse(value)));

    window.updateViewportComponent = (page, args, history = false) => {
        setViewportScrollEvent(null);
        viewInfoOld.viewportComponent = viewportComponent;
        viewInfoOld.args = argsComponent;
        if (
            viewInfoOld.viewportComponent == views[page] &&
            (JSON.stringify(viewInfoOld.args) === JSON.stringify(args) ||
                viewInfoOld.args == args)
        )
            return;

        argsComponent = args ?? null;
        viewportComponent = typeof(page) == "number" ? views[page] : page;

        if (viewportComponent != Player && viewportComponent != Release) {
            discordRPC.setActivity({
                type: 3,
                state: "Ожидание...",
                largeImageKey: "anidesk-transparent",
                largeImageText: "AniDesk - Anixart Client",
                instance: true,
                buttons: [
                    { label: "Ссылка на клиент", url: "https://anidesk.ds1nc.ru/" },
                ],
            });
        }

	if (!history && viewInfoOld.viewportComponent !== Player) {
		pageHistory.update(h => {
			if (h[0]?.page !== viewInfoOld.viewportComponent || JSON.stringify(h[0].args) !== JSON.stringify(viewInfoOld.args)) {
				h.unshift({ page: viewInfoOld.viewportComponent, args: viewInfoOld.args });
			}
			return h;
		});
	}
    };

    let myProfile = anixApi.profile.info(utoken?.id);
</script>

{#snippet defaultAvatar(callback)}
    <LeftMenuAvatar
        onClickCallback={callback}
        avatar="./assets/icons/defaultAvatar.svg"
    />
{/snippet}

<div
    class="left-menu menu-hidden unselectable"
    class:hide={viewportComponent == views[11]}
>
    <div class="top-menu-content">
        {#if !utoken}
            {@render defaultAvatar(() => updateViewportComponent(10))}
        {:else}
            {#await myProfile}
                {@render defaultAvatar(null)}
            {:then p}
                <LeftMenuAvatar
                    onClickCallback={() =>
                        updateViewportComponent(9, utoken.id)}
                    avatar={p.profile.avatar}
                />
            {/await}
        {/if}

        <LeftMenuButton
            icon={HomeIcon}
            selected={viewportComponent == views[0]}
            viewportComponentIndex={0}
        />
        <LeftMenuButton
            icon={BookmarkIcon}
            selected={viewportComponent == views[1]}
            viewportComponentIndex={1}
        />
        <LeftMenuButton
            icon={FriendsIcon}
            selected={viewportComponent == views[2]}
            viewportComponentIndex={2}
        />
        <LeftMenuButton
            icon={CollectionIcon}
            selected={viewportComponent == views[3]}
            viewportComponentIndex={3}
        />
        <LeftMenuButton
            icon={DiscoverIcon}
            selected={viewportComponent == views[4]}
            viewportComponentIndex={4}
        />
        <LeftMenuButton
            icon={SearchIcon}
            selected={viewportComponent == views[5]}
            viewportComponentIndex={5}
        />
    </div>
    <div class="bottom-menu-content">
        <LeftMenuButton
            icon={nCount > 0 ? NotifiactionAvaliable : NotificationIcon}
            modalComponent={Notifications}
            type="modal"
        />
        <LeftMenuButton
            icon={SettingsIcon}
            selected={viewportComponent == views[7]}
            viewportComponentIndex={7}
        />
    </div>
</div>

<style>
    .left-menu {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: var(--alt-background-color);
        align-items: center;
        overflow: hidden;
        z-index: 10;
    }

    .top-menu-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }

    .bottom-menu-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: auto;
        width: 100%;
        margin-bottom: 20px;
    }

    .menu-hidden {
        width: 75px;
        min-width: 75px;
    }
</style>
