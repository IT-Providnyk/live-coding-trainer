/**
 * 11. EventEmitter
 * Рівень: ★★☆   Ціль: 15 хв
 *
 * class EventEmitter
 * - on(event, listener): підписка, повертає функцію відписки;
 * - off(event, listener): відписка (якщо listener не підписаний, нічого не робити);
 * - once(event, listener): спрацює один раз, і `off(event, listener)` до спрацювання теж працює;
 * - emit(event, ...args): викликає слухачів у порядку підписки, повертає true, якщо хтось був.
 *
 * Тонкий момент: якщо слухач під час emit відписує себе або інших, поточний emit
 * все одно викликає всіх, хто був підписаний на момент початку emit.
 *
 *   const bus = new EventEmitter();
 *   const unsubscribe = bus.on('transfer', (t) => console.log(t.id));
 *   bus.emit('transfer', { id: 't1' });  // t1
 *   unsubscribe();
 *
 * Перевірка: node run.js 11
 */
export class EventEmitter {
  on(event, listener) {
    throw new Error('Not implemented');
  }

  off(event, listener) {
    throw new Error('Not implemented');
  }

  once(event, listener) {
    throw new Error('Not implemented');
  }

  emit(event, ...args) {
    throw new Error('Not implemented');
  }
}
