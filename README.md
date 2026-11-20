# 📝 Нотатки — прогресивний веб-застосунок (PWA)

Курсова робота з дисципліни «WEB-технології та WEB-дизайн».
Тема 16: **Розробка прогресивного веб-застосунку (PWA) з підтримкою роботи офлайн**.

**Автор:** Сурков Валентин  
**Робочий URL:** https://valentynsurkovandri-sys.github.io/surkov-coursework/

## Можливості
- створення, редагування, видалення та пошук нотаток;
- робота **без інтернету** (Service Worker + Cache API);
- збереження даних на пристрої (IndexedDB);
- встановлення на телефон / ПК як застосунок (Web App Manifest);
- індикатор «Онлайн / Офлайн»;
- адаптивна верстка (360 / 768 / 1280 px).

## Технології
HTML5, CSS3 (Grid, Flexbox, медіа-запити), JavaScript (ES6+), Service Worker, Cache API, IndexedDB, Web App Manifest, GitHub Pages.

## Структура
```
index.html      — головна сторінка
offline.html    — сторінка, коли немає мережі
manifest.json   — маніфест PWA
sw.js           — Service Worker
css/style.css   — стилі
js/db.js        — робота з IndexedDB
js/app.js       — логіка застосунку
icons/          — іконки застосунку
docs/           — скриншоти для записки
```

## Запуск локально
Service Worker працює лише через `http://localhost` або HTTPS.
У VS Code встановіть розширення **Live Server** → правий клік на `index.html` → **Open with Live Server**.

## Перевірка офлайн-режиму
DevTools (F12) → вкладка **Application** → Service Workers → поставити галочку **Offline** → оновити сторінку.
