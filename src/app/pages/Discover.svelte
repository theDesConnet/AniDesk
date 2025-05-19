<script>
    import Preloader from "../components/gui/Preloader.svelte";
    import AnimePoster from "../components/release/AnimePoster.svelte";
    import AnimeFullRowCard from "../components/elements/AnimeFullRowCard.svelte";
    import AnimeColumnCard from "../components/elements/AnimeColumnCard.svelte";
    import ViewAllButton from "../components/buttons/ViewAllButton.svelte";
    import CommentOutOfRelesaeItem from "../components/elements/CommentOutOfRelesaeItem.svelte";
    import BaseModal from "../components/modal/BaseModal.svelte";
    import WatchingModal from "../components/discover/WatchingModal.svelte";

    async function getDiscover() {
        return {
            interesting: await anixApi.discover.getInteresting(),
            discussing: await anixApi.discover.getDiscussing(),
            comments: await anixApi.discover.getComments(),
            watching: await anixApi.discover.getWatching(0),
            recomendations: await anixApi.discover.getRecommendations(0),
            collections: await anixApi.collection.all(0, null, {
                queryParams: { previous_page: -1, where: 2, sort: 4 },
            }),
        };
    }

    function scrollToIndex(index) {
        const container = document.querySelector(".interesting");
        const items = document.querySelectorAll(".interesting-item");

        const containerCenter = container.offsetWidth / 2;
        const item = items[index];
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;

        container.scrollTo({
            left: itemCenter - containerCenter,
            behavior: "smooth",
        });
    }

    let windowWidth, windowHeight, height, width, modalSubTitle;
    let viewLastCard = false,
        watchingModalShowed = false;

    let activeIndex = 0;

    $: viewLastCard = !(windowWidth < 1700);

    function sliderPrevClick() {
        if (activeIndex > 0) {
            activeIndex--;
            scrollToIndex(activeIndex);
        }
    }

    function sliderNextClick() {
        const items = document.querySelectorAll(".interesting-item");

        if (activeIndex < items.length - 1) {
            activeIndex++;
            scrollToIndex(activeIndex);
        }
    }

    function interestingItemClick(r) {
        updateViewportComponent(7, { id: Number(r.action) });
    }
</script>

<svelte:window bind:outerWidth={windowWidth} bind:outerHeight={windowHeight} />

{#await getDiscover()}
    <Preloader />
{:then d}
    <div class="interesting-slider-wrapper">
        <button class="nav prev" onclick={sliderPrevClick}>‹</button>
        <div class="interesting flex-row">
            <div class="spacer"></div>
            {#each d.interesting.content as r}
            <button class="interesting-item" onclick={interestingItemClick(r)}>
                <div class="flex-column">
                    <AnimePoster
                        size={{ height: 420 }}
                        posterInfo={{ poster: r.image, title: r.title }}
                        shadow={true}
                        borderRadius={20}
                    />
                    <div class="interesting-item-title">{r.title}</div>
                    <div class="interesting-item-description">{r.description}</div>
                </div>
            </button>
            {/each}
            <div class="spacer"></div>
        </div>
        <button class="nav next" onclick={sliderNextClick}>›</button>
    </div>
    <div class="container flex-column">
        <div class="discussing">
            <span class="main-title title-margin">Обсуждаемое сегодня</span>
            {#each d.discussing.content as r}
                <AnimeFullRowCard anime={r}>
                    <div class="comments-info">
                        {r.comment_per_day_count} {utils.getNumericWord(r.comment_per_day_count, ['комментарий', 'комментария', 'комментариев'])}
                    </div>
                </AnimeFullRowCard>
            {/each}
        </div>
        <div class="anime-column-row">
            <div class="current-view flex-row">
                <span class="main-title">Сейчас смотрят</span>
                <ViewAllButton
                    onClickCallback={() => (watchingModalShowed = true)}
                />
            </div>

            <div class="anime-row flex-row">
                {#each d.watching.content.slice(0, viewLastCard ? 6 : 5) as r}
                    <div class="card">
                        <AnimeColumnCard anime={r} />
                    </div>
                {/each}
            </div>
        </div>
        <div class="popular-comments">
            <span class="main-title title-margin">Комментарии недели</span>
            {#each d.comments.content as r}
                <div class="comment-out-of-release">
                    <CommentOutOfRelesaeItem
                        comment={r}
                        release={typeof r.release == "number"
                            ? d.comments.content.find(
                                  (c) => c.release["@id"] == r.release,
                              ).release
                            : null}
                    />
                </div>
            {/each}
        </div>
    </div>

    <BaseModal
        modalComponent={WatchingModal}
        showed={watchingModalShowed}
        modalSize={{ width: "80%", height: "90%" }}
        bind:modalTitle={modalSubTitle}
        on:closeModal={() => (watchingModalShowed = false)}
    />
{/await}

<style>
    .interesting {
        width: 100%;
        margin-top: 20px;
        gap: 20px;
        overflow-x: hidden;
        scroll-behavior: smooth;
        scroll-snap-type: x mandatory;
        position: relative;
    }

    .interesting-slider-wrapper {
        position: relative;
    }

    .spacer {
        flex: 0 0 calc(50% - 130px);
        scroll-snap-align: none;
        pointer-events: none;
    }

    .comment-out-of-release {
        margin: 0px 15px;
    }

    .popular-comments {
        width: 100%;
    }

    .current-view {
        justify-items: center;
        margin-top: 10px;
        margin-left: 20px;
        margin-bottom: 20px;
    }

    .title-margin {
        margin-left: 20px;
    }

    .discussing {
        border-bottom: 3px solid var(--alt-background-color);
    }

    .anime-column-row {
        width: 100%;
        margin-bottom: 20px;
        margin-top: 10px;
        border-bottom: 3px solid var(--alt-background-color);
        height: max-content;
    }

    .card {
        margin-left: 0px;
        margin-right: auto;
    }

    .card:last-child {
        margin-right: 0px;
    }

    .container {
        align-items: center;
        margin-top: 25px;
        margin-bottom: 25px;
        max-width: var(--max-width, 1609px);
        margin-left: auto;
        margin-right: auto;
    }

    .main-title {
        font-size: 28px;
        font-weight: 500;
        color: var(--main-text-color);
    }

    .nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        font-size: 2rem;
        width: 40px;
        height: 40px;
        background-color: var(--alt-background-color);
        border: none;
        cursor: pointer;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 5px;
    }

    .nav.prev {
        left: 60px;
    }
    .nav.next {
        right: 60px;
    }

    .comments-info {
        background-color: var(--alt-background-color);
        color: var(--main-text-color);
        border-radius: 6px;
        padding-left: 8px;
        padding-right: 8px;
        padding-top: 4px;
        padding-bottom: 4px;
        margin-bottom: 5px;
        font-size: 14px;
        display: flex;
        width: fit-content;
    }

    .interesting-item {
        flex: 0 0 auto;
        scroll-snap-align: center;
        justify-content: flex-start;
        display: flex;
    }

    .interesting-item-title {
        font-size: var(--anime-full-row-title-size);
        font-weight: var(--anime-full-row-title-weight);
        color: var(--main-text-color);
        margin-bottom: 5px;
        margin-top: 5px;
    }

    .interesting-item-description {
        font-size: var(--anime-full-row-description-size);
        color: var(--third-text-color);
        line-height: var(--anime-full-row-description-line-height);
        font-weight: var(--anime-full-row-description-weight);
    }

    .interesting-item:first-child {
        margin-left: 20px;
    }

    .interesting-item:last-child {
        margin-right: 20px;
    }
</style>
