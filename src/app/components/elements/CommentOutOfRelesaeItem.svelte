<script>
    export let comment;
    export let release;
    import { Lottie } from "lottie-svelte";
</script>

<div
    class="comment flex-column"
    onclick={() =>
        updateViewportComponent(8, {
            id: release != null ? release?.id : comment.release.id,
        })}
>
    <div class="comment-author flex-row" onclick={(e) => e.stopPropagation()}>
        <div
            class="comment-author-image"
            onclick={() => updateViewportComponent(9, comment.profile.id)}
        >
            <img
                height="40"
                width="40"
                src={comment.profile.avatar}
                alt={comment.profile.login}
            />
        </div>
        <div class="comment-author-info flex-row">
            <div class="flex-column">
                <div class="comment-author-name flex-row">
                    <div
                        class="comment-author-username flex-row"
                        onclick={() =>
                            updateViewportComponent(9, comment.profile.id)}
                    >
                        {comment.profile.login}
                        {#if comment.profile.badge_url}
                            {#if comment.profile.badge_url.endsWith(".json")}
                                <Lottie
                                    src={comment.profile.badge_url}
                                    height="20"
                                    width="20"
                                />
                            {:else}
                                <img
                                    height="20"
                                    width="20"
                                    src={comment.profile.badge_url}
                                    alt={comment.profile.badge_name}
                                />
                            {/if}
                        {/if}
                        {#if comment.profile.is_verified}
                            <div class="verified">
                                <img
                                    height="20"
                                    width="20"
                                    src="./assets/icons/verified.svg"
                                    alt="verified"
                                />
                            </div>
                        {/if}
                    </div>
                    <span
                        class="rel"
                        class:rel-text={!comment.profile?.badge_url}
                        >к релизу</span
                    >
                </div>
                <div class="title-name">
                    <span
                        >{release != null
                            ? release?.title_ru
                            : comment.release.title_ru}</span
                    >
                </div>
            </div>
        </div>
    </div>
    <div class="comment-message flex-column">
        {comment.message}
        <div class="footer-comment flex-row">
            <div class="comment-author-date flex-row">
                {utils.returnTimeString(comment.timestamp * 1000)}
            </div>
            <div
                class="vote-count"
                class:like-positive={comment.likes_count > 0}
                class:like-negative={comment.likes_count < 0}
            >
                {comment.likes_count}
            </div>
        </div>
    </div>
</div>

<style>
    .verified {
        display: flex;
        align-content: center;
        margin-right: 5px;
    }

    .footer-comment {
        margin-top: 8px;
    }

    .comment-author-image img {
        object-fit: cover;
    }

    .comment-author-name {
        align-items: center;
    }

    .rel {
        color: var(--secondary-text-color);
        font-size: 12px;
    }

    .title-name {
        color: var(--secondary-text-color);
        font-size: 12px;
        margin-bottom: 5px;
    }

    .vote-count {
        margin-left: auto;
        padding: 2px 5px;
        border-style: solid;
        border-width: 1px;
        border-radius: 5px;
        font-size: 12px;
    }

    .rel-text {
        margin-left: 5px;
    }

    .comment {
        margin-top: 10px;
        margin-bottom: 10px;
        background-color: var(--alt-background-color);
        border-radius: 10px;
        padding: 10px 20px;
    }

    .comment-author-info {
        align-items: center;
    }

    .comment-author {
        object-fit: cover;
        width: fit-content;
    }

    .comment-author-image img {
        margin-right: 10px;
        border-radius: 100%;
        cursor: pointer;
    }

    .comment-message {
        font-size: 14px;
        color: var(--main-text-color);
        font-weight: 400;
        width: 100%;
    }

    .comment-like-count {
        width: 35px;
        min-width: 35px;
        margin-right: 15px;
        align-items: center;
    }

    .like-positive {
        color: var(--good-reputation-color);
        border-color: var(--good-reputation-color);
    }

    .like-negative {
        color: var(--bad-reputation-color);
        border-color: var(--bad-reputation-color);
    }

    .comment-author-username {
        align-items: center;
        font-size: 16px;
        font-weight: bold;
        color: var(--main-text-color);
        cursor: pointer;
    }

    .comment-author-username img {
        margin-left: 5px;
    }

    .comment-author-date {
        align-items: center;
        font-size: 12px;
        color: var(--secondary-text-color);
    }
</style>
