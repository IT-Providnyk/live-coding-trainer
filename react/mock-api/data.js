// In-memory "database" for the mock API. Amounts are in minor units (kopecks / cents / grosze).
// transfers, contacts and rates mimic a typical fintech interview task.

export const rates = {
  base: 'UAH',
  rates: {
    UAH: 1,
    USD: 41.32,
    EUR: 48.05,
    PLN: 11.27,
  },
  updatedAt: '2026-10-22T06:00:00Z',
};

export const contacts = [
  { id: 'c_101', fullName: 'Олена Коваленко', bank: 'monobank', cardMask: '**** 4821' },
  { id: 'c_102', fullName: 'Андрій Шевчук', bank: 'ПриватБанк', cardMask: '**** 1934' },
  { id: 'c_103', fullName: 'Ірина Бондар', bank: 'ПУМБ', cardMask: '**** 7710' },
  { id: 'c_105', fullName: 'Marek Nowak', bank: 'PKO Bank Polski', cardMask: '**** 3307' },
  { id: 'c_106', fullName: 'Sarah Miller', bank: 'Revolut', cardMask: '**** 9902' },
  { id: 'c_107', fullName: 'Дмитро Лисенко', bank: 'Sense Bank', cardMask: '**** 5518' },
  { id: 'c_108', fullName: 'Катерина Мельник', bank: 'monobank', cardMask: '**** 2264' },
  { id: 'c_109', fullName: 'Thomas Weber', bank: 'Deutsche Bank', cardMask: '**** 6045' },
  { id: 'c_110', fullName: 'Оксана Ткаченко', bank: 'ПриватБанк', cardMask: '**** 8173' },
  { id: 'c_111', fullName: 'Віктор Гнатюк', bank: 'Ощадбанк', cardMask: '**** 0457' },
];

export const transfers = [
  { id: 'tr_001', direction: 'incoming', counterpartyId: 'c_101', amount: 200000, currency: 'UAH', status: 'completed', description: 'Перший переказ', createdAt: '2026-09-18T18:25:00Z' },
  { id: 'tr_002', direction: 'outgoing', counterpartyId: 'c_106', amount: 30000, currency: 'USD', status: 'pending', description: 'Conference ticket', createdAt: '2026-09-20T09:45:00Z' },
  { id: 'tr_003', direction: 'incoming', counterpartyId: 'c_110', amount: 32000, currency: 'UAH', status: 'completed', description: 'Скинулись на подарунок', createdAt: '2026-09-21T12:00:00Z' },
  { id: 'tr_004', direction: 'outgoing', counterpartyId: 'c_109', amount: 5000, currency: 'EUR', status: 'completed', description: 'Bücher', createdAt: '2026-09-23T16:16:00Z' },
  { id: 'tr_005', direction: 'incoming', counterpartyId: 'c_404', amount: 100000, currency: 'UAH', status: 'completed', description: 'Повернення', createdAt: '2026-09-25T10:30:00Z' },
  { id: 'tr_006', direction: 'outgoing', counterpartyId: 'c_107', amount: 250000, currency: 'UAH', status: 'completed', description: 'Ноутбук б/в', createdAt: '2026-09-27T14:09:00Z' },
  { id: 'tr_007', direction: 'incoming', counterpartyId: 'c_108', amount: 18000, currency: 'UAH', status: 'completed', description: 'Піца', createdAt: '2026-09-29T19:47:00Z' },
  { id: 'tr_008', direction: 'outgoing', counterpartyId: 'c_103', amount: 60000, currency: 'UAH', status: 'completed', description: 'Ремонт велосипеда', createdAt: '2026-10-01T08:00:00Z' },
  { id: 'tr_009', direction: 'incoming', counterpartyId: 'c_105', amount: 20000, currency: 'PLN', status: 'pending', description: 'Za bilety', createdAt: '2026-10-03T11:11:00Z' },
  { id: 'tr_010', direction: 'outgoing', counterpartyId: 'c_101', amount: 7500, currency: 'UAH', status: 'completed', description: 'Таксі', createdAt: '2026-10-05T15:20:00Z' },
  { id: 'tr_011', direction: 'incoming', counterpartyId: 'c_102', amount: 45000, currency: 'UAH', status: 'completed', description: 'Оренда паркомісця (вересень)', createdAt: '2026-10-06T17:33:00Z' },
  { id: 'tr_012', direction: 'outgoing', counterpartyId: 'c_106', amount: 12000, currency: 'USD', status: 'completed', description: 'Shared subscription', createdAt: '2026-10-08T09:02:00Z' },
  { id: 'tr_013', direction: 'outgoing', counterpartyId: 'c_110', amount: 35000, currency: 'UAH', status: 'failed', description: 'Комуналка', createdAt: '2026-10-09T13:55:00Z' },
  { id: 'tr_014', direction: 'incoming', counterpartyId: 'c_109', amount: 40000, currency: 'EUR', status: 'completed', description: 'Rückzahlung', createdAt: '2026-10-10T21:18:00Z' },
  { id: 'tr_015', direction: 'outgoing', counterpartyId: 'c_108', amount: 150000, currency: 'UAH', status: 'completed', description: 'Внесок на відпустку', createdAt: '2026-10-12T10:40:00Z' },
  { id: 'tr_016', direction: 'outgoing', counterpartyId: 'c_107', amount: 9900, currency: 'UAH', status: 'completed', description: 'Кава на всіх', createdAt: '2026-10-14T12:05:00Z' },
  { id: 'tr_017', direction: 'incoming', counterpartyId: 'c_103', amount: 210000, currency: 'UAH', status: 'completed', description: 'Оплата за підробіток', createdAt: '2026-10-15T19:12:00Z' },
  { id: 'tr_018', direction: 'outgoing', counterpartyId: 'c_109', amount: 15000, currency: 'EUR', status: 'failed', description: 'Kurs Deutsch', createdAt: '2026-10-16T08:30:00Z' },
  { id: 'tr_019', direction: 'outgoing', counterpartyId: 'c_404', amount: 30000, currency: 'UAH', status: 'completed', description: 'Подарунок', createdAt: '2026-10-17T16:45:00Z' },
  { id: 'tr_020', direction: 'incoming', counterpartyId: 'c_101', amount: 50000, currency: 'UAH', status: 'completed', description: 'Повернення боргу', createdAt: '2026-10-18T11:00:00Z' },
  { id: 'tr_021', direction: 'outgoing', counterpartyId: 'c_105', amount: 80000, currency: 'PLN', status: 'completed', description: 'Zwrot za mieszkanie', createdAt: '2026-10-19T14:27:00Z' },
  { id: 'tr_022', direction: 'outgoing', counterpartyId: 'c_102', amount: 45000, currency: 'UAH', status: 'pending', description: 'Оренда паркомісця', createdAt: '2026-10-20T20:03:00Z' },
  { id: 'tr_023', direction: 'incoming', counterpartyId: 'c_106', amount: 25000, currency: 'USD', status: 'completed', description: 'Freelance invoice #42', createdAt: '2026-10-21T09:15:00Z' },
  { id: 'tr_024', direction: 'outgoing', counterpartyId: 'c_101', amount: 125000, currency: 'UAH', status: 'completed', description: 'За квитки на концерт', createdAt: '2026-10-21T18:42:00Z' },
];

