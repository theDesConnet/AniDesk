<script>
    import { Lottie } from 'lottie-svelte'
    import BaseMainButton from '../components/buttons/BaseMainButton.svelte';
</script>

<div class="container">
    <div class="auth flex-column">
        <div class="lottie-container">
            <Lottie path="./assets/lottie/auth-anim.json" autoplay="true" renderer="svg"></Lottie>
        </div>
        <div class="text-auth flex-column">
            <span class="title">Данный фунцкионал доступен только авторизованным пользователям</span>
            <span class="bottom">Пожалуйста, авторизуйтесь для использования данного функционала</span>
        </div>
        <BaseMainButton style="primary" width="60%" borderRadius={6} onClickCallback={() => {updateViewportComponent(9)}}>Авторизоваться</BaseMainButton>
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

    .text-auth {
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

    .auth {
        justify-content: center;
        align-items: center;
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>