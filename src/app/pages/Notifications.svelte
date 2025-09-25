<script>
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    import Icon from "../components/elements/Icon.svelte";
    import CloseIcon from "../icons/close.svg";
    import DeleteIcon from "../icons/delete.svg";
    import { fade } from "svelte/transition";
    import { notificationCount } from "../components/stores/notificationCount";

    let notificationsContainer = null;
    let showed = false;
    const dispatchEvent = createEventDispatcher();
    let notifications = anixApi.notification.getNotifications(0);

    function handleClickOutside(e) {
        if (!showed) return (showed = true);

        if (
            showed &&
            notificationsContainer &&
            !notificationsContainer.contains(e.target)
        ) {
            dispatchEvent("closeModal");
        }
    }

    function getNotificationImage(notification) {
        switch (notification.type) {
            case "myCollection":
                return notification.collection_comment.profile.avatar;
            case "relatedRelease":
                return notification.release.image;
            case "friend":
                return notification.by_profile.avatar;
        }
    }

    function getNotificationText(notification) {
        switch (notification.type) {
            case "myCollection":
                return `Новый комментарий в вашей коллекции <b>"${notification.collection_comment.collection.title}"</b> от пользователя <b>${notification.collection_comment.profile.login}</b>: ${notification.collection_comment.message}`;
            case "relatedRelease":
                return `Появился новый связанный релиз <b>"${notification.release.title_ru}"</b>`;
            case "friend":
                return `Новый запрос в друзья от <b>"${notification.by_profile.login}"</b>`;
        }
    }

    function notificationClick(e, notification) {
        switch (notification.type) {
            case "myCollection":
                updateViewportComponent(12, {
                    id: notification.collection_comment.collection.id,
                });
                break;
            case "relatedRelease":
                updateViewportComponent(8, { id: notification.release.id });
                break;
            case "friend":
                updateViewportComponent(9, notification.by_profile.id);
                break;
        }

        dispatchEvent("closeModal");
    }

    onMount(() => {
        document.addEventListener("click", handleClickOutside);
    });

    onDestroy(() => {
        document.removeEventListener("click", handleClickOutside);
    });
</script>

<div
    class="container notifications-modal flex-column"
    bind:this={notificationsContainer}
    in:fade={{ duration: 100 }}
    out:fade={{ duration: 100 }}
>
    <div class="notifications-modal-titlebar">
        <span class="notifications-title">Уведомления</span>
        <div class="modal-buttons flex-row">
            <button
                onclick={async () => {
                    await anixApi.notification.removeAllNotifications();
                    notifications = anixApi.notification.getNotifications(0);
                    notificationCount.set(0);
                }}
            >
                <Icon
                    src={DeleteIcon}
                    size={{ width: 15, height: 15 }}
                    varColor="--main-text-color"
                />
            </button>
            <button onclick={() => dispatchEvent("closeModal")}>
                <Icon
                    src={CloseIcon}
                    size={{ width: 15, height: 15 }}
                    varColor="--main-text-color"
                />
            </button>
        </div>
    </div>
    {#await notifications then n}
        {#if n.content.length === 0}
            <div class="notify-center">
                <span class="third-text">Нет уведомлений</span>
            </div>
        {:else}
            {#each n.content
                .filter((x) => utils.avaliableNotifications.includes(x.type))
                .sort((a, b) => b.timestamp - a.timestamp) as notification}
                <button
                    class="notification flex-row"
                    onclick={(e) => notificationClick(e, notification)}
                >
                    <img
                        src={getNotificationImage(notification)}
                        alt="cover"
                        class="notification-icon"
                    />
                    <div class="flex-column notification-content">
                        <span class="notification-text"
                            >{@html getNotificationText(notification)}</span
                        >
                        <span class="notification-date"
                            >{utils.returnTimeString(
                                notification.timestamp * 1000,
                            )}</span
                        >
                    </div>
                </button>
            {/each}
        {/if}
    {/await}
</div>

<style>
    .notifications-modal {
        width: 800px;
        max-height: 600px;
        min-height: 400px;
        position: absolute;
        bottom: 10px;
        left: 90px;
        background-color: var(--alt-background-color);
        border-radius: 15px;
        overflow-y: auto;
        overflow-x: hidden;
        gap: 10px;
        padding-bottom: 10px;
        box-shadow: 10px 9px 22px 1px rgba(0, 0, 0, 0.2);
    }

    .notify-center {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .third-text {
        font-weight: 500;
        font-size: 20px;
    }

    .notification-content {
        width: 100%;
    }

    .notification-date {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 5px;
        text-align: left;
        width: fit-content;
    }

    .modal-buttons button {
        width: 25px;
        height: 25px;
        border-radius: 100%;
        background-color: var(--alt-gray-background-color);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-buttons button:hover {
        background-color: var(--select-button-color);
    }

    .modal-buttons {
        gap: 10px;
    }

    .notification {
        margin: 0px 20px;
        padding: 10px;
        gap: 10px;
        background-color: var(--alt-gray-background-color);
        border-radius: 15px;
        z-index: 0;
    }

    .notifications-modal-titlebar {
        padding: 15px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        background-color: var(--alt-background-color);
        z-index: 1;
    }

    .notifications-title {
        font-size: 20px;
        font-weight: bold;
        color: var(--main-text-color);
    }

    .notification-text {
        font-size: 14px;
        color: var(--main-text-color);
        line-height: 20px;
        margin-top: 5px;
        text-align: left;
    }

    .notification-icon {
        width: 50px;
        height: 50px;
        border-radius: 100%;
        object-fit: cover;
    }
</style>
