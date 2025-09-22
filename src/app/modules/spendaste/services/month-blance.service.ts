import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MonthBalance } from '../models/spendaste.model';

@Injectable()
export class MonthBalanceService {
  constructor(private http: HttpClient) {}

  getMonthBalance(yearMonth: number) {
    return this.http.get<MonthBalance>('/sp/api/month-balance/' + yearMonth);
  }
}
