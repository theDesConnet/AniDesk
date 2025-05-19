<script>
    import BaseAltButton from "../components/buttons/BaseAltButton.svelte";
    import BaseMainButton from "../components/buttons/BaseMainButton.svelte";
    import Separator from "../components/elements/Separator.svelte";
    import BlankElement from "../components/settings/BlankElement.svelte";
    import CheckboxElement from "../components/settings/CheckboxElement.svelte";
    import DropdownElement from "../components/settings/DropdownElement.svelte";
    import HotkeyElement from "../components/settings/HotkeyElement.svelte";
    import TextAreaElement from "../components/settings/TextAreaElement.svelte";
    import TextboxParam from "../components/settings/TextboxElement.svelte";
    import TitleElement from "../components/settings/TitleElement.svelte";
    import InfoElement from "../components/settings/InfoElement.svelte";
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";

    let upscaleSettings;

    const upscaleSettingsRaw = localStorageWritable("upscaleSettings", utils.upscaleDefaultSettings);

    upscaleSettingsRaw.subscribe((value) => {
        upscaleSettings = value;
    });

    function updateKey(key, value) {
        upscaleSettings[key] = value;

        upscaleSettingsRaw.set(upscaleSettings);
    }

</script>

<div class="flex-column upscale-settings">
    {#if !avaliableGPU}
        <InfoElement
            title="Улучшение качества недоступно на вашем устройстве"
            description="Ваша видеокарта не поддерживает улучшение качества из-за отсутствия поддержки WebGPU. Это может быть связано с устаревшими драйверами или аппаратными ограничениями. Попробуйте обновить драйвер видеокарты, либо использовать другое устройство."
            type="danger"
        />
    {:else}
        <InfoElement
            title="Что делает улучшение качества?"
            description="Система улучшения на основе Anime4K повышает резкость, удаляет шум и повышает четкость видео в реальном времени. Она особенно эффективна для 2D-анимации. Однако она не добавляет новых деталей, как улучшение на основе нейросетей, а лишь улучшает уже имеющееся изображение."
            type="info"
        />
    {/if}

    <CheckboxElement
        title="Включить улучшение качества"
        description="Активирует улучшение качества через GPU с использованием технологий WebGPU и Anime4K. Повышает чёткость и качество изображения."
        disabled={!avaliableGPU}
        value={upscaleSettings.enabled && avaliableGPU}
        onChangeCallback={(e) => {
            updateKey("enabled", e);
        }}
    />

    <Separator width="75%" />

    <DropdownElement
        title="Режим улучшения"
        values={utils.upscaleValues}
        value={upscaleSettings.mode}
        placeholder="Выберите режим"
        disabled={!avaliableGPU || !upscaleSettings.enabled}
        onChangeCallback={(e, v) => updateKey("mode", v)}
    />

    <BlankElement title="Пользовательский пресет" disabled={true}>
        <div class="soon-text">
            <span class="soon-title">Данная функция находится в разработке</span
            >
            <span class="soon-description"
                >Вы сможете создавать и сохранять собственные комбинации
                фильтров и настроек улучшения качества для быстрого доступа.</span
            >
        </div>
    </BlankElement>
</div>

<style>
    .upscale-settings {
        align-items: center;
        margin-top: 40px;
    }

    .soon-title {
        font-size: 16px;
        font-weight: bold;
        color: var(--main-text-color);
        margin-bottom: 5px;
    }

    .soon-description {
        font-size: 12px;
        font-weight: normal;
        color: var(--secondary-text-color);
    }

    .soon-text {
        align-items: center;
        justify-content: center;
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        width: 100%;
        height: 400px;
        background-color: var(--alt-background-color);
        border-radius: 15px;
    }
</style>
