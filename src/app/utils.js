/**
 * Набор всяких вспомогательных функций
 */

module.exports = {
    seasons: [null, "Зима", "Весна", "Лето", "Осень"],

    avaliableNotifications: [
        "myCollection",
        "relatedRelease",
        "friend",
    ], /*Отсеиваем неподдерживаемые уведомления в приложении чтобы потом небыло проблем с их обработкой 
        (В последствии я буду добавлять новые типы уведомлений)*/

    playerDefaultSettings: {
        autoplayEpisode: true,
        defaultAspectRatio: "16-9",
        saveUserVolume: {
            enabled: false,
            lastValue: null
        },
        defaultVolume: 50,
        opacityInterface: 50,
        timeHideInterface: 5000,
        hotkeys: {
            hotkeyPlayPause: ["Space"],
            hotkeyNextEpisode: ["KeyN"],
            hotkeyPrevEpisode: ["KeyB"],
            hotkeySkipOpening: ["KeyS"],
            hotkeyForward: ["ArrowRight"],
            hotkeyBackward: ["ArrowLeft"],
            hotkeyMute: ["KeyM"],
            hotkeyFullscreen: ["KeyF"]
        },
    },

    guiDefaultSettings: {
        theme: "dark",
        releaseCardType: "full-row",
    },

    playingDefaultSettings: {
        defaultQuality: 1080,
        defaultSource: null,
        disableHistory: false
    },

    upscaleDefaultSettings: {
        enabled: false,
        mode: 15
    },

    endpointValues: [
        { label: "api-s.anixsekai.com", value: "api-s.anixsekai.com" },
        { label: "api.anixart.app", value: "api.anixart.app" },
        { label: "api.anixart.tv (Заблокирован в РФ)", value: "api.anixart.tv" },
    ],

    bookmarkSortValues: [
        { label: "По дате добавления: сначала новые", value: 1 },
        { label: "По дате добавления: сначала старые", value: 2 },
        { label: "По алфавиту: A → Z", value: 5 },
        { label: "По алфавиту: Z → A", value: 6 },
        { label: "По году выхода релиза: сначала новые", value: 3 },
        { label: "По году выхода релиза: сначала старые", value: 4 },
    ],

    privacyOptions: [
        { label: "Никто", value: 2 },
        { label: "Только друзья", value: 1 },
        { label: "Все пользователи", value: 0 }
    ],

    privacyFriendsOptions: [
        { label: "Никто", value: 1 },
        { label: "Все пользователи", value: 0 }
    ],

    sourceValues: [
        { label: "Не выбран", value: null },
        { label: "Kodik", value: 0 },
        { label: "Libria", value: 1 },
        { label: "Sibnet", value: 2 }
    ],

    qualityValues: [
        { label: "1080p", value: 1080 },
        { label: "720p", value: 720 },
        { label: "480p", value: 480 },
        { label: "360p", value: 360 }
    ],

    aspectRatioValues: [
        { label: "16:9", value: "16-9" },
        { label: "4:3", value: "4-3" },
        { label: "Fit", value: "fit" },
    ],

    playerSpeedValues: [
        { label: "0.5x", value: 0.5 },
        { label: "1x", value: 1.0 },
        { label: "1.5x", value: 1.5 },
        { label: "2x", value: 2.0 }
    ],

    collectionSortValues: [
        { label: "В закладках", value: 0 },
        { label: "Лидеры рейтинга", value: 1 },
        { label: "Популярные за год", value: 2 },
        { label: "Популярные за сезон", value: 3 },
        { label: "Популярные за неделю", value: 4 },
        { label: "Недавно добавленные", value: 5 },
        { label: "Случайные", value: 6 },
    ],

    themeValues: [
        { label: "Темная", value: "dark" },
        { label: "Светлая (Не оптимизированная)", value: "light" }
    ],

    upscaleValues: [
        { label: "ModeA [Preset]", value: 14, description: "Быстрый пресет с умеренным восстановлением и апскейлом." },
        { label: "ModeB [Preset]", value: 15, description: "Сбалансированный пресет с акцентом на детализацию." },
        { label: "ModeC [Preset]", value: 16, description: "Качественный пресет с более агрессивным улучшением." },
        { label: "ModeA+A [Preset]", value: 17, description: "Расширенный ModeA с дополнительной обработкой." },
        { label: "ModeB+B [Preset]", value: 18, description: "Улучшенный ModeB, обеспечивает более высокое качество." },
        { label: "ModeC+A [Preset]", value: 19, description: "Комбинированный пресет с высокой чёткостью и восстановлением." },
        { label: "DoG [Deblur]", value: 0, description: "Удаление размытия и усиление границ с помощью фильтра разности Гауссиан." },
        { label: "BilateralMean [Denoise]", value: 1, description: "Снижение шума без потери резкости с помощью билинейного среднего." },
        { label: "CNNM [Restore]", value: 2, description: "Нейросетевое восстановление с умеренной глубиной, хорошо для общего улучшения." },
        { label: "CNNSoftM [Restore]", value: 3, description: "Более мягкое восстановление, минимизирующее артефакты и перегибы." },
        { label: "CNNSoftVLM [Restore]", value: 4, description: "Очень лёгкое и мягкое восстановление, подходит для слабых устройств." },
        { label: "CNNVL [Restore]", value: 5, description: "Восстановление с малой задержкой и быстрой обработкой." },
        { label: "CNNUL [Restore]", value: 6, description: "Универсальное восстановление с фокусом на стабильность качества." },
        { label: "GANUUL [Restore]", value: 7, description: "Реконструкция изображения с использованием GAN, для сложных сцен." },
        { label: "CNNx2M [Upscale]", value: 8, description: "Увеличение в 2 раза с сохранением структуры и минимальными артефактами." },
        { label: "CNNx2VL [Upscale]", value: 9, description: "Быстрый и лёгкий апскейл в 2 раза, подходит для слабых систем." },
        { label: "DenoiseCNNx2VL [Upscale]", value: 10, description: "Апскейл в 2 раза с предварительным шумоподавлением." },
        { label: "CNNx2UL [Upscale]", value: 11, description: "Универсальный и сбалансированный апскейл в 2 раза." },
        { label: "GANx3L [Upscale]", value: 12, description: "Апскейл в 3 раза с помощью GAN — нацелен на высокое качество." },
        { label: "GANx4UUL [Upscale]", value: 13, description: "Максимальный апскейл в 4 раза через GAN — для максимальной детализации." },
    ],

    getStringTime(time) {
        const days = Math.floor(time / 1440);
        const hours = Math.floor((time % 1440) / 60);
        const minutes = time;

        return {
            days,
            hours,
            minutes
        }
    },

    getNumericWord(number, words) {
        const cases = [2, 0, 1, 1, 1, 2];
        return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    },

    returnFullStringTime(time) {
        const { days, hours, minutes, seconds } = this.getStringTime(time);

        return `${days} ${this.getNumericWord(days, ['день', 'дня', 'дней'])} ${hours !== 0 ? `${hours} ${this.getNumericWord(hours, ['час', 'часа', 'часов'])}` : ""}`;
    },

    returnEpisodeString(anime) {
        let released = anime.episodes_released;
        let total = anime.episodes_total;

        if (total == null) total = '?';
        if (released == null) released = '?';
        if (total == null && released == null) return '?';
        if (total == released) return total;

        return `${released} из ${total}`;
    },

    getAgeRate(rate) {
        switch (rate) {
            case 2:
                return "6+";

            case 3:
                return "12+";

            case 4:
                return "16+";

            case 5:
                return "18+";

            case 1:
            default:
                return "0+";
        }
    },

    getShortDate(timestamp) {
        let date = new Date(timestamp * 1000);
        return `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}.${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}`
    },

    returnTimeString(time, showYear = false) {
        let date = new Date(time);
        return `${date.getDate()} ${date.toLocaleString("default", { month: "short" })} ${showYear ? date.getFullYear() : ""} в ${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
    },

    returnFormatedTime(time) {
        const h = Math.floor(time / 3600);
        const m = Math.floor((time % 3600) / 60);
        const s = Math.floor(time % 60);

        return [h, m, s]
            .map((x, i) => {
                if (x == 0 && i == 0) return null;
                return x >= 0 && x <= 9 ? `0${x}` : x;
            })
            .filter((x) => x !== null)
            .join(":");
    },

    async checkGPUSupport() {
        if (!navigator.gpu) {
            console.warn("WebGPU не поддерживается в этом браузере.");
            return false;
        }

        return navigator.gpu
            .requestAdapter()
            .then((adapter) => {
                return adapter !== null;
            })
            .catch(() => {
                return false;
            });
    },

    async fallback(callback, count) {
        let success = false;

        for (let i = 0; i < count && !success; i++) {
            callback(success);
            if (success) return;
            await new Promise(r => setTimeout(r, 500));
        }
    }
};