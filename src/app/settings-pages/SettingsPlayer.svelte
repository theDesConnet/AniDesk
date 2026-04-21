<script>
    import { onMount } from "svelte";
    import Separator from "../components/elements/Separator.svelte";
    import CheckboxElement from "../components/settings/CheckboxElement.svelte";
    import DropdownElement from "../components/settings/DropdownElement.svelte";
    import HotkeyElement from "../components/settings/HotkeyElement.svelte";
    import TextboxParam from "../components/settings/TextboxElement.svelte";
    import TitleElement from "../components/settings/TitleElement.svelte";
    import { playerSettingsStore } from "../components/stores/pageHistory.js";

    let playerSettings;
    const MIN_INTERFACE_HIDE_DELAY = 1000;
    const MAX_INTERFACE_HIDE_DELAY = 2000;

    playerSettingsStore.subscribe((value) => {
        playerSettings = value;
    });

    function updateKey(key, value) {
        playerSettings = {
            ...playerSettings,
            [key]: value,
        };

        playerSettingsStore.set(playerSettings);
        localStorage.setItem("playerSettings", JSON.stringify(playerSettings));

        switch (key) {
            case "saveUserVolume":
                settings.set("PlayerSaveUserVolumeEnabled", value.enabled);
                break;
        }
    }

    function normalizeInterfaceHideDelay(value) {
        return Math.min(
            MAX_INTERFACE_HIDE_DELAY,
            Math.max(
                MIN_INTERFACE_HIDE_DELAY,
                Number(value) || utils.playerDefaultSettings.timeHideInterface,
            ),
        );
    }

    onMount(() => {
        if (!playerSettings) return;

        const normalizedDelay = normalizeInterfaceHideDelay(
            playerSettings.timeHideInterface,
        );

        if (playerSettings.timeHideInterface !== normalizedDelay) {
            updateKey("timeHideInterface", normalizedDelay);
        }
    });
</script>

<div class="flex-column player-settings">
    <TitleElement title="Видео" />

    <CheckboxElement
        title="Автовоспроизведение следующего эпизода"
        description="После окончания серии плеер автоматически начинает следующий эпизод."
        value={playerSettings.autoplayEpisode}
        onChangeCallback={(e) => updateKey("autoplayEpisode", e)}
    />
    <CheckboxElement
        title="Запоминать позицию просмотра (В разработке)"
        description="Серия продолжается с того места, где вы остановились."
        disabled={true}
        onChangeCallback={(e) => {}}
    />
    <DropdownElement
        title="Соотношение сторон по умолчанию"
        values={utils.aspectRatioValues}
        value={playerSettings.defaultAspectRatio}
        placeholder="Выберите соотношение"
        onChangeCallback={(e, v) => updateKey("defaultAspectRatio", v)}
    />

    <Separator width="75%" />

    <TitleElement title="Аудио" />

    <CheckboxElement
        title="Сохранять значение громкости"
        description="Громкость будет сохраняться при новом открытии плеера."
        value={playerSettings.saveUserVolume.enabled}
        onChangeCallback={(e) =>
            updateKey("saveUserVolume", {
                enabled: e,
                lastValue:
                    playerSettings.saveUserVolume.lastValue ??
                    playerSettings.defaultVolume / 100,
            })}
    />

    <Separator width="75%" />

    <TitleElement title="Интерфейс" />

    <TextboxParam
        title="Непрозрачность интерфейса"
        value={playerSettings.opacityInterface}
        placeholder="50"
        type="number"
        suffix="%"
        min="1"
        max="90"
        onChangeCallback={(e) =>
            updateKey("opacityInterface", Number(e.target.value))}
    />
    <TextboxParam
        title="Время скрытия интерфейса"
        value={playerSettings.timeHideInterface}
        placeholder="2000"
        type="number"
        suffix="ms"
        min="1000"
        max="2000"
        onChangeCallback={(e) =>
            updateKey(
                "timeHideInterface",
                normalizeInterfaceHideDelay(e.target.value),
            )}
    />

    <Separator width="75%" />

    <TitleElement title="Горячие клавиши" />

    <HotkeyElement
        title="Воспроизведение/Пауза"
        value={playerSettings.hotkeys.hotkeyPlayPause}
        onSetHotKey={(e) => {
            playerSettings.hotkeys.hotkeyPlayPause = e;
            let hK = playerSettings.hotkeys;

            updateKey("hotkeys", {
                hotkeyPlayPause: e,
                ...hK,
            });
        }}
    />
    <HotkeyElement
        title="Вход/выход в полноэкранный режим"
        value={playerSettings.hotkeys.hotkeyFullscreen}
        onSetHotKey={(e) => {
            playerSettings.hotkeys.hotkeyFullscreen = e;
            let hK = playerSettings.hotkeys;

            updateKey("hotkeys", {
                hotkeyFullscreen: e,
                ...hK,
            });
        }}
    />
    <HotkeyElement
        title="Следующий эпизод"
        value={playerSettings.hotkeys.hotkeyNextEpisode}
        onSetHotKey={(e) => {
            playerSettings.hotkeys.hotkeyNextEpisode = e;
            let hK = playerSettings.hotkeys;

            updateKey("hotkeys", {
                hotkeyNextEpisode: e,
                ...hK,
            });
        }}
    />
    <HotkeyElement
        title="Предыдущий эпизод"
        value={playerSettings.hotkeys.hotkeyPrevEpisode}
        onSetHotKey={(e) => {
            playerSettings.hotkeys.hotkeyPrevEpisode = e;
            let hK = playerSettings.hotkeys;

            updateKey("hotkeys", {
                hotkeyPrevEpisode: e,
                ...hK,
            });
        }}
    />
    <HotkeyElement
        title="Пропуск опенинга"
        value={playerSettings.hotkeys.hotkeySkipOpening}
        onSetHotKey={(e) => {
            playerSettings.hotkeys.hotkeySkipOpening = e;
            let hK = playerSettings.hotkeys;

            updateKey("hotkeys", {
                hotkeySkipOpening: e,
                ...hK,
            });
        }}
    />
    <HotkeyElement
        title="Перемотка вперёд"
        value={playerSettings.hotkeys.hotkeyForward}
        onSetHotKey={(e) => {
            playerSettings.hotkeys.hotkeyForward = e;
            let hK = playerSettings.hotkeys;

            updateKey("hotkeys", {
                hotkeyForward: e,
                ...hK,
            });
        }}
    />
    <HotkeyElement
        title="Перемотка назад"
        value={playerSettings.hotkeys.hotkeyBackward}
        onSetHotKey={(e) => {
            playerSettings.hotkeys.hotkeyBackward = e;
            let hK = playerSettings.hotkeys;

            updateKey("hotkeys", {
                hotkeyBackward: e,
                ...hK,
            });
        }}
    />
    <HotkeyElement
        title="Отключить/включить звук"
        value={playerSettings.hotkeys.hotkeyMute}
        onSetHotKey={(e) => {
            playerSettings.hotkeys.hotkeyMute = e;
            let hK = playerSettings.hotkeys;

            updateKey("hotkeys", {
                hotkeyMute: e,
                ...hK,
            });
        }}
    />
</div>

<style>
    .player-settings {
        align-items: center;
        margin-top: 40px;
    }
</style>
