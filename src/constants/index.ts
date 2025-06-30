// src/constants/index.ts
export const PaymentProvider = ['Zelle', 'Venmo', 'Cash App'] as const;

export const TRANSACTION_REGEX = {
  Zelle: /Zelle: You received \$?([\d.]+) from (.+?) on (\d{2}\/\d{2}\/\d{4}).*?Memo: (\d{6})/i,
  Venmo: /Venmo: (.+?) paid you \$?([\d.]+) – "(\d{6})" on (\d{2}\/\d{2}\/\d{4})/i,
  CashApp: /Cash App: You received \$?([\d.]+) from (.+?) on (\d{2}\/\d{2}\/\d{4}).*?Note: (\d{6})/i,
};