import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MonthBalance, MonthTransactionRatio, WeekReport } from '../models/spendaste.model';

@Injectable()
export class MonthBalanceService {
  constructor(private http: HttpClient) {}

  getMonthBalance(yearMonth: number) {
    return this.http.get<MonthBalance>('month-balance/' + yearMonth);
  }

  update(monthBalance: MonthBalance) {
    return this.http.post<MonthBalance>('month-balance/update', monthBalance);
  }

  getWeekMoneyInMonth(yearWeek: number) {
    return this.http.get<WeekReport[]>('money-report/weekly',
      {
        params: { yearWeek: yearWeek }
      }
    )
  }

  getTransactionRatio(yearMonth: number) {
    return this.http.get<MonthTransactionRatio>('money-report/ratio',
      {
        params: { yearMonth: yearMonth }
      }
    )
  }
}
