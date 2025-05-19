<script>
    import { Lottie } from 'lottie-svelte'
</script>

<div class="container">
    <div class="notavaliable flex-column">
        <div class="lottie-container">
            <Lottie path="./assets/lottie/notavaliable.json" autoplay="true" renderer="svg"></Lottie>
        </div>
        <div class="text-notavaliable flex-column">
            <span class="title">Данный фунцкионал сейчас находится в разработке</span>
            <span class="bottom">Приносим свои извинения, со временем он будет доступен</span>
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
        text-align: center;
    }

    .text-notavaliable {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .container {
        width: 100%;
        height: 100%;
        align-items: center;
        display: flex;
        justify-content: center;
    }

    .notavaliable {
        justify-content: center;
        align-items: center;
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>