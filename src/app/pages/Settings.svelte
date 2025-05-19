<script>
    import Separator from "../components/elements/Separator.svelte";
    import SettingsAbout from "../settings-pages/SettingsAbout.svelte";
    import SettingsPlayer from "../settings-pages/SettingsPlayer.svelte";
    import SettingsProfile from "../settings-pages/SettingsProfile.svelte";
    import SettingsPlaying from "../settings-pages/SettingsPlaying.svelte";
    import SettingsUpscale from "../settings-pages/SettingsUpscale.svelte";
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";
    import githubLogo from "../icons/github.svg";
    import Icon from "../components/elements/Icon.svelte";
    import SettingsApp from "../settings-pages/SettingsApp.svelte";

    const user_token = localStorageWritable("user_token", null);

    const views = [SettingsProfile, SettingsApp, SettingsPlayer, SettingsPlaying, SettingsUpscale, SettingsAbout];

    let viewInfo = {
        page: SettingsProfile,
        args: null
    }

    function setPage(page, args) {
        viewInfo.page = page;
        viewInfo.args = args;
    }
</script>


<div class="settings flex-row">
    <div class="settings-left-menu flex-column">
        <span class="settings-title">Основное</span>
        <button class="settings-category flex-row" class:selected-category={viewInfo.page == views[0]} onclick={() => setPage(views[0], null)}>Настройки пользователя</button>
        <button class="settings-category flex-row" class:selected-category={viewInfo.page == views[1]} onclick={() => setPage(views[1], null)}>Настройки приложения</button>
        <Separator marginRight={22}/>
        <span class="settings-title">Воспроизведение</span>
        <button class="settings-category flex-row" class:selected-category={viewInfo.page == views[2]} onclick={() => setPage(views[2], null)}>Настройки плеера</button>
        <button class="settings-category flex-row" class:selected-category={viewInfo.page == views[3]} onclick={() => setPage(views[3], null)}>Настройки воспроизведения</button>
        <button class="settings-category flex-row" class:selected-category={viewInfo.page == views[4]} onclick={() => setPage(views[4], null)}>Улучшение качества</button>
        <Separator marginRight={22}/>
        <button class="settings-category flex-row" class:selected-category={viewInfo.page == views[5]} onclick={() => setPage(views[5], null)}>О программе</button>
        <Separator marginRight={22}/>
        <button class="settings-category flex-row" disabled={!anixApi.client.token} class:disabled={!anixApi.client.token} onclick={() => {
            user_token.set(null);
            location.reload();
        }}>Выйти</button>
        <Separator marginRight={22}/>
        <div class="build-info flex-column">
            <span class="third-text">AniDesk v{window.versions.anidesk}</span>
            <span class="third-text">NodeJS v{window.versions.node}</span>
            <span class="third-text">Electron v{window.versions.electron}</span>
            <span class="third-text">Chrome v{window.versions.chrome}</span>
        </div>
        <div class="links-info flex-row">
            <button onclick={() => winApi.openLink(`https://github.com/theDesConnet/AniDesk`)}>
            <Icon src={githubLogo} varColor="--third-text-color" size={{width: 30, height: 30}}/>
            </button>
        </div>
    </div>
    <div class="settings-page">
        {#key viewInfo}
        <svelte:component this={viewInfo.page} args={viewInfo.args}></svelte:component>
        {/key}
    </div>
</div>

<style>
    .third-text {
        color: var(--third-text-color);
        font-size: 11px;
        font-weight: 400;
        width: 210px;
    }

    .links-info {
        margin-top: 10px;
        margin-right: 22px;
        width: 195px;
    }

    .build-info {
        margin-top: 10px;
    }

    .settings {
        justify-content: space-evenly;
        height: 100%;
        overflow: hidden;
    }

    .settings-page {
        width: 80%;
        overflow-y: auto;
        padding-bottom: 20px;
    }

    .selected-category {
        background-color: var(--select-button-left-color) !important;
        color: var(--main-text-color) !important;
    }

    .settings-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--secondary-text-color);
        padding-left: 15px;
        width: 210px;
        margin-bottom: 10px;
    }

    .settings-left-menu {
        width: 20%;
        min-width: 220px;
        background-color: var(--alt-background-color);
        align-items: flex-end;
        overflow-y: auto;
        padding-top: 60px;
        padding-bottom: 60px;
    }

    .settings-category {
        margin-top: 2px;
        height: 30px;
        width: 220px;
        justify-content: flex-start;
        align-items: center;
        padding-left: 15px;
        margin-right: 10px;
        border-radius: 10px;
        color: var(--secondary-text-color);
        min-height: 30px;
        transition: background-color 0.2s ease-in-out;
    }

    .settings-category:hover {
        background-color: var(--select-button-color);
        color: var(--main-text-color);
    }
</style>