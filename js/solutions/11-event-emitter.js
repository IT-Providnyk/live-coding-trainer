// 11. EventEmitter: рішення

export class EventEmitter {
  #listeners = new Map(); // event -> array of { listener, wrapper }

  on(event, listener) {
    return this.#add(event, listener, listener);
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, listener);
      listener(...args);
    };
    return this.#add(event, listener, wrapper);
  }

  off(event, listener) {
    const entries = this.#listeners.get(event);
    if (!entries) return;
    const index = entries.findIndex((entry) => entry.listener === listener);
    if (index !== -1) entries.splice(index, 1);
    if (entries.length === 0) this.#listeners.delete(event);
  }

  emit(event, ...args) {
    const entries = this.#listeners.get(event);
    if (!entries || entries.length === 0) return false;
    // Copy: listeners may unsubscribe while we iterate.
    for (const { wrapper } of [...entries]) wrapper(...args);
    return true;
  }

  #add(event, listener, wrapper) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push({ listener, wrapper });
    return () => this.off(event, listener);
  }
}

/*
Розбір
- Зберігаємо пари { listener, wrapper }: для once викликаємо wrapper, а шукаємо за
  оригінальним listener. Тому `off(event, listener)` працює і для once.
- `[...entries]` перед циклом: якщо слухач робить off під час emit, splice зсуне індекси,
  і наступний слухач пропуститься. Цю пастку перевіряє останній тест.
- Масив, а не Set: той самий слухач можна підписати двічі (як у Node). Якщо інтерв'юер
  хоче без дублікатів, Set простіший. Спитай.
- Повертати unsubscribe з on: такий самий контракт, як у useEffect cleanup і subscribe
  у сторах.
*/