export const users = [
  { id: 'u_1', name: 'Олена Коваленко', email: 'olena@example.com', city: 'Київ' },
  { id: 'u_2', name: 'Андрій Шевчук', email: 'andrii@example.com', city: 'Львів' },
  { id: 'u_3', name: 'Ірина Бондар', email: 'iryna@example.com', city: 'Одеса' },
  { id: 'u_4', name: 'Дмитро Лисенко', email: 'dmytro@example.com', city: 'Харків' },
  { id: 'u_5', name: 'Катерина Мельник', email: 'kateryna@example.com', city: 'Дніпро' },
  { id: 'u_6', name: 'Оксана Ткаченко', email: 'oksana@example.com', city: 'Київ' },
  { id: 'u_7', name: 'Віктор Гнатюк', email: 'viktor@example.com', city: 'Вінниця' },
];

const productNames = [
  'Ноутбук Lenovo ThinkPad', 'Ноутбук Apple MacBook Air', 'Ноутбук ASUS Zenbook', 'Монітор Dell 27"',
  'Монітор LG UltraFine', 'Мишка Logitech MX Master', 'Мишка Apple Magic Mouse', 'Клавіатура Keychron K2',
  'Клавіатура Logitech MX Keys', 'Навушники Sony WH-1000XM5', 'Навушники AirPods Pro', 'Навушники JBL Tune',
  'Смартфон iPhone 16', 'Смартфон Samsung Galaxy S25', 'Смартфон Google Pixel 9', 'Планшет iPad Air',
  'Планшет Samsung Tab S9', 'Павербанк Xiaomi 20000', 'Кабель USB-C 2 м', 'Зарядка Anker 65W',
  'Веб-камера Logitech C920', 'Мікрофон Shure MV7', 'Колонка JBL Flip 6', 'Роутер TP-Link Archer',
  'SSD Samsung 1TB', 'SSD Kingston 512GB', 'Флешка SanDisk 128GB', 'Підставка для ноутбука',
  'Крісло офісне', 'Стіл з регулюванням висоти',
];

export const products = productNames.map((name, i) => ({
  id: `p_${String(i + 1).padStart(3, '0')}`,
  name,
  price: 49900 + ((i * 7919) % 90) * 100000, // minor units, UAH
}));
