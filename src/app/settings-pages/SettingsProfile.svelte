<script>
    import BaseMainButton from "../components/buttons/BaseMainButton.svelte";
    import Separator from "../components/elements/Separator.svelte";
    import BlankElement from "../components/settings/BlankElement.svelte";
    import DropdownElement from "../components/settings/DropdownElement.svelte";
    import InfoElement from "../components/settings/InfoElement.svelte";
    import TextAreaElement from "../components/settings/TextAreaElement.svelte";
    import TextboxElement from "../components/settings/TextboxElement.svelte";
    import TitleElement from "../components/settings/TitleElement.svelte";
    import BaseModal from "../components/modal/BaseModal.svelte";
    import ChangePasswordModal from "../components/settings/ChangePasswordModal.svelte";
    import ChangeEmailModal from "../components/settings/ChangeEmailModal.svelte";
    import AuthPlaceholder from "../pages/AuthPlaceholder.svelte";

    let unsavedSettings = {
        status: profileSettings?.main?.status,
        vk_page: profileSettings?.socials?.vk_page,
        tg_page: profileSettings?.socials?.tg_page,
        discord_page: profileSettings?.socials?.discord_page,
        inst_page: profileSettings?.socials?.inst_page,
        tt_page: profileSettings?.socials?.tt_page,
        login: profileSettings?.login?.login,
    };

    let isSaving = false,
        showChangePasswordModal = false,
        showChangeEmailModal = false;
</script>

