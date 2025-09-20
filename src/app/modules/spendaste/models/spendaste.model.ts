export interface BaseEntity {
  created?: number; // Long -> number (timestamp)
  updated?: number; // Long -> number (timestamp)
  createdBy?: string;
  updatedBy?: string;
}

export enum TransactionType {
  OUTGOING_INCLUDED = 'OUTGOING_INCLUDED', // counted as spending
  OUTGOING_EXCLUDED = 'OUTGOING_EXCLUDED', // outgoing but ignored (e.g. transfer to savings)
  OUTGOING_PENDING = 'OUTGOING_PENDING', // outgoing but undecided
  INCOMING_INCLUDED = 'INCOMING_INCLUDED', // counted as income
  INCOMING_EXCLUDED = 'INCOMING_EXCLUDED', // income but ignored (e.g. internal transfer)
  INCOMING_PENDING = 'INCOMING_PENDING', // incoming but undecided
}

export enum TransactionMethod {
  CASH = 'CASH',
  DIGITAL = 'DIGITAL',
}

export interface MoneyTransaction extends BaseEntity {
  id?: number;
  name?: string;
  type?: TransactionType; // enum
  userId?: number;
  method?: TransactionMethod; // enum
  date?: number; // timestamp (Java Long)
  yearMonth?: number; // readonly in backend -> optional here
  yearWeek?: number; // same
  amount?: string; // BigDecimal -> usually string
  categoryId?: number; // nullable in Java
}

export interface WeekSpend {
  daySpends: DaySpend[]; // list of transactions
  cashSpend: string; // BigDecimal → string
  digitalSpend: string; // BigDecimal → string
}

export interface DaySpend {
  date: number;
  transactions: MoneyTransaction[]; // list of transactions
  cashSpend: string; // BigDecimal → string
  digitalSpend: string; // BigDecimal → string
}

export interface MonthBalance extends BaseEntity {
  monthYearUser?: number; // @Id (Long)
  yearMonth?: number; // e.g. 202509 for September 2025
  userId?: number;
  digitalBalance?: string; // BigDecimal → string
  cashBalance?: string; // BigDecimal → string
  monthBudget?: MonthBudget;
  monthSpend?: MonthSpend;
}
export interface MonthBudget {
  budget?: string; // BigDecimal → string, nullable
  extraIncrease?: string; // BigDecimal → string
  increaseReason?: string;
}
export interface MonthSpend {
  digitalSpend?: string; // BigDecimal → string
  cashSpend?: string; // BigDecimal → string
  lastMonthSpend?: string; // BigDecimal → string
}
