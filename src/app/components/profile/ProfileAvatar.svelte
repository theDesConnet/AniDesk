<script>
    export let src, alt;
    export let size = {
        width: 100,
        height: 100
    };
    export let skeletonZIndex = 0;
    export let isOnline = false;
    export let outlineWidth = 4;

    let isLoaded = false;
</script>

<div class="profile-avatar" class:avatar-online={isOnline} style="--outline-width: {outlineWidth}px; --width: {size.width}px; --height: {size.height}px; --z-index: {skeletonZIndex}">
    <div class="avatar-skeleton" class:hide={isLoaded}></div>
    <img src="{src}" alt="{alt ?? "Avatar"}" onload={() => (isLoaded = true)} width="{size.width}px" height="{size.height}px" />
</div>

<style>
    .profile-avatar img {
        border-radius: 100%;
        object-fit: cover;
    }

    .avatar-online {
        outline: var(--outline-width) solid var(--good-reputation-color);
        border-radius: 100%;
    }

    .profile-avatar {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(var(--width) + 2px);
        height: calc(var(--height) + 1px);
        max-width: var(--width);
        max-height: var(--height);
    }

    .avatar-skeleton {
        width: calc(var(--width) + 2px);
        height: calc(var(--height) + 2px);
        position: absolute;
        border-radius: 100%;
        background-color: var(--skeleton-background-color);
        animation: skeletonAnimation 3s ease-in-out 100ms infinite forwards;
    }
</style>