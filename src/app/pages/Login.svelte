<!--TODO: Recode this-->

<script>
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";
    let u;

    const user = localStorageWritable("user_token", null);
    user.subscribe((value) => u = value);

    let invalidLogin = false;

    async function login() {
        const login = document.getElementById("login").value;
        const password = document.getElementById("password").value;

        const res = await anixApi.auth.signIn({
            login: login,
            password: password
        })

        switch (res.code) {
            case 0:
                user.set(JSON.stringify({
                    id: res.profile.id,
                    token: res.profileToken.token
                }));
                location.reload();
                analytics.trackEvent("new_login")
                break;
            case 2:
                invalidLogin = true;
                break;
        }
    }
</script>

<div class="login-page">
    {#if invalidLogin}
        <div>Неправильный логин или пароль</div>
    {/if}
    <div class="login-form">
        <div class="login-form-title">Вход</div>
        <div class="login-form-input">
            <div class="login-form-input-label">Логин</div>
            <input type="text" id="login" />
        </div>
        <div class="login-form-input">
            <div class="login-form-input-label">Пароль</div>
            <input type="password" id="password" />
        </div>
        <div class="login-form-button" on:click={async () => await login()}>Войти</div>
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
        background-color: var(--alt-background-color);
        border-radius: 10px;
        padding-left: 20px;
        padding-right: 20px;
    }

    .login-form-button {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
        background-color: #3f3e3e;
        color: var(--main-text-color);
        height: 30px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 6px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>