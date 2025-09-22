import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MoneyTransactionService } from 'src/app/modules/spendaste/services/money-transaction.service';
import { MonthBalance, WeekSpend } from '../../models/spendaste.model';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MonthBalanceService } from '../../services/month-blance.service';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sc-logistics-list',
  templateUrl: './week-spend.template.html',
  styleUrls: ['./week-spend.style.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CalendarModule,
    FormsModule,
    DropdownModule,
    InputNumberModule,
    ButtonModule
  ],
  providers: [MoneyTransactionService, MonthBalanceService],
})
export class WeekSpendConponent implements OnInit, AfterViewInit {
  week;
  month;
  year;
  date: Date;

  monthBalance: MonthBalance = {weekOfMonth: Array.from({ length: 53 }, (_, i) => i + 1)}
  weekSpend: WeekSpend = { daySpends: [], cashSpend: '0', digitalSpend: '0' };
  public constructor(private moneyTransactionService: MoneyTransactionService, private monthBalanceService: MonthBalanceService) {
    this.setDate(new Date());
    this.getMonthSpend();
  }

  ngOnInit(): void {}
  ngAfterViewInit(): void {}

  setDate(date: Date) {
    this.date = date;
    const firstOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfWeek = firstOfYear.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

    // previousOrSame Monday logic
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    // Explanation:
    // If Jan 1 is Sunday (0), go back 6 days to Monday
    // Else go back (dayOfWeek - 1) days to Monday

    const firstMonday = new Date(firstOfYear);
    firstMonday.setDate(firstOfYear.getDate() + diffToMonday);

    // Days since first Monday
    const diffDays = Math.floor(
      (date.getTime() - firstMonday.getTime()) / (24 * 60 * 60 * 1000)
    );
    this.week = Math.floor(diffDays / 7) + 1;
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
  }

  selectYearMonth(date: Date): void {
    this.setDate(date);
    this.getMonthSpend();
  }

  selectWeek(week): void {
    this.week = week.value;
    this.getWeekSpend();
  }

  addTransaction() {
    console.log('test')
  }

  getMonthSpend() {
    forkJoin({
      monthBalance: this.monthBalanceService.getMonthBalance(this.year * 100 + this.month),
      weekSpend: this.moneyTransactionService.getWeekSpend(this.year * 100 + this.week)
    }).subscribe({
      next: ({ monthBalance, weekSpend }) => {
        this.monthBalance = monthBalance;
        this.weekSpend = weekSpend;
      },
      error: err => {
        console.error('Error:', err);
      }
    });
  }

  getWeekSpend() {
    if (!this.week || !this.year) return;
    const yearWeek = this.year * 100 + this.week;
    this.moneyTransactionService.getWeekSpend(yearWeek).subscribe({
      next: (res) => {
        this.weekSpend = res;
      },
    });
  }

}
