/**
 * 05. summarize: підсумки для карток
 * Рівень: ★★☆   Ціль: 10 хв
 *
 * Тут часто виникає плутанина: картки «Отримано», «Відправлено», «Баланс» це
 * АГРЕГАТИ по всіх переказах, а не поля одного переказу.
 *
 * summarize(transfers, rates) повертає { incoming, outgoing, balance } у КОПІЙКАХ UAH (цілі числа).
 * - рахувати тільки status === 'completed';
 * - `amount` у мінімальних одиницях валюти переказу (копійки, центи);
 * - rates: { UAH: 1, USD: 41.32, ... } це скільки гривень коштує 1 одиниця валюти, тому МНОЖИТИ;
 * - кожен переказ після конвертації округлити до цілої копійки (Math.round), потім сумувати;
 * - balance = incoming − outgoing;
 * - валюти немає в rates: кинути Error з назвою валюти в тексті.
 *
 *   summarize(
 *     [
 *       { direction: 'incoming', amount: 25000, currency: 'USD', status: 'completed' },
 *       { direction: 'outgoing', amount: 125000, currency: 'UAH', status: 'completed' },
 *       { direction: 'outgoing', amount: 99900, currency: 'UAH', status: 'failed' },
 *     ],
 *     { UAH: 1, USD: 41.32 },
 *   )
 *   // { incoming: 1033000, outgoing: 125000, balance: 908000 }
 *
 * Перевірка: node run.js 05
 */
export function summarize(transfers, rates) {
  throw new Error('Not implemented');
}
