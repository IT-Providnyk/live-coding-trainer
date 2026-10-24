// 17. getJson і postJson: рішення

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(url, init) {
  const res = await fetch(url, init);

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (typeof body?.error === 'string') message = body.error;
    } catch {
      // Body is not JSON: keep the generic message.
    }
    throw new ApiError(message, res.status);
  }

  return res.json();
}

export function getJson(url, init) {
  return request(url, init);
}

export function postJson(url, body, init = {}) {
  return request(url, {
    ...init,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...init.headers },
    body: JSON.stringify(body),
  });
}

/*
Розбір
- `res.ok` це статус 200–299. fetch реджектиться тільки на мережу й abort.
- Помилка з тексту сервера ({ error }) краща для UI, ніж «HTTP 400».
- Без 'Content-Type' fetch відправить text/plain, Express не розпарсить тіло → 400.
  Без JSON.stringify піде рядок '[object Object]'. Обидві пастки типові для задач з API.
- Спільна request(): дві публічні функції без дублювання.

TypeScript-версія (на React-співбесіді пиши так):
  export async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
    ...
    return (await res.json()) as T;
  }
  const data = await getJson<TransfersResponse>('/api/transfers', { signal });
                         ^^^^^^^^^^^^^^^^^^^ тип ВІДПОВІДІ API, а не стану UI. Через це
                         наживо на це легко піти 10+ хвилин.
*/
