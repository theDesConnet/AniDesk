<script>
    import LeftReleaseBaseButton from "../components/buttons/LeftReleaseBaseButton.svelte";
    import Preloader from "../components/gui/Preloader.svelte";
    import RatingGraph from "../components/release/RatingGraph.svelte";
    import BookmarkTypes from "../components/elements/BookmarkTypes.svelte";
    import CommentItem from "../components/elements/CommentItem.svelte";
    import AgeRate from "../components/release/AgeRate.svelte";
    import Slider from "../components/elements/Slider.svelte";
    import RelatedReleases from "../components/release/RelatedReleases.svelte";
    import AnimePoster from "../components/release/AnimePoster.svelte";
    import MinInfo from "../components/release/MinInfo.svelte";
    import BaseModal from "../components/modal/BaseModal.svelte";
    import SelectEpisodes from "../components/release/SelectEpisode.svelte";
    import ViewAllButton from "../components/buttons/ViewAllButton.svelte";
    import CommentsModal from "../components/release/CommentsModal.svelte";
    import RelatedReleasesModal from "../components/release/RelatedReleasesModal.svelte";
    import MetaInfo from "../components/gui/MetaInfo.svelte";
    import NotFound from "./NotFound.svelte";
    import Icon from "../components/elements/Icon.svelte";
    import FavoriteIcon from "../icons/favorite.svg";
    import PlayIcon from "../icons/play.svg";
    import BookmarkStatsInfo from "../components/profile/BookmarkStatsInfo.svelte";
    import AuthPlaceholder from "./AuthPlaceholder.svelte";
    import NotAvaliable from "./NotAvaliable.svelte";
    import { onDestroy } from "svelte";

    export let args;
    const release = anixApi.release.info(args.id, true);

    release.then((data) => {
        discordRPC.setActivity({
            type: 3,
            state: "На странице релиза",
            details: data.release.title_ru.slice(0, 127),
            largeImageKey: "anidesk-transparent",
            largeImageText: "AniDesk - Anixart Client",
            instance: true,
            buttons: [
                {
                    label: "Ссылка на релиз",
                    url: `https://anixart.app/release/${data.release.id}`,
                },
                { label: "Ссылка на клиент", url: "https://anidesk.ds1nc.ru/" },
            ],
        });
    });

    let showSelectEpisodeModal,
        showCommentsModal,
        showRelatedReleasesModal = false,
        showAuthModal = false,
        showNotAvaliableModal = false;
    let modalSubTitle = null;

    let isFavorite = false;
    let favoriteCount = 0;

    async function setFavorite(i) {
        isFavorite
            ? anixApi.release.removeFavorite(args.id)
            : anixApi.release.addFavorite(args.id);

        changeFavorite(i);
        setFavoriteCount(i ? favoriteCount + 1 : favoriteCount - 1);
    }

    function setFavoriteCount(i) {
        favoriteCount = i;
    }

    function changeFavorite(i) {
        isFavorite = i;
    }

    function returnSoonText(release) {
        if (release.aired_on_date != 0) {
            const d = new Date(release.aired_on_date * 1000);
            return `${d.getDate()} ${d.toLocaleDateString("ru-RU", { month: "short" })}. ${d.getFullYear()} год.`;
        }

        if (release.year)
            return `${utils.seasons[release.season] !== null ? `${utils.seasons[release.season]}, ` : ""}${release.year} г.`;

        return "Скоро";
    }
</script>

