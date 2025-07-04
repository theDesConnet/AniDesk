<script>
    import Icon from "../elements/Icon.svelte";
    import DownBtnIcon from "../../icons/downBtn.svg";
    import { createEventDispatcher } from "svelte";

    export let onClickCallback;
    export let release;
    export let btnType;
    export let bookmarkType = 0;
    export let text;
    export let favorite = false;

    const dispatch = createEventDispatcher();

    let bookmarkTypes = [
        { type: 0, color: "--main-text-color", text: "Не смотрю" },
        {
            type: 1,
            color: "--watching-color",
            shadowColor: "--watching-shadow-color",
            text: "Смотрю",
        },
        {
            type: 2,
            color: "--plan-color",
            shadowColor: "--plan-shadow-color",
            text: "В планах",
        },
        {
            type: 3,
            color: "--completed-color",
            shadowColor: "--completed-shadow-color",
            text: "Просмотрено",
        },
        {
            type: 4,
            color: "--hold-on-color",
            shadowColor: "--hold-on-shadow-color",
            text: "Отложено",
        },
        {
            type: 5,
            color: "--dropped-color",
            shadowColor: "--dropped-shadow-color",
            text: "Брошено",
        },
    ];

    let bStyle = bookmarkTypes[bookmarkType];
</script>

<div style="position: relative">
    <button
        class="release-left-button flex-row {btnType} {favorite
            ? 'is-favorite'
            : ''}"
        style="--btn-color: var({bStyle.color}); --shadow-color: var({bStyle.shadowColor});"
        onclick={btnType !== "bookmark"
            ? onClickCallback
            : () => {
                  document
                      .querySelector(".dropdown-bookmark")
                      .classList.toggle("hide");
              }}
    >
        <slot></slot>
        {#if btnType == "bookmark"}
            <Icon
                src={DownBtnIcon}
                varColor={bStyle.color}
                size={{ width: 17, height: 9 }}
            />
            {bStyle.text}
        {:else}
            {text}
        {/if}
    </button>

    {#if btnType == "bookmark"}
        <div class="dropdown-bookmark hide flex-column">
            {#each bookmarkTypes as b}
                <button
                    class="dropdown-bookmark-element flex-row"
                    onclick={async () => {
                        if (anixApi.client.token) {
                            await anixApi.release.addToProfileList(
                                release.id,
                                b.type,
                            );
                            document
                                .querySelector(".dropdown-bookmark")
                                .classList.toggle("hide");
                            bookmarkType = b.type;
                            bStyle = b;
                        } else {
                            dispatch("showAuthModal");
                        }
                    }}
                >
                    {b.text}
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .dropdown-bookmark {
        position: absolute;
        background-color: var(--alt-background-color);
        padding: 10px 20px;
        margin-top: 10px;
        z-index: 1;
        width: 350px;
        border-radius: 20px;
        margin-bottom: 20px;
    }

    .dropdown-bookmark-element {
        padding: 5px 0px;
        justify-content: center;
        transition: all 0.2s ease-in-out;
        border-radius: 20px;
    }

    .dropdown-bookmark-element:hover {
        background-color: var(--background-color);
    }

    .release-left-button {
        width: 387px;
        height: 48px;
        align-items: center;
        justify-content: center;
        border-radius: 50px;
        min-height: 48px;
        font-size: 16px;
        color: var(--main-text-color);
    }

    .soon {
        background: linear-gradient(
            160deg,
            rgb(196, 38, 130) 0%,
            rgb(115, 15, 229) 100%
        );
        inset: 0;
        border-radius: 30px;
        margin-top: 15px;
    }

    .blocked {
        margin-top: 15px;
        background-color: var(--main-text-color);
        color: var(--background-color);
        font-weight: bold;
        transition: all 0.2s;
        opacity: 0.7;
        cursor: default;
    }

    :global(.release-left-button img) {
        border-radius: 0px !important;
    }

    .play {
        margin-top: 15px;
        background-color: var(--main-text-color);
        color: var(--background-color);
        font-weight: bold;
        transition: all 0.2s;
    }

    :global(.play svg) {
        margin-right: 8px;
    }

    .play:hover {
        cursor: pointer;
        background-color: #c2c2c2;
    }

    .bookmark {
        margin-top: 10px;
        box-shadow: inset 0 0 0 2px var(--btn-color);
        background-color: transparent;
        color: var(--btn-color);
        font-weight: 500;
        transition: all 0.2s ease-in-out;
    }

    :global(.bookmark svg) {
        margin-right: 8px;
    }

    .favorite {
        margin-top: 10px;
        box-shadow: inset 0 0 0 2px var(--fav-color, var(--main-text-color));
        background-color: transparent;
        color: var(--fav-color, var(--main-text-color));
        transition: all 0.2s ease-in-out;
        font-weight: bold;
    }

    .is-favorite {
        --fav-color: var(--hold-on-color);
    }

    :global(.favorite svg) {
        margin-right: 8px;
    }
</style>
