<script>
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";
    import { DefaultResult, LoginResult } from "anixartjs";
    import MetaInfo from "../components/gui/MetaInfo.svelte";
    import BaseMainButton from "../components/buttons/BaseMainButton.svelte";
    import { fade } from "svelte/transition";
    let u;

    const user = localStorageWritable("user_token", null);
    user.subscribe((value) => (u = value));

    let lastError = null;
    let waitLogin = false;
    let errorTimeout = null;

    function setError(error) {
        lastError = error;

        if (errorTimeout) clearTimeout(errorTimeout);

        errorTimeout = setTimeout(() => {
            lastError = null;
        }, 5000);
    }

    async function login() {
        waitLogin = true;
        lastError = null;

        const login = document.getElementById("login").value;
        const password = document.getElementById("password").value;

        const res = await anixApi.auth.signIn({
            login: login,
            password: password,
        });

        switch (res.code) {
            case DefaultResult.Ok:
                user.set(
                    JSON.stringify({
                        id: res.profile.id,
                        token: res.profileToken.token,
                    }),
                );
                location.reload();
                analytics.trackEvent("new_login");
                break;
            case LoginResult.InvalidLogin:
                setError("Неверный логин!");
                break;

            case LoginResult.InvalidPassword:
                setError("Неверный пароль!");
                break;
        }

        waitLogin = false;
    }
</script>

<MetaInfo subTitle="Вход" />

<div class="login-page">
    {#if lastError}
        <div
            class="login-error"
            in:fade={{ duration: 200 }}
            out:fade={{ duration: 300 }}
        >
            {lastError}
        </div>
    {/if}
    <div class="login-form">
        <div class="login-form-title">С возвращением</div>
        <div class="login-form-input">
            <div class="login-form-input-label">Логин</div>
            <input type="text" id="login" />
        </div>
        <div class="login-form-input">
            <div class="login-form-input-label">Пароль</div>
            <input type="password" id="password" />
        </div>
        <div class="login-form-button">
            <BaseMainButton
                style="primary"
                width="100%"
                borderRadius={6}
                height={30}
                isLoading={waitLogin}
                onClickCallback={async () => await login()}
                >Войти</BaseMainButton
            >
        </div>
    </div>
</div>

<style>
    .login-page {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .login-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 35%;
        border-radius: 10px;
        padding-left: 20px;
        padding-right: 20px;
    }

    .login-error {
        position: absolute;
        top: 50px;
        margin-bottom: 10px;
        width: 35%;
        background-color: var(--danger-color);
        color: var(--main-text-color);
        text-align: center;
        padding: 10px;
        border-radius: 6px;
    }

    .login-form-input {
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        margin-bottom: 10px;
        width: 100%;
    }

    .login-form-input-label {
        font-size: 16px;
        color: var(--secondary-text-color);
        margin-bottom: 5px;
    }

    .login-form-input input[type="text"],
    .login-form-input input[type="password"] {
        width: 100%;
        height: 40px;
        border-radius: 6px;
        border: 1px solid var(--rate-back-color);
        background-color: var(--alt-background-color);
        color: var(--main-text-color);
        padding: 0 10px;
        box-sizing: border-box;
    }

    .login-form-title {
        font-size: 24px;
        font-weight: bold;
    }

    .login-form-button {
        margin: 10px 0;
        width: 100%;
    }
</style>
