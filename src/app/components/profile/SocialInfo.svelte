<script>
    export let profile;
    let showToast = false;

     function handleClick(type, url) {
        if (type === "ds") {
            navigator.clipboard.writeText(url)
                .then(() => {
                    showToast = true;
                    setTimeout(() => showToast = false, 2000);
                })
                .catch(err => {
                    console.error("Ошибка при копировании:", err);
                });
        } else {
            winApi.openLink(url);
        }
    }
</script>

{#snippet socialBox(type, icon, url)}
    <button
        class="profile-info-social {type}"
        onclick={() => handleClick(type, url)}
    >
        <img src={icon} alt={type} />
    </button>
{/snippet}

<div class="profile-socials flex-row">
    {#if profile.vk_page.trim().length > 0}
        {@render socialBox(
            "vk",
            "./assets/icons/vk.svg",
            `https://vk.com/${profile.vk_page}`,
        )}
    {/if}
    {#if profile.tg_page.trim().length > 0}
        {@render socialBox(
            "tg",
            "./assets/icons/tg.svg",
            `https://t.me/${profile.tg_page}`,
        )}
    {/if}
    {#if profile.discord_page.trim().length > 0}
        {@render socialBox(
            "ds",
            "./assets/icons/ds.svg",
            `${profile.discord_page}`,
        )}
    {/if}
    {#if profile.tt_page.trim().length > 0}
        {@render socialBox(
            "tt",
            "./assets/icons/tt.svg",
            `https://tiktok.com/@${profile.tt_page}`,
        )}
    {/if}
    {#if profile.inst_page.trim().length > 0}
        {@render socialBox(
            "inst",
            "./assets/icons/inst.svg",
            `https://instagram.com/${profile.inst_page}`,
        )}
    {/if}
</div>

{#if showToast}
    <div class="toast">Имя пользователя Discord было скопировано!</div>
{/if}

<style>
    .toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--alt-background-color);
        color: var(--main-text-color);
        padding: 10px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        font-size: 14px;
        z-index: 1000;
        opacity: 0.95;
        transition: opacity 0.3s ease;
    }

    .profile-socials {
        margin-top: 10px;
        align-items: center;
    }

    /* .profile-info-social {
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 53px;
        height: 34px;
        margin-right: 10px;
        border: 1px solid transparent;
        vertical-align: middle;
    } */

    .profile-info-social {
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 53px;
        height: 34px;
        margin-right: 10px;
        border: 1px solid transparent;
        box-sizing: border-box; /* Убедитесь, что границы и отступы учитываются в ширине и высоте */
        position: relative; /* Добавляем относительное позиционирование */
    }

    .vk {
        border-color: #2376c3;
    }

    .tg {
        border-color: #27a7e7;
    }

    .ds {
        border-color: #7289d9;
    }

    .vk {
        border-color: #2376c3;
    }

    .tg {
        border-color: #27a7e7;
    }

    .ds {
        border-color: #7289d9;
    }

    /* .tt {
        z-index: 0;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tt img {
        margin-left: 3px;
    }

    .tt::before {
        content: "";
        background: linear-gradient(
            160deg,
            rgba(38, 159, 196, 1) 0%,
            rgb(39, 37, 37) 50%,
            rgba(229, 15, 79, 1) 100%
        );
        z-index: -1;
        inset: 0;
        padding: 1px;
        width: 55px;
        height: 36px;
        position: absolute;
        border-radius: 10px;
        transform: translateZ(0);
        margin: 0;
        border-radius: inherit;
        box-sizing: border-box;
        mask:
            linear-gradient(#000 0 0) exclude,
            linear-gradient(#000 0 0) content-box;
    } */

    .tt {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
            inset 0 0 0 1px transparent,
            0 0 0 2px transparent; /* Прозрачные тени для границы */
        margin-bottom: 1px;
    }

    .tt img {
        margin-left: 3px;
    }

    .tt::before {
        content: "";
        background: linear-gradient(
            160deg,
            rgba(38, 159, 196, 1) 0%,
            rgb(39, 37, 37) 50%,
            rgba(229, 15, 79, 1) 100%
        );
        z-index: -1;
        inset: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        border-radius: 10px;
        padding: 1px;
        mask:
            linear-gradient(#000 0 0) exclude,
            linear-gradient(#000 0 0) content-box;
    }

    .inst {
        z-index: 0;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1px;
    }

    .inst img {
        margin-left: 3px;
    }

    .inst::before {
        content: "";
        background: linear-gradient(
            220deg,
            #405de6 0%,
            #5851db 20%,
            #833ab4 36%,
            #c13584 52%,
            #d13378 66%,
            #e724ab 72%,
            #ea4445 76%,
            #f35d3e 83%,
            #f78462 90%,
            #ffdc80 100%
        );
        z-index: -1;
        inset: 0;
        padding: 1px;
        width: 53px;
        height: 34px;
        position: absolute;
        border-radius: 10px;
        transform: translateZ(0);
        margin: 0;
        border-radius: inherit; /* Совпадение радиусов */
        box-sizing: border-box;
        mask:
            linear-gradient(#000 0 0) exclude,
            linear-gradient(#000 0 0) content-box;
    }
</style>
