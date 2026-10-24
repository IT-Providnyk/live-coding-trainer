# Live coding trainer

Задачі для підготовки до live coding на frontend-співбесідах: чистий JavaScript і React.
У кожної задачі є умова, заготовка, тести або перевірка в браузері і еталонне рішення з розбором.
Розбір пояснює пастки і дає follow-up питання, які люблять ставити інтерв'юери.

## JS

18 задач без залежностей: async/await, Promise, обробка даних з API, `fetch`, debounce,
event loop. Тести на `node:test`.

```bash
cd js
node run.js 03              # тести задачі 03 на твоєму коді
node run.js 03 --solution   # ті самі тести на еталоні
```

Детальніше: [js/README.md](js/README.md).

## React

10 задач на React + TypeScript з вбудованим мок-API: завантаження даних, стани,
паралельні й залежні запити, пошук, пагінація, форма.

```bash
cd react
npm install
npm run dev       # http://localhost:5180
```

Детальніше: [react/README.md](react/README.md).

Потрібен Node.js 22+.

## Відкрити в браузері без встановлення

JS: [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/IT-Providnyk/live-coding-trainer/tree/main/js)

React: [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/IT-Providnyk/live-coding-trainer/tree/main/react)

Інший варіант: GitHub Codespaces. На сторінці репозиторію натисни **Code → Codespaces →
Create codespace**, далі ті самі команди в терміналі.

## Як працювати

1. Спершу спробуй сам. Засічи час, ціль указана в умові.
2. Запусти тести або перевір у браузері.
3. Тільки потім відкривай еталон і розбір. Порівнюй підхід, а не лише результат.
4. Через кілька днів повтори задачу з нуля. Заготовку поверне `git checkout`, наприклад
   `git checkout js/tasks/03-*.js`.

План на 2 тижні для JS і React разом: [react/README.md](react/README.md#план-на-2-тижні-разом-з-js).

Ці задачі є також уроками на платформі Interview Providnyk. Там AI-ментор підказує,
коли застряг, і робить код-рев'ю твого рішення.

## Ліцензія

[MIT](LICENSE)
