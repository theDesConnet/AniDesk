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
    dispatch("setTitle", "Смена почты");

    let isSaving = false;

    let state = 0;

    let unsavedParams = {
        currentPassword: null,
        oldEmail: null,
        newEmail: null,
    };

    let emailHint = null;
    let warn = null;

    async function confirmPassword() {
        isSaving = true;

        const res = await anixApi.settings.confirmChangeEmail(
            unsavedParams.currentPassword,
        );
        if (res.code == 0) {
            emailHint = res.emailHint;
            warn = null;
            isSaving = false;
            state = 1;
        } else {
            warn = "Неверный пароль";
            isSaving = false;
        }
    }

    async function changeEmail() {
        isSaving = true;

        if (
            unsavedParams.oldEmail == null ||
            unsavedParams.newEmail == null
        ) {
            warn = "Заполните все поля";
            isSaving = false;
            return;
        }

        const res = await anixApi.settings.changeEmail({
            password: unsavedParams.currentPassword,
            oldEmail: unsavedParams.oldEmail,
            newEmail: unsavedParams.newEmail,
        }
        );
        if (res.code == 0) {
            dispatch("closeModal");
        } else {
            warn = "Не удалось сменить пароль";
            isSaving = false;
        }
    }
</script>

{#if showed}
    <div class="modal-title">Смена почты</div>
    <div class="modal-content">
        <div class="center">
            {#if warn}
                <InfoElement
                    title="Внимание"
                    description={warn}
                    type="warning"
                />
            {/if}
            {#if state === 0}
                <TextboxElement
                    title="Текущий пароль"
                    type="password"
                    placeholder="Текущий пароль"
                    onChangeCallback={(e) =>
                        (unsavedParams.currentPassword = e.target.value)}
                    required={true}
                    disabled={isSaving}
                />
                <BaseMainButton
                    style="primary"
                    type="submit"
                    isLoading={isSaving}
                    disabled={isSaving}
                    borderRadius={6}
                    onClickCallback={async () => await confirmPassword()}
                    width="80%">Подтвердить пароль</BaseMainButton
                >
            {:else if state === 1}
                <TextboxElement
                    title="Текущая почта"
                    placeholder="Подсказка: {emailHint}"
                    onChangeCallback={(e) =>
                        (unsavedParams.oldEmail = e.target.value)}
                    required={true}
                    disabled={isSaving}
                />
                <TextboxElement
                    title="Новая почта"
                    placeholder="myemail@example.com"
                    onChangeCallback={(e) =>
                        (unsavedParams.newEmail = e.target.value)}
                    required={true}
                    disabled={isSaving}
                />
                <BaseMainButton
                    style="primary"
                    type="submit"
                    isLoading={isSaving}
                    disabled={isSaving}
                    borderRadius={6}
                    onClickCallback={async () => await changeEmail()}
                    width="80%">Изменить почту</BaseMainButton
                >
            {/if}
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
