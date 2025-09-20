import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WeekSpend } from '../models/spendaste.model';

@Injectable()
export class MoneyTransactionService {
  constructor(private http: HttpClient) {}

  getWeekSpend(yearWeek: number) {
    console.log(yearWeek);
    return this.http.get<WeekSpend>('/sp/api/money-transaction/' + yearWeek);
  }
}
