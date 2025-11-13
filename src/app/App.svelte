<script>
    import TitleBar from "./components/gui/TitleBar.svelte";
    import LeftMenu from "./components/gui/LeftMenu.svelte";
    import HomePage from "./pages/Home.svelte";
    import { Anixart } from "anixartjs";
    import MetaInfo from "./components/gui/MetaInfo.svelte";
    import Utils from "./utils";
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";
    import BaseModal from "./components/modal/BaseModal.svelte";
    import FirstRunModal from "./components/modal/FirstRunModal.svelte";
    import { notificationCount } from "./components/stores/notificationCount";
    import { fade } from "svelte/transition";

    window.utils = Utils;

    let guiSettings, endpointUrl;

    const guiSettingsRaw = localStorageWritable(
        "guiSettings",
        utils.guiDefaultSettings,
    );

    const endpointUrlRaw = localStorageWritable(
        "endpointUrl",
        "api-s.anixsekai.com",
    );

    guiSettingsRaw.subscribe((value) => {
        guiSettings = value;
    });

    endpointUrlRaw.subscribe((value) => {
        endpointUrl = value;
    });

    document.body.classList = [`${guiSettings.theme}-theme`];

    let utoken;

    let isFullscreen = false;

    const user_token = localStorageWritable("user_token", null);
    user_token.subscribe((value) => (utoken = JSON.parse(value)));

    let firstRun;

    const firstRunRaw = localStorageWritable("first_run", true);
    firstRunRaw.subscribe((value) => (firstRun = value));

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

    window.waitForElm = (selector) => {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver((mutations) => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        });
    };

    /**
     * Глобальные переменные
     */
    window.baseSettings = settings.getAll().then((res) => (baseSettings = res));
    window.versions = prc
        .getVersions()
        .then((versions) => (window.versions = versions));
    window.anixApi = new Anixart({
        token: utoken?.token,
        baseUrl: `https://${endpointUrl}`,
    }).endpoints;
    window.profileInfo = utoken
        ? anixApi.profile
              .info(utoken?.id)
              .then((x) => (profileInfo = x.profile))
        : null;
    window.profileSettings = {
        main: null,
        socials: null,
        login: null,
    };
    window.avaliableGPU = utils
        .checkGPUSupport()
        .then((res) => (avaliableGPU = res));

    if (utoken) {
        anixApi.settings
            .getCurrentProfileSettings()
            .then((x) => (profileSettings.main = x));
        anixApi.settings.getSocial().then((x) => (profileSettings.socials = x));
        anixApi.settings
            .getLoginInfo()
            .then((x) => (profileSettings.login = x));

        anixApi.notification
            .countNotifications()
            .then((x) => notificationCount.set(x.count));
    }

    let views;

    let viewInfo = {
        viewportComponent: HomePage,
        args: {typeReleases: 0},
    };

    let viewInfoOld = {
        viewportComponent: null,
        args: null,
    };

    let scrollEvent = null;

    window.setViewportScrollEvent = (callback) => {
        scrollEvent = callback;
    };

    window.addEventListener("resize", function handleResize(event) {
        isFullscreen = window.innerHeight === screen.height;
    });

    setInterval(() => {
        anixApi.notification
            .countNotifications()
            .then((x) => notificationCount.set(x.count));
    }, 1800000); //Раз в 30 минут обновляем кол-во уведомлений
</script>

<main>
    {#if !isFullscreen}
        <TitleBar />
    {/if}
    <div class="main-content" class:fullscreen={isFullscreen}>
        <LeftMenu
            bind:viewportComponent={viewInfo.viewportComponent}
            bind:views
            bind:argsComponent={viewInfo.args}
            bind:viewInfoOld
        />
        {#key viewInfo}
            <MetaInfo />
            <div
                id="viewport"
                class="unselectable"
                tabindex="-1"
                on:scroll={scrollEvent}
                in:fade={{ duration: 200 }}
            >
                <svelte:component
                    this={viewInfo.viewportComponent}
                    args={viewInfo.args}
                ></svelte:component>
                {#if firstRun}
                    <BaseModal
                        modalComponent={FirstRunModal}
                        canCloseOnBackground={false}
                        showed={firstRun}
                        modalSize={{ width: "700px", height: "500px" }}
                        on:closeModal={() => (firstRun = false)}
                    />
                {/if}
            </div>
        {/key}
    </div>
</main>

<style>
    .main-content {
        display: flex;
        flex-direction: row;
        height: calc(100vh - 22px);
        width: 100vw;
        margin-top: 22px;
        position: relative;
        background-color: var(--background-color);
        overflow: hidden;
    }

    .fullscreen {
        margin-top: 0px;
        height: 100vh;
    }

    #viewport {
        overflow-y: auto;
        overflow-x: hidden;
        width: 100vw;
        z-index: 0;
        position: relative;
    }

    :global(::-webkit-scrollbar) {
        width: 10px;
        height: 17px;
    }

    /* Track */
    :global(::-webkit-scrollbar-track) {
        background-color: var(--alt-background-color);
        border-radius: 10px;
        opacity: 0.01;
    }

    /* Handle */
    :global(::-webkit-scrollbar-thumb) {
        background: #828282;
        border-radius: 10px;
        box-shadow: inset 0 0 6px var(--scroll-bar-handle-bg-color);
        -webkit-box-shadow: inset 0 0 6px var(--scroll-bar-handle-bg-color);
    }

    :global(::-webkit-scrollbar-thumb:window-inactive) {
        background: var(--scroll-bar-track-bg-color);
    }
</style>
