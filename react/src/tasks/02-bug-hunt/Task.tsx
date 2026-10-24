// Task 02: bug hunt. See README.md. This is the kind of code people write live under time pressure.
// Step 1: list every problem you see in a comment right here, BEFORE running anything.
// Step 2: fix them.
//
// Problems I found:
// 1.
//
import {useState, useEffect} from 'react'

const baseUrl = '/api'

interface Items {
  "id": string,
  "direction": string,
  "counterpartyId": string,
  "amount": number,
  "currency": string,
  "status": string,
  "description": string,
  "createdAt": string
}

type TransfersData =
  | {status: 'loading'}
  | {status: 'error', message: string}
  | {status: 'success', items: Items[], total: number }

export default function Task() {
  const [transfers, setTransfers] = useState<TransfersData>({status: 'loading'})

  async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
    const response = await fetch(url, {signal})

    if(!response.ok) {
      throw new Error(`${url} with status ${response.status}`)
    }

    return (await response.json()) as T
  }

  useEffect(() => {
    const controller = new AbortController
    async function loadTransfers () {
      try {
        const transfersData = await getJson<TransfersData>(`${baseUrl}/api/transfers`, controller.signal)
        if(controller.signal.aborted) return
        if(transfersData.status === 'success' ) {
          setTransfers({status: 'success', items: transfersData.items, total: transfersData.total})
        }
      } catch(error) {
        if(controller.signal.aborted) return
        if(transfers.status === 'error' ) {
          setTransfers({status: 'error', message: ''})
        }
      }
    }
    loadTransfers()
  }, [baseUrl])

  if(transfers.status === 'success' && transfers.items.length === 0) {
    return <p>Transfers not found</p>
  }

  return (
    <main className="page">
      <h1>Історія переказів</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Опис</th>
            <th className="num">Сума</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {transfers.status === 'success' && transfers.items.map((transfer) => (
            <tr>
              <td>{transfer.createdAt}</td>
              <td>{transfer.description}</td>
              <td className="num">{transfer.amount} {transfer.currency}</td>
              <td>
                <span className="badge">{transfer.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
