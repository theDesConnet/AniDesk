<script>
    import Separator from "../components/elements/Separator.svelte";
    import CheckboxElement from "../components/settings/CheckboxElement.svelte";
    import DropdownElement from "../components/settings/DropdownElement.svelte";
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";
    import utils from "../utils";

    let playingSettings;

    const playingSettingsRaw = localStorageWritable("playingSettings", utils.playingDefaultSettings);

    playingSettingsRaw.subscribe((value) => {
        playingSettings = value
    })

    function updateKey(key, value) {
        playingSettings[key] = value;

        playingSettingsRaw.set(playingSettings);
    }
</script>

<div class="flex-column playing-settings">
    <CheckboxElement title="Запоминать вариант и источник (В разработке)" description="Автоматический переход к варианту и источнику из которого вы последний раз смотрели серию" value={false} disabled={true} onChangeCallback={(e) => {}} />
    <CheckboxElement title="Не сохранять историю просмотра" description="Серия не будут отображаться в вашей истории." value={playingSettings.disableHistory} onChangeCallback={(v) => updateKey('disableHistory', v)} />

    <Separator width="75%" />

    <DropdownElement title="Качество видео по умолчанию" values={utils.qualityValues} value={playingSettings.defaultQuality} placeholder="Выберите качество" onChangeCallback={(e, v) => updateKey('defaultQuality', v)} />
    <DropdownElement title="Источник по умолчанию (Если доступен)" values={utils.sourceValues} value={playingSettings.defaultSource} placeholder="Выберите источник" onChangeCallback={(e, v) => updateKey('defaultSource', v)} />
</div>

<style>
    .playing-settings {
        align-items: center;
        margin-top: 40px;
    }
</style>


