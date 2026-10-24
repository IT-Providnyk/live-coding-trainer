// 05. summarize: рішення

export function summarize(transfers, rates) {
  let incoming = 0;
  let outgoing = 0;

  for (const t of transfers) {
    if (t.status !== 'completed') continue;

    const rate = rates[t.currency];
    if (rate === undefined) throw new Error(`No rate for currency ${t.currency}`);

    const uahMinor = Math.round(t.amount * rate);
    if (t.direction === 'incoming') incoming += uahMinor;
    else outgoing += uahMinor;
  }

  return { incoming, outgoing, balance: incoming - outgoing };
}

/*
Розбір
- Гроші рахуємо в цілих мінімальних одиницях. Ділити на 100 тільки під час виводу (задача 06).
  Інакше 0.1 + 0.2 !== 0.3, і копійки «пливуть».
- Курс: «скільки UAH за 1 USD», отже USD → UAH це множення. Ділити неправильно.
  Центи × курс = копійки, бо обидві валюти мають 2 знаки після коми.
- Округлюємо кожен переказ окремо, як банк у виписці, а не суму наприкінці.
- Тільки completed: якщо інтерв'юер не сказав, СПИТАЙ «чи рахувати pending і failed?».
  За питання дають плюс.
- Один прохід циклом, а не filter → map → reduce тричі. Обидва варіанти ок, але цикл
  простіше пояснити.

У React це похідні дані: рахуються з `transfers` і `rates` під час рендеру (за потреби
`useMemo`), окремий useState для них НЕ потрібен.
*/
