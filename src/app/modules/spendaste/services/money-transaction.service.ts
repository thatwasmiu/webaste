import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MoneyTransaction, WeekSpend } from '../models/spendaste.model';

@Injectable()
export class MoneyTransactionService {
  constructor(private http: HttpClient) {}

  getWeekSpend(yearWeek: number) {
    return this.http.get<WeekSpend>('/sp/api/money-transaction/' + yearWeek);
  }

  create(transaction: MoneyTransaction) {
    return this.http.post<WeekSpend>(
      '/sp/api/money-transaction/create',
      transaction
    );
  }
}
