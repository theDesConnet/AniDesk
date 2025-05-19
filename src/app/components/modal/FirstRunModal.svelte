<script>
    import { createEventDispatcher } from "svelte";
    import BaseMainButton from "../buttons/BaseMainButton.svelte";
    import { localStorageWritable } from "@babichjacob/svelte-localstorage";

    const dispatch = createEventDispatcher();

    let firstRun;

    const firstRunRaw = localStorageWritable("first_run", true);
    firstRunRaw.subscribe((value) => (firstRun = value));

    export let showed;
</script>

{#if showed}
    <div class="modal-title">Внимание</div>
    <div class="modal-content">
        <p>
            Добро пожаловать! Вы используете <strong>неофициальный клиент</strong> Anixart — альтернативное приложение, созданное для более удобного просмотра контента с Anixart на ПК. Мы не связаны с оригинальными разработчиками Anixart. Сейчас приложение находится в стадии <strong>бета-тестирования</strong>. Так что могут быть баги.
        </p>
        <p>
            Для улучшения приложения и понимания его работы мы собираем <strong>анонимную статистику использования</strong>. Это помогает нам выявлять проблемы, анализировать популярные функции и делать приложение лучше.
        </p>
        <p>
            <strong>Никакая личная информация не сохраняется.</strong> Вы всегда можете <strong>отключить аналитику</strong> в настройках в любой момент.
        </p>
        <p>
            Спасибо, что используете наш клиент ❤️
        </p>
        <BaseMainButton style="primary" onClickCallback={() => {firstRunRaw.set(false); dispatch("closeModal");}}>Понятно</BaseMainButton>
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
