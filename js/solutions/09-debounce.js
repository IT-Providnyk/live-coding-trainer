// 09. debounce і throttle: рішення

export function debounce(fn, ms) {
  let timer;

  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  }

  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

export function throttle(fn, ms) {
  let timer = null;
  let pending = null; // { context, args } of the last call made inside the window

  function startWindow() {
    timer = setTimeout(() => {
      if (pending) {
        fn.apply(pending.context, pending.args);
        pending = null;
        startWindow(); // the trailing call opens a new window
      } else {
        timer = null;
      }
    }, ms);
  }

  return function throttled(...args) {
    if (timer === null) {
      fn.apply(this, args);
      startWindow();
    } else {
      pending = { context: this, args };
    }
  };
}

/*
Розбір
- debounce: «скинь таймер і заведи новий». Звичайна `function`, а не стрілка, щоб отримати
  `this` виклику, потім `fn.apply(this, args)` всередині стрілки в setTimeout.
- throttle: стан «вікно відкрите чи ні» плюс «останній відкладений виклик».
  Trailing-виклик відкриває нове вікно, інакше два виклики підуть майже підряд.
- Різниця одним реченням: debounce чекає паузи, throttle обмежує частоту.

У React:
- debounce значення, не функції: `useDebouncedValue(query, 300)` через useEffect і setTimeout
  з clearTimeout у cleanup. Див. React-задачу 07.
- Якщо debounce функцію, то через useMemo/useRef, інакше на кожен рендер новий таймер.
*/
