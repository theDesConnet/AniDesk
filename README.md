> [!WARNING]  
> Данный проект находится в стадии бета-тестирования. Это не полноценный релиз, возможны баги и нестабильная работа. Структура проекта может менятся.

<div align="center">

![anidesk-transparent](https://github.com/user-attachments/assets/497e25a6-751c-4f98-bd60-faec3ab1e69d)

# AniDesk
**AniDesk** — это неофициальный десктоп клиент мобильного приложения **Anixart** с открытым исходным кодом, предоставляющий удобный способ просматривать аниме и получать информацию о релизах.

</div>

## 🔧 Возможности

- 🔐 Использование вашего аккаунта Anixart  
- ▶️ Встроенный видеоплеер  
- 🎞️ Улучшение качества видео с помощью Anime4K  

## 📦 Установка

> ⚠️ Актуальные сборки доступны на странице [релизов](https://github.com/theDesConnet/AniDesk/releases)

Архив
  - Скачайте архив с последней версией для вашей ОС.
  - Распакуйте и запустите файл `AniDesk`.

Установочный файл
 - Скачайте установочный файл последней версии для вашей ОС
 - Запустите его, и дождитесь установки.

Nix / NixOS
  ```nix
  {
    inputs.anidesk.url = "github:theDesConnet/AniDesk";

    outputs = { nixpkgs, anidesk, ... }: {
      nixosConfigurations.<hostname> = nixpkgs.lib.nixosSystem {
        modules = [
          anidesk.nixosModules.default
        ];
      };
    };
  }
  ```

## 🛠️ Сборка вручную

```bash
git clone https://github.com/theDesConnet/AniDesk.git
cd AniDesk
npm install
npm run buildAndMake
```

## 💬 Обратная связь

Нашли баг или хотите предложить улучшение? Открывайте [issue](https://github.com/theDesConnet/AniDesk/issues "issue") или создавайте pull request.

## 📜 Лицензия

Этот проект лицензирован под **GPL-2.0**. Подробности см. в файле [LICENSE](LICENSE).
