import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MoneyTransactionService } from 'src/app/modules/spendaste/services/money-transaction.service';
import {
  DaySpend,
  MoneyTransaction,
  MonthBalance,
  WeekSpend,
} from '../../models/spendaste.model';
import { CalendarModule } from 'primeng/calendar';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { MonthBalanceService } from '../../services/month-blance.service';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from 'src/app/core/auth/auth.service';

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
    ReactiveFormsModule,
    DropdownModule,
    InputNumberModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
  ],
  providers: [MoneyTransactionService, MonthBalanceService],
})
export class WeekSpendConponent implements OnInit, AfterViewInit {
  week;
  month;
  year;
  date: Date;

  addSpendDialogVisible = false;
  userId;

  monthBalance: MonthBalance = {
    weekOfMonth: Array.from({ length: 53 }, (_, i) => i + 1),
  };
  weekSpend: WeekSpend = { daySpends: [], cashSpend: '0', digitalSpend: '0' };
  public constructor(
    private moneyTransactionService: MoneyTransactionService,
    private monthBalanceService: MonthBalanceService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.userId = authService.getUserId();
    this.setDate(new Date());
    this.getMonthSpend();
    this.transactionForm = this.fb.group({
      name: [null, Validators.required],
      amount: [null, [Validators.required]],
      type: [null, [Validators.required]],
      method: [null, [Validators.required]],
    });
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

  editedDaySpend: DaySpend;
  transactionForm: FormGroup;
  addTransaction(daySpend) {
    this.editedDaySpend = daySpend;
    this.addSpendDialogVisible = true;
    this.transactionForm.reset();
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      let transaction: MoneyTransaction = {
        date: this.editedDaySpend.date,
        userId: this.userId,
        ...this.transactionForm.getRawValue(),
      };

      this.moneyTransactionService.create(transaction).subscribe({
        next: (res) => {
          console.log(res);
          this.addSpendDialogVisible = false;
          this.getMonthSpend();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  getMonthSpend() {
    forkJoin({
      monthBalance: this.monthBalanceService.getMonthBalance(
        this.year * 100 + this.month
      ),
      weekSpend: this.moneyTransactionService.getWeekSpend(
        this.year * 100 + this.week
      ),
    }).subscribe({
      next: ({ monthBalance, weekSpend }) => {
        this.monthBalance = monthBalance;
        this.weekSpend = weekSpend;
      },
      error: (err) => {
        console.error('Error:', err);
      },
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
