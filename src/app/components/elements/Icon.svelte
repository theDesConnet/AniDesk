<script>
    export let src = "";
    export let color;
    export let varColor;
    export let size = {
        width: 20,
        heigth: 20,
    };

    export let viewBox = extractViewBox(src);

    $: elements = src.replace(/<svg[ \n]([^>]*)>/, "").replace("</svg>", "");

    function extractViewBox(svg) {
        const regex = /viewBox="([\d\- \.]+)"/;
        const res = regex.exec(svg);
        if (!res) return "0 0 20 20";
        return res[1];
    }
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    width={size.width}
    heigth={size.heigth}
    {viewBox}
    style="--color: {varColor ? `var(${varColor})` : `${color}`}"
>
    {@html elements}
</svg>

<style>
    svg {
        color: var(--color);
        transition: all 0.2s ease-in-out;
    }
</style>