{#await release}
    <Preloader />
{:then r}
    {#if r.release == null || r.code == 2}
        <NotFound />
    {:else}
        {setFavoriteCount(r.release.favorites_count)}
        {changeFavorite(r.release.is_favorite)}
        {#key modalSubTitle}
            <MetaInfo
                subTitle={modalSubTitle === null
                    ? r.release.title_ru
                    : `${modalSubTitle} | ${r.release.title_ru}`}
            />
        {/key}
        <div class="release flex-row" tabindex="-1">
            <div
                tabindex="-1"
                class="left-info-release hide-scroll flex-column"
                onmouseenter={() => {
                    document
                        .querySelector(".left-info-release")
                        .classList.remove("hide-scroll");
                }}
                onmouseleave={() => {
                    document
                        .querySelector(".left-info-release")
                        .classList.add("hide-scroll");
                }}
            >
                <AnimePoster
                    size={{ width: 387, height: 567 }}
                    posterInfo={{
                        poster: r.release.image,
                        title: r.release.title_ru,
                    }}
                    shadow={true}
                    borderRadius={20}
                />
                {#if r.release.is_view_blocked}
                    <LeftReleaseBaseButton
                        text="Недоступно"
                        onClickCallback={null}
                        btnType="blocked"
                    />
                {:else if !r.release.episodes_released}
                    <LeftReleaseBaseButton
                        text={returnSoonText(r.release)}
                        onClickCallback={null}
                        btnType="soon"
                    />
                {:else}
                    <LeftReleaseBaseButton
                        text="Воспроизвести"
                        onClickCallback={() => (showSelectEpisodeModal = true)}
                        btnType="play"
                    >
                        <Icon
                            src={PlayIcon}
                            size={{ width: 28, height: 28 }}
                            varColor="--background-color"
                        />
                    </LeftReleaseBaseButton>
                {/if}
                <LeftReleaseBaseButton
                    bookmarkType={r.release.profile_list_status ?? 0}
                    btnType="bookmark"
                    release={r.release}
                    on:showAuthModal={() => (showAuthModal = true)}
                ></LeftReleaseBaseButton>
                <LeftReleaseBaseButton
                    text={favoriteCount}
                    onClickCallback={() => {
                        if (anixApi.client.token) {
                            isFavorite ? setFavorite(false) : setFavorite(true);
                        } else {
                            showAuthModal = true;
                        }
                    }}
                    btnType="favorite"
                    favorite={isFavorite}
                >
                    <Icon
                        src={FavoriteIcon}
                        varColor={isFavorite
                            ? "--hold-on-color"
                            : "--main-text-color"}
                        size={{ width: 22, height: 28 }}
                    />
                </LeftReleaseBaseButton>

                {#if r.release.status?.id !== 3}
                    <div class="rating-container flex-row">
                        <div class="rate-text">
                            <span class="rating-text">Рейтинг</span>
                            <span class="rate"
                                >{r.release.grade.toFixed(2)}</span
                            >
                            <div class="rate-vote-text">
                                <span class="rating-votes"
                                    >{r.release.vote_count}</span
                                > голосов
                            </div>
                        </div>
                        <RatingGraph release={r.release} />
                    </div>
                {/if}
                <div class="bookmarks-bar-container">
                    <BookmarkTypes
                        types={{
                            watching: r.release.watching_count,
                            plan: r.release.plan_count,
                            completed: r.release.completed_count,
                            hold_on: r.release.hold_on_count,
                            dropped: r.release.dropped_count,
                        }}
                    />
                </div>
                <BookmarkStatsInfo item={r.release}  size={13} type="grid"/>
            </div>
            <div tabindex="-1" class="right-info-release flex-column">
                <div class="release-title">{r.release.title_ru}</div>
                <div class="release-alt-title">
                    {r.release.title_original}
                    <AgeRate ageRate={r.release.age_rating} />
                </div>
                {#if r.release.note}
                    <div class="release-note flex-column">
                        {@html r.release.note}
                    </div>
                {/if}
                <div class="release-description">{r.release.description}</div>
                <div class="flex-row">
                    {#if r.release.screenshot_images.length > 0}
                        <div class="release-images">
                            Кадры
                            <Slider
                                images={r.release.screenshot_images}
                                params={{
                                    id: "release-images-slider",
                                    widthSlider: 880,
                                    heightSlider: 250,
                                    minHeightSlider: 250,
                                    minWidthSlider: 440,
                                    heightImg: 242,
                                    scrollParam: 440,
                                }}
                            />
                        </div>
                    {:else if r.release.related_releases.length > 0}
                        <RelatedReleases
                            release={r.release}
                            on:viewAllCalled={() =>
                                (showRelatedReleasesModal = true)}
                        />
                    {/if}
                    <MinInfo release={r.release} />
                </div>
                {#if r.release.screenshot_images.length > 0 && r.release.related_releases.length > 0}
                    <RelatedReleases
                        release={r.release}
                        on:viewAllCalled={() =>
                            (showRelatedReleasesModal = true)}
                    />
                {/if}
                <div class="release-comments flex-column">
                    <div class="comments-title flex-row">
                        <div class="flex-column">
                            <span>Комментарии</span>
                            <span class="minText">Популярные и актуальные</span>
                        </div>
                    </div>
                    {#each r.release.comments as comment}
                        <CommentItem
                            {comment}
                            on:showAuthModal={() => (showAuthModal = true)}
                            on:notAvaliable={() =>
                                (showNotAvaliableModal = true)}
                        />
                    {/each}
                    <ViewAllButton
                        marginLeft={"0"}
                        width={"100%"}
                        onClickCallback={() => (showCommentsModal = true)}
                    />
                </div>
            </div>
        </div>
        <BaseModal
            modalComponent={SelectEpisodes}
            showed={showSelectEpisodeModal}
            modalSize={{ width: "1000px", height: "580px" }}
            modalArgs={r.release}
            bind:modalTitle={modalSubTitle}
            on:closeModal={() => (showSelectEpisodeModal = false)}
        />
        <BaseModal
            modalComponent={CommentsModal}
            modalSize={{ width: "75%", height: "80%" }}
            showed={showCommentsModal}
            modalArgs={r.release}
            bind:modalTitle={modalSubTitle}
            on:closeModal={() => (showCommentsModal = false)}
        />
        <BaseModal
            modalComponent={RelatedReleasesModal}
            modalArgs={r.release.related}
            showed={showRelatedReleasesModal}
            bind:modalTitle={modalSubTitle}
            on:closeModal={() => (showRelatedReleasesModal = false)}
        />

        <BaseModal
            modalComponent={AuthPlaceholder}
            showed={showAuthModal}
            bind:modalTitle={modalSubTitle}
            modalSize={{ width: "70%", height: "90%" }}
            on:closeModal={() => (showAuthModal = false)}
        />

        <BaseModal
            modalComponent={NotAvaliable}
            showed={showNotAvaliableModal}
            bind:modalTitle={modalSubTitle}
            modalSize={{ width: "60%", height: "70%" }}
            on:closeModal={() => (showNotAvaliableModal = false)}
        />
    {/if}
{/await}

<style>
    :global(.release-minInfo) {
        margin-top: 40px;
        margin-left: auto;
        margin-right: 5px;
    }

    .right-info-release {
        overflow-y: auto;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-right: 20px;
        width: 100%;
    }

    :global(.related-releases) {
        min-width: 530px;
    }

    .bookmarks-bar-container {
        margin-top: 10px;
        margin-right: 6px;
        min-width: 385px;
    }

    .rating-container {
        margin-top: 20px;
        min-width: 390px;
    }

    .rate-text {
        display: flex;
        flex-direction: column;
        margin-left: 4px;
        min-width: 88px;
    }

    :global(.slider) {
        margin-top: 4px;
    }

    .rating-text {
        font-size: 15px;
        color: var(--main-text-color);
        font-weight: 300;
    }

    .rate {
        font-size: 32px;
        color: var(--main-text-color);
        font-weight: bold;
        letter-spacing: 0.5px;
        line-height: 32px;
        margin-top: 5px;
        margin-bottom: 3px;
    }

    .rate-vote-text {
        font-size: 12px;
        color: var(--secondary-text-color);
    }

    .rating-votes {
        font-weight: bold;
    }

    .release-comments {
        margin-top: 10px;
        font-size: 20px;
        font-weight: bold;
        color: var(--main-text-color);
    }

    .minText {
        font-size: 14px;
        font-weight: normal;
        color: var(--secondary-text-color);
    }

    .release-images {
        font-size: 20px;
        font-weight: bold;
        color: var(--main-text-color);
        margin-bottom: 5px;
        margin-right: 50px;
    }

    .release {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .release-note {
        display: flex;
        font-size: 12px;
        color: var(--main-text-color);
        background-color: var(--alt-background-color);
        width: calc(100% - 30px);
        padding: 10px;
        padding-left: 20px;
        border-radius: 10px;
        margin-top: 5px;
        margin-bottom: 10px;
        line-height: 22px;
    }

    .left-info-release img {
        border-radius: 15px;
        object-fit: cover;
    }

    .left-info-release {
        max-width: 388px;
        overflow-y: auto;
        overflow-x: hidden;
        padding-left: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        display: flex;
        width: fit-content;
        /* flex-wrap: nowrap; */
        min-width: 390px;
        padding-right: 15px;
    }

    .left-info-release::-webkit-scrollbar {
        width: 6px;
        height: 17px;
    }

    .right-info-release {
        margin-left: 20px;
    }

    .release-title {
        margin-top: 10px;
        font-size: 30px;
        font-weight: bold;
        color: var(--main-text-color);
        margin-bottom: 5px;
    }

    .release-alt-title {
        font-size: 16px;
        font-weight: bold;
        color: var(--secondary-text-color);
        margin-bottom: 5px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .release-description {
        font-size: 14px;
        color: var(--main-text-color);
        line-height: 24px;
        margin-bottom: 15px;
    }
</style>
