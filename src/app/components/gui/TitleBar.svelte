<script>
    import { pageHistory } from "../stores/pageHistory.js";

    $: history = $pageHistory;

    function backToHistory() {
        if (history.length > 0) {
            let prev;
            pageHistory.update((h) => {
                prev = h.shift();
                return h;
            });

            window.updateViewportComponent(prev.page, prev.args, true);
        }
    }
</script>

<div class="title-bar unselectable">
    <div
        class="title-bar-back button-title-bar"
        style:opacity={history.length > 0 ? 1 : 0}
        onclick={() => {
            backToHistory();
        }}
    >
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12.614 12.4276C11.6744 13.3953 10.2993 14 8.55549 14H3.11098C2.9047 14 2.70687 13.9181 2.561 13.7724C2.41514 13.6266 2.33319 13.4289 2.33319 13.2228C2.33319 13.0166 2.41514 12.8189 2.561 12.6732C2.70687 12.5274 2.9047 12.4455 3.11098 12.4455H8.55549C9.92284 12.4455 10.8811 11.9815 11.4971 11.3457C12.1224 10.7006 12.4444 9.83162 12.4444 8.94789C12.4444 8.06416 12.1224 7.19442 11.4971 6.55009C10.8811 5.9143 9.92284 5.45028 8.55549 5.45028H2.6552L5.21645 8.00976C5.29074 8.08145 5.34999 8.16722 5.39075 8.26205C5.43152 8.35687 5.45297 8.45886 5.45387 8.56207C5.45477 8.66527 5.43509 8.76762 5.39598 8.86314C5.35687 8.95866 5.29912 9.04544 5.22609 9.11842C5.15306 9.19139 5.06622 9.24911 4.97063 9.28819C4.87505 9.32727 4.77263 9.34694 4.66936 9.34604C4.56608 9.34514 4.46402 9.3237 4.36913 9.28297C4.27423 9.24223 4.18841 9.18302 4.11666 9.10878L0.227726 5.22255C0.0819131 5.07679 0 4.87913 0 4.67303C0 4.46694 0.0819131 4.26928 0.227726 4.12352L4.11666 0.237285C4.18841 0.16305 4.27423 0.103837 4.36913 0.0631023C4.46402 0.0223675 4.56608 0.000926147 4.66936 2.93466e-05C4.77263 -0.000867454 4.87505 0.0187981 4.97063 0.0578787C5.06622 0.0969594 5.15306 0.154672 5.22609 0.22765C5.29912 0.300628 5.35687 0.387409 5.39598 0.48293C5.43509 0.578451 5.45477 0.680799 5.45387 0.784001C5.45297 0.887203 5.43152 0.989194 5.39075 1.08402C5.34999 1.17885 5.29074 1.26461 5.21645 1.33631L2.6552 3.89579H8.55549C10.2993 3.89579 11.6744 4.50048 12.614 5.46816C13.5442 6.4265 14 7.69419 14 8.94789C14 10.2016 13.5442 11.4693 12.614 12.4276Z"
                fill="currentColor"
            />
        </svg>
    </div>
    <div class="title-bar-text unselectable">AniDesk <sup>β</sup></div>
    <button
        class="title-bar-minimize button-title-bar"
        onclick={titleBarAPI.minimize()}
        ><svg
            aria-hidden="true"
            role="img"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            ><rect fill="currentColor" width="10" height="1" x="1" y="6"
            ></rect></svg
        ></button
    >
    <button
        class="title-bar-maximize button-title-bar"
        onclick={titleBarAPI.maximize()}
        ><svg
            aria-hidden="true"
            role="img"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            ><rect
                width="9"
                height="9"
                x="1.5"
                y="1.5"
                fill="none"
                stroke="currentColor"
            ></rect></svg
        ></button
    >
    <button
        class="title-bar-close button-title-bar"
        onclick={titleBarAPI.close()}
        ><svg
            aria-hidden="true"
            role="img"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            ><polygon
                fill="currentColor"
                fill-rule="evenodd"
                points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"
            ></polygon></svg
        ></button
    >
</div>

<style>
    .title-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        z-index: 9999;
        justify-content: space-between;
        background-color: var(--title-bar-bg-color);
        color: var(--main-text-color);
        font-size: 12px;
        text-align: center;
        -webkit-app-region: drag;
        height: 28px;
        align-items: center;
        vertical-align: middle;
    }

    .title-bar-back {
        width: 55px;
        align-items: center;
        transition: background-color 0.2s ease;
    }

    .title-bar-back:hover {
        background-color: var(--btn-back-titlebar-hover) !important;
    }

    .title-bar-back svg {
        margin-left: auto;
        margin-right: auto;
        transition: transform 0.2s ease-out;
    }

    .title-bar-back:hover svg {
        transform: translateX(-2px);
    }

    .title-bar-text {
        margin-top: 5px;
        margin-bottom: 5px;
        margin-right: auto;
        margin-left: auto;
        -webkit-app-region: drag;
    }

    .button-title-bar:hover {
        background-color: var(--btn-titlebar-hover);
    }

    .button-title-bar {
        -webkit-app-region: no-drag;
        height: 100%;
        padding-left: 10px;
        padding-right: 10px;
        display: flex;
        align-items: center;
        color: var(--main-text-color);
        cursor: pointer;
    }
</style>
