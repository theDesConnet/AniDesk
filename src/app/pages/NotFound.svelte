<script>
    import { Lottie } from 'lottie-svelte'
</script>

<div class="container">
    <div class="notfound flex-column">
        <div class="lottie-container">
            <Lottie path="./assets/lottie/notfound.json" autoplay="true" renderer="svg"></Lottie>
        </div>
        <div class="text-notfound flex-column">
            <span class="title">Страница не найдена</span>
            <span class="bottom">Возможно она была удалена и больше не доступна</span>
        </div>
    </div>
</div>

<style>
    .lottie-container {
        height: 450px !important;
        width: 450px !important;
        display: flex
    }

    .title {
        font-size: 32px;
        font-weight: 500;
    }

    .text-notfound {
        position: absolute;
        bottom: 70px;
        display: flex;
        align-items: center;

    }

    .container {
        width: 100%;
        height: 100%;
        align-items: center;
        display: flex;
        justify-content: center;
    }

    .notfound {
        justify-content: center;
        align-items: center;
        position: relative;
    }
</style>