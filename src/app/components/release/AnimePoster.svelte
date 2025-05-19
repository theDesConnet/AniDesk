<script>
    export let size;
    export let posterInfo;
    export let shadow = false;
    export let borderRadius = 20;
    export let posterStyle = 0;
    export let zIndex = 0;

    let isLoading = true;

    let posterStyles = [
        { color: "", text: "", borderEnabled: false },
        {
            color: "--watching-color",
            shadowColor: "--watching-shadow-color",
            text: "Смотрю",
            borderEnabled: true,
        },
        {
            color: "--plan-color",
            shadowColor: "--plan-shadow-color",
            text: "В планах",
            borderEnabled: true,
        },
        {
            color: "--completed-color",
            shadowColor: "--completed-shadow-color",
            text: "Просмотрено",
            borderEnabled: true,
        },
        {
            color: "--hold-on-color",
            shadowColor: "--hold-on-shadow-color",
            text: "Отложено",
            borderEnabled: true,
        },
        {
            color: "--dropped-color",
            shadowColor: "--dropped-shadow-color",
            text: "Брошено",
            borderEnabled: true,
        },
    ];

    let style = posterStyles[posterStyle];
</script>

<div
    class="anime-poster"
    style="
--width: {size.width}px; 
--height: {size.height}px; 
--border-radius: {borderRadius}px; 
--shadow-color: var({style.shadowColor}); 
--color: var({style.color}, transparent); 
--border-enabled: {style.borderEnabled ? 'solid' : 'none'}; 
--z-index: {(style.borderEnabled ? -1 : 0) + zIndex}"
>
    <div
        class="anime-poster-text"
        style:display={style.borderEnabled ? "flex" : "none"}
    >
        {style.text}
    </div>
    <div class="anime-poster-skeleton" class:hide={!isLoading}></div>
    <img
        class:anime-poster-shadow={shadow}
        width={size.width}
        height={size.height}
        src={posterInfo.poster}
        alt={posterInfo.title}
        onload={() => (isLoading = false)}
        style:opacity={isLoading ? 0 : 1}
    />
</div>

<style>
    .anime-poster img {
        border-radius: var(--border-radius);
        outline-color: var(--color);
        outline-style: var(--border-enabled);
        outline-width: 3px;
        object-fit: cover;
    }

    .anime-poster-skeleton {
        outline-color: var(--color);
        outline-style: var(--border-enabled);
        outline-width: 3px;
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius);
        background-color: var(--skeleton-background-color);
        position: absolute;
        z-index: calc(var(--z-index) - 1);
        animation: skeletonAnimation 3s ease-in-out 100ms infinite forwards;
    }

    .anime-poster {
        position: relative;
        min-width: var(--width);
        min-height: var(--height);
    }

    .anime-poster-text {
        position: absolute;
        bottom: 0;
        z-index: calc(var(--z-index) + 1);
        justify-content: center;
        align-items: center;
        background-color: var(--color);
        width: 100%;
        height: 25px;
        margin-bottom: 6px;
        border-radius: 60px;
        color: var(--main-text-color);
    }

    .anime-poster-shadow {
        -webkit-box-shadow: 4px 4px 8px 0px
            var(--shadow-color, rgba(34, 60, 80, 0.2));
        -moz-box-shadow: 4px 4px 8px 0px
            var(--shadow-color, rgba(34, 60, 80, 0.2));
        box-shadow: 4px 4px 8px 0px var(--shadow-color, rgba(34, 60, 80, 0.2));
    }
</style>
