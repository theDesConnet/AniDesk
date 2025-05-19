<script>
    import { createEventDispatcher } from "svelte";
    import TextboxElement from "./TextboxElement.svelte";
    import BaseMainButton from "../buttons/BaseMainButton.svelte";
    import InfoElement from "./InfoElement.svelte";
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";

    const dispatch = createEventDispatcher();

    let utoken;

    const user_token = localStorageWritable("user_token", null);
    user_token.subscribe((value) => (utoken = JSON.parse(value)));

    export let showed;
    dispatch("setTitle", "Смена пароля");

    let isSaving = false;

    let unsavedParams = {
        currentPassword: null,
        newPassword: null,
        repeatPassword: null
    }

    let warn = null;

    async function changePassword() {
        isSaving = true;

        if (unsavedParams.currentPassword == null || unsavedParams.newPassword == null || unsavedParams.repeatPassword == null) {
            warn = "Заполните все поля";
            isSaving = false;
            return;
        }

        if (unsavedParams.newPassword != unsavedParams.repeatPassword) {
            warn = "Пароли не совпадают";
            isSaving = false;
            return;
        }

        const res = await anixApi.settings.changePassword(unsavedParams.currentPassword, unsavedParams.newPassword);
        if (res.code == 0) {
            utoken.token = res.token;
            user_token.set(JSON.stringify(utoken));
            anixApi.client.token = res.token;
            dispatch("closeModal");
        } else {
            warn = "Не удалось сменить пароль";
            isSaving = false;
        }

    }
</script>

{#if showed}
    <div class="modal-title">Смена пароля</div>
    <div class="modal-content">
        <div class="center">
            {#if warn}
            <InfoElement title="Внимание" description={warn} type="warning" />
            {/if}
            <TextboxElement
                title="Текущий пароль"
                type="password"
                placeholder="Текущий пароль"
                onChangeCallback={(e) => (unsavedParams.currentPassword = e.target.value)}
                required={true}
                disabled={isSaving}
            />
            <TextboxElement
                title="Новый пароль"
                type="password"
                placeholder="Новый пароль"
                onChangeCallback={(e) => (unsavedParams.newPassword = e.target.value)}
                required={true}
                disabled={isSaving}
            />
            <TextboxElement
                title="Повторите пароль"
                type="password"
                placeholder="Повторите пароль"
                onChangeCallback={(e) => (unsavedParams.repeatPassword = e.target.value)}
                required={true}
                disabled={isSaving}
            />
            <BaseMainButton style="primary" type="submit" isLoading={isSaving} disabled={isSaving} borderRadius={6} onClickCallback={async () => await changePassword()} width="80%">Изменить пароль</BaseMainButton>
        </div>
    </div>
{/if}

<style>
    .center {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }
</style>
