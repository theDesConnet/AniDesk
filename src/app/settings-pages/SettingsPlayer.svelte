<script>
    import Separator from "../components/elements/Separator.svelte";
    import CheckboxElement from "../components/settings/CheckboxElement.svelte";
    import DropdownElement from "../components/settings/DropdownElement.svelte";
    import HotkeyElement from "../components/settings/HotkeyElement.svelte";
    import TextboxParam from "../components/settings/TextboxElement.svelte";
    import TitleElement from "../components/settings/TitleElement.svelte";
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";

    let playerSettings;

    const playerSettingsRaw = localStorageWritable(
        "playerSettings",
        utils.playerDefaultSettings,
    );

    playerSettingsRaw.subscribe((value) => {
        playerSettings = value;
    });

    function updateKey(key, value) {
        playerSettings[key] = value;

        playerSettingsRaw.set(playerSettings);
    }
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
                lastValue: playerSettings.saveUserVolume.lastValue,
            })}
    />
    <TextboxParam
        title="Громкость по умолчанию"
        value={playerSettings.defaultVolume}
        placeholder="100"
        type="number"
        suffix="%"
        min="1"
        max="100"
        onChangeCallback={(e) =>
            updateKey("defaultVolume", Number(e.target.value))}
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
        placeholder="5000"
        type="number"
        suffix="ms"
        min="1000"
        onChangeCallback={(e) =>
            updateKey("timeHideInterface", Number(e.target.value))}
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
