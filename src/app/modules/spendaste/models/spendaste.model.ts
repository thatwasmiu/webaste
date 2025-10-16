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
  amount?: number; // BigDecimal -> usually string
  categoryId?: number; // nullable in Java
}

export interface WeekSpend {
  dayTransactions: DayTransaction[]; // list of transactions
  cashSpend: number; // BigDecimal → string
  digitalSpend: number; // BigDecimal → string
}

export interface DayTransaction {
  date: number;
  transactions: MoneyTransaction[]; // list of transactions
  cashSpend: string; // BigDecimal → string
  digitalSpend: string; // BigDecimal → string
}

export interface MonthBalance extends BaseEntity {
  monthYearUser?: number; // @Id (Long)
  yearMonth?: number; // e.g. 202509 for September 2025
  userId?: number;
  digitalBalance?: number; // BigDecimal → string
  cashBalance?: number; // BigDecimal → string
  monthBudget?: MonthBudget;
  monthSpend?: MonthSpend;
  monthReceive?: MonthReceive;
  weekOfMonth?: number[];
  currentCash?: number;
  currentDigital?: number;
}
export interface MonthBudget {
  budget?: number; // BigDecimal → string, nullable
  extraIncrease?: number; // BigDecimal → string
  increaseReason?: string;
}
export interface MonthSpend {
  digitalSpend?: number; // BigDecimal → string
  cashSpend?: number; // BigDecimal → string
  lastMonthSpend?: number; // BigDecimal → string
}

export interface MonthReceive {
  digitalReceive?: number; // BigDecimal → string
  cashReceive?: number; // BigDecimal → string
}

export interface MonthReceive {
  digitalReceive?: number; // BigDecimal → string
  cashReceive?: number; // BigDecimal → string
}

export interface WeekReport {
  yearWeek?: number;
  totalCount?: number;
  cashIncluded?: number;
  cashExcluded?: number;
  digitalIncluded?: number;
  digitalExcluded?: number;
}

export interface MonthTransactionRatio {
  totalCount?: number;
  spendIncluded?: number;
  receiveIncluded?: number;
  spendToReceive?: number;
  receiveToSpend?: number;
}