<div class="flex-column profile-settings">
    {#if profileSettings?.login && profileSettings?.main && profileSettings?.socials}
        <InfoElement
            title="Внимание"
            description="Изменить никнейм можно раз в 30 дней. Если пункт смены недоступен, значит вы уже изменяли его недавно."
            type="warning"
        />
        <TitleElement title="Основное" />
        <TextboxElement
            title="Никнейм"
            value={profileSettings.login.login}
            disabled={!profileSettings.login.is_change_available}
            placeholder="username"
            onChangeCallback={(e) => (unsavedSettings.login = e.target.value)}
        >
            <BaseMainButton
                style="primary"
                width="100%"
                borderRadius={6}
                isLoading={isSaving}
                disabled={isSaving ||
                    !profileSettings.login.is_change_available}
                onClickCallback={async () => {
                    isSaving = true;
                    const res = await anixApi.settings.changeLogin(
                        unsavedSettings.login,
                    );
                    if (res.code == 0) {
                        profileSettings.login.login = unsavedSettings.login;
                        profileSettings.login.is_change_available = false;
                    }
                    isSaving = false;
                }}>Изменить никнейм</BaseMainButton
            >
        </TextboxElement>
        <BlankElement title="Email">
            <BaseMainButton
                style="primary"
                width="100%"
                borderRadius={6}
                onClickCallback={() => {
                    showChangeEmailModal = true;
                }}>Изменить email</BaseMainButton
            >
        </BlankElement>
        <BlankElement title="Пароль">
            <BaseMainButton
                style="primary"
                width="100%"
                borderRadius={6}
                onClickCallback={() => {
                    showChangePasswordModal = true;
                }}>Изменить пароль</BaseMainButton
            >
        </BlankElement>
        <TextAreaElement
            title="Статус"
            placeholder="Пишите свой статус"
            value={profileSettings.main.status}
            onChangeCallback={(e) => (unsavedSettings.status = e.target.value)}
        >
            <BaseMainButton
                customClasses="profile-settings-button"
                width="100%"
                style="primary"
                borderRadius={6}
                isLoading={isSaving}
                disabled={isSaving}
                onClickCallback={async () => {
                    isSaving = true;
                    const res = await anixApi.settings.setStatus(
                        unsavedSettings.status,
                    );

                    if (res.code == 0)
                        profileSettings.main.status = unsavedSettings.status;

                    isSaving = false;
                }}>Сохранить</BaseMainButton
            >
        </TextAreaElement>

        <Separator width="75%" />

        <TitleElement title="Социальные сети" />

        <TextboxElement
            title="ВКонтакте"
            value={profileSettings.socials.vk_page}
            onChangeCallback={(e) => (unsavedSettings.vk_page = e.target.value)}
            placeholder="https://vk.com/username или username"
        />

        <TextboxElement
            title="Телеграм"
            value={profileSettings.socials.tg_page}
            onChangeCallback={(e) => (unsavedSettings.tg_page = e.target.value)}
            placeholder="https://t.me/username или username"
        />

        <TextboxElement
            title="Инстаграм"
            value={profileSettings.socials.inst_page}
            onChangeCallback={(e) =>
                (unsavedSettings.inst_page = e.target.value)}
            placeholder="https://instagram.com/username или username"
        />

        <TextboxElement
            title="Тикток"
            value={profileSettings.socials.tt_page}
            onChangeCallback={(e) => (unsavedSettings.tt_page = e.target.value)}
            placeholder="https://tiktok.com/username или username"
        />

        <TextboxElement
            title="Дискорд"
            value={profileSettings.socials.discord_page}
            onChangeCallback={(e) =>
                (unsavedSettings.discord_page = e.target.value)}
            placeholder="username"
        />

        <BlankElement>
            <BaseMainButton
                style="primary"
                width="100%"
                borderRadius={6}
                isLoading={isSaving}
                onClickCallback={async () => {
                    isSaving = true;
                    const res =
                        await anixApi.settings.setSocial(unsavedSettings);

                    if (res.code == 0) {
                        profileSettings.socials = {
                            vk_page: unsavedSettings.vk_page,
                            tg_page: unsavedSettings.tg_page,
                            discord_page: unsavedSettings.discord_page,
                            inst_page: unsavedSettings.inst_page,
                            tt_page: unsavedSettings.tt_page,
                        };
                    }

                    isSaving = false;
                }}>Сохранить</BaseMainButton
            >
        </BlankElement>

        <Separator width="75%" />

        <TitleElement title="Приватность" />

        <DropdownElement
            title="Кто видит мою статистику, оценки и историю просмотра"
            value={profileSettings.main.privacy_stats}
            values={utils.privacyOptions}
            onChangeCallback={async (e, v) => {
                const res = await anixApi.settings.setPrivacyStats(v);

                if (res.code == 0) {
                    profileSettings.main.privacy_stats = v;
                }
            }}
        />

        <DropdownElement
            title="Кто видит в профиле мои комментарии, коллекции, видео и друзей"
            value={profileSettings.main.privacy_counts}
            values={utils.privacyOptions}
            onChangeCallback={async (e, v) => {
                const res = await anixApi.settings.setPrivacyCounts(v);

                if (res.code == 0) {
                    profileSettings.main.privacy_counts = v;
                }
            }}
        />

        <DropdownElement
            title="Кто видит мои социальные сети"
            value={profileSettings.main.privacy_social}
            values={utils.privacyOptions}
            onChangeCallback={async (e, v) => {
                const res = await anixApi.settings.setPrivacySocials(v);

                if (res.code == 0) {
                    profileSettings.main.privacy_socials = v;
                }
            }}
        />

        <DropdownElement
            title="Кто может отправлять мне заявки в друзья"
            value={profileSettings.main.privacy_friend_requests}
            values={utils.privacyFriendsOptions}
            onChangeCallback={async (e, v) => {
                const res = await anixApi.settings.setPrivacyFriendRequests(v);

                if (res.code == 0) {
                    profileSettings.main.privacy_friend_requests = v;
                }
            }}
        />

        <BaseModal
            modalComponent={ChangePasswordModal}
            showed={showChangePasswordModal}
            modalSize={{ width: "40%", height: "550px" }}
            on:closeModal={() => {
                showChangePasswordModal = false;
            }}
        />
        <BaseModal
            modalComponent={ChangeEmailModal}
            showed={showChangeEmailModal}
            modalSize={{ width: "40%", height: "550px" }}
            on:closeModal={() => {
                showChangeEmailModal = false;
            }}
        />
    {:else}
    <AuthPlaceholder />
    {/if}
</div>

<style>
    .profile-settings {
        align-items: center;
        margin-top: 40px;
    }
</style>
