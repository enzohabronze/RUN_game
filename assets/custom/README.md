# Куда класть PNG

Игра берет рабочие изображения только отсюда: `assets/custom`.

Самое простое правило: заменяй существующий PNG своим файлом с тем же именем.

## Игрок

Главный файл игрока:

```text
assets/custom/player/player.png
```

Если в `src/assetManifest.js` стоит `usePlayerAnimations: false`, игра использует именно этот файл.

Рекомендуемый размер: `256x256` или `512x512`, прозрачный фон. Внутри картинки персонаж с тележкой должен быть по центру.

## Анимации игрока

Анимации лежат здесь, но сейчас выключены:

```text
assets/custom/player/run/damage-0/frame-0.png
assets/custom/player/turn-left/damage-0/frame-0.png
assets/custom/player/turn-right/damage-0/frame-0.png
assets/custom/player/hit/damage-0/frame-0.png
```

Степени повреждения:

```text
damage-0 = груз 76-100%
damage-1 = груз 51-75%
damage-2 = груз 26-50%
damage-3 = груз 0-25%
```

Если в `src/assetManifest.js` стоит `usePlayerAnimations: true`, игра использует кадры анимации, а не `player/player.png`.

Для видимой анимации бега без повреждений меняй эти файлы:

```text
assets/custom/player/run/damage-0/frame-0.png
assets/custom/player/run/damage-0/frame-1.png
assets/custom/player/run/damage-0/frame-2.png
assets/custom/player/run/damage-0/frame-3.png
```

Когда подготовишь все кадры, включи их:

```js
usePlayerAnimations: true
```

После замены PNG увеличь версию ассетов в `src/assetManifest.js`, например:

```js
assetVersion: "dev-2"
```

Так браузер точно не покажет старую картинку из кэша.

## Препятствия

```text
assets/custom/obstacles/cone.png
assets/custom/obstacles/crate.png
assets/custom/obstacles/pothole.png
assets/custom/obstacles/barrier.png
assets/custom/obstacles/oil.png
```

Рекомендуемый размер: `256x256`, прозрачный фон.

## Предметы

```text
assets/custom/pickups/package.png
assets/custom/pickups/repair.png
```

Рекомендуемый размер: `256x256`, прозрачный фон.

## Фоны

Главное меню на весь экран:

```text
assets/custom/backgrounds/menu.png
```

Экран проигрыша:

```text
assets/custom/backgrounds/game-over.png
```

Меню паузы:

```text
assets/custom/backgrounds/pause.png
```

Завершение уровня:

```text
assets/custom/backgrounds/level-complete.png
```

Фоны уровней:

```text
assets/custom/backgrounds/levels/level-1.png
assets/custom/backgrounds/levels/level-2.png
assets/custom/backgrounds/levels/level-3.png
assets/custom/backgrounds/levels/level-4.png
```

Рекомендуемый размер фона: `720x1280` PNG. Это вертикальный формат 9:16.

## Дорога

```text
assets/custom/road/road.png
```

Рекомендуемый размер: `405x720` PNG, можно с прозрачностью.

Если не хочешь явную дорогу, сделай `road.png` почти прозрачным или нарисуй мягкую центральную тропу без разметки. Логические полосы останутся, но игрок их не увидит.

## Боковые элементы движения

Эти элементы создают ощущение, что персонаж бежит вперед:

```text
assets/custom/decor/left-1.png
assets/custom/decor/left-2.png
assets/custom/decor/left-3.png

assets/custom/decor/right-1.png
assets/custom/decor/right-2.png
assets/custom/decor/right-3.png
```

Что рисовать:

- кусты;
- камни;
- столбики;
- мешки;
- ящики;
- пятна травы/грязи;
- обломки;
- бордюры или края тропы.

Как рисовать правильно:

- формат PNG с прозрачным фоном;
- размер `256x256` или `512x512`;
- объект должен стоять нижней частью ближе к низу картинки;
- оставь немного прозрачного места снизу под тень;
- не рисуй объект по центру как иконку, рисуй так, будто он стоит на земле;
- левый и правый элементы можно делать разными, но лучше в одном стиле;
- избегай слишком ярких цветов, чтобы декор не спорил с препятствиями.

Код сам двигает эти элементы вниз и увеличивает их при приближении к игроку.

## Как рисовать предметы и препятствия на земле

Все игровые объекты теперь рисуются от нижней точки, а не от центра. Это значит:

- низ PNG считается точкой контакта с землей;
- тень появляется под объектом автоматически;
- верхняя часть объекта должна быть выше нижней точки;
- прозрачные поля по краям допустимы, но у всех кадров одного объекта лучше держать одинаковый размер.

Для препятствий и предметов лучше использовать `256x256` PNG с прозрачным фоном.

## Кнопки

Кнопки остаются с текстом, но сама графика кнопки берется из PNG:

```text
assets/custom/ui/buttons/primary-normal.png
assets/custom/ui/buttons/primary-hover.png
assets/custom/ui/buttons/primary-active.png

assets/custom/ui/buttons/secondary-normal.png
assets/custom/ui/buttons/secondary-hover.png
assets/custom/ui/buttons/secondary-active.png
```

Рекомендуемый размер: `640x128` PNG.

## UI-иконки

```text
assets/custom/ui/icons/cargo.png
assets/custom/ui/icons/items.png
assets/custom/ui/icons/route.png
assets/custom/ui/icons/level.png
assets/custom/ui/icons/pause.png
```

Рекомендуемый размер: `128x128` PNG с прозрачным фоном.

## Звезды

```text
assets/custom/ui/stars/star-full.png
assets/custom/ui/stars/star-empty.png
```

Рекомендуемый размер: `128x128` PNG с прозрачным фоном.

## Как оптимизировать графику уровня

- Фоны делай `720x1280`. Для мобильной браузерной игры этого достаточно.
- Не используй огромные фоны `4K`: игра будет тяжелее грузиться.
- Для фонов без прозрачности используй JPG/WebP при финальной сборке, но сейчас оставляем PNG ради простоты.
- Для объектов и игрока используй прозрачный PNG.
- Обрезай пустые края у объектов, но оставляй одинаковый размер у кадров одной анимации.
- Все кадры одного действия должны быть одного размера, иначе персонаж будет дергаться.
- Если PNG весит больше 1-2 МБ, его лучше сжать через TinyPNG, Squoosh или Photoshop Export for Web.

## Проверка

После замены картинок запусти:

```powershell
node tools\check-assets.mjs
```

Если все хорошо, будет `All assets found`.
