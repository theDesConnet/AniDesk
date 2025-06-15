<script>
    import Separator from "../components/elements/Separator.svelte";
    import CheckboxElement from "../components/settings/CheckboxElement.svelte";
    import TitleElement from "../components/settings/TitleElement.svelte";
    import DropdownElement from "../components/settings/DropdownElement.svelte";
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";
    import InfoElement from "../components/settings/InfoElement.svelte";

    let guiSettings, endpointUrl;

    let restartRequired = baseSettings.restartRequired;

    const guiSettingsRaw = localStorageWritable(
        "guiSettings",
        utils.guiDefaultSettings,
    );

    const endpointUrlRaw = localStorageWritable("endpointUrl", "api-s.anixsekai.com");   

    guiSettingsRaw.subscribe((value) => {
        guiSettings = value;
    });
    
    endpointUrlRaw.subscribe((value) => {
        endpointUrl = value;
    });

    function updateGuiKey(key, value) {
        guiSettings[key] = value;

        guiSettingsRaw.set(guiSettings);
    }

    function updateMainKey(key, value) {
        restartRequired = true;
        baseSettings.restartRequired = true;
        baseSettings[key] = value;

        settings.set(key, value);
    }
</script>

<div class="flex-column app-settings">
    {#if restartRequired}
        <InfoElement
            title="Требуется перезагрузка"
            description="Изменения вступят в силу после перезагрузки."
            type="warning"
        />
    {/if}

    <TitleElement title="Основное" />

    <CheckboxElement
        title="Включить автообновление"
        description="Приложение будет автоматически загружать и устанавливать обновления при их наличии."
        value={baseSettings.AutoUpdate}
        onChangeCallback={(e) => updateMainKey("AutoUpdate", e)}
    />
    <CheckboxElement
        title="Включить Discord RPC"
        description="Отображает текущий статус просмотра в вашем профиле Discord."
        value={baseSettings.EnableRPC}
        onChangeCallback={(e) => updateMainKey("EnableRPC", e)}
    />
    <CheckboxElement
        title="Собирать анонимную аналитику"
        description="Позволяет собирать анонимную аналитику об использовании приложения для улучшения функционала и исправления багов."
        value={baseSettings.EnableAnalytics}
        onChangeCallback={(e) => updateMainKey("EnableAnalytics", e)}
    />
    <CheckboxElement
        title="Включить DevTools"
        description="Позволяет использовать DevTools в приложении, доступно только в бете."
        value={baseSettings.EnableDevTools}
        onChangeCallback={(e) => updateMainKey("EnableDevTools", e)}
    />

    <DropdownElement
        title="Эндпоинт API"
        values={utils.endpointValues}
        value={endpointUrl}
        placeholder="Выберите эндпоинт"
        onChangeCallback={(e, v) => {
            endpointUrlRaw.set(v);
            restartRequired = true;
            baseSettings.restartRequired = true;
        }}
    />

    <Separator width="75%" />

    <TitleElement title="Внешний вид" />

    <DropdownElement
        title="Тема"
        values={utils.themeValues}
        value={guiSettings.theme}
        placeholder="Выберите тему"
        onChangeCallback={(e, v) => {
            updateGuiKey("theme", v);
            document.body.classList = [`${v}-theme`];
        }}
    />
</div>

<style>
    .app-settings {
        align-items: center;
        margin-top: 40px;
    }
</style>
