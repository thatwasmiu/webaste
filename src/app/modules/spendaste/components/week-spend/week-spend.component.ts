import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MoneyTransactionService } from 'src/app/modules/spendaste/services/money-transaction.service';
import {
  DayTransaction,
  MoneyTransaction,
  MonthBalance,
  WeekSpend,
} from '../../models/spendaste.model';
import { CalendarModule } from 'primeng/calendar';
import Chart from 'chart.js/auto';
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
import { forkJoin, map, switchMap } from 'rxjs';
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
  week: number;
  month: number;
  year: number;
  date: Date;
  userId: number;
  totalTransactions: number = 0;

  monthBalance: MonthBalance = {
    weekOfMonth: Array.from({ length: 53 }, (_, i) => i + 1),
  };
  weekSpend: WeekSpend = {
    dayTransactions: [],
    cashSpend: 0,
    digitalSpend: 0,
  };
  monhtBalanceForm: FormGroup;

  public constructor(
    private moneyTransactionService: MoneyTransactionService,
    private monthBalanceService: MonthBalanceService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.userId = this.authService.getUserId();
    this.setDate(new Date());
    this.getMonthSpend();
    this.transactionForm = this.fb.group({
      date: [null, Validators.required],
      name: [null, Validators.required],
      amount: [null, [Validators.required]],
      type: [null, [Validators.required]],
      method: [null, [Validators.required]],
    });

    this.monhtBalanceForm = this.fb.group({
      cashBalance: [null, Validators.required],
      digitalBalance: [null, Validators.required],
      budget: [null, Validators.required],
      extraIncrease: [null],
      increaseReason: [null],
    });
  }

  ngOnInit(): void {}

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

  editedTransaction: MoneyTransaction;
  transactionForm: FormGroup;
  transactionDialogVisible = false;
  addTransaction(dayTransaction: DayTransaction) {
    this.editedTransaction = { userId: this.userId, date: dayTransaction.date };
    this.transactionDialogVisible = true;
    this.transactionForm.enable();
    this.transactionForm.reset();
    this.transactionForm.patchValue({
      date: new Date(dayTransaction.date),
      type: 'OUTGOING_INCLUDED',
      method: 'DIGITAL',
    });
  }

  editTransaction(transaction: MoneyTransaction) {
    this.editedTransaction = transaction;
    this.transactionDialogVisible = true;
    this.transactionForm.enable();
    this.transactionForm.reset();
    this.transactionForm.patchValue({
      ...transaction,
      date: new Date(transaction.date),
    });
  }

  onSubmit(): void {
    if (!this.transactionForm.valid) return;

    this.transactionForm.disable();

    let formValue = this.transactionForm.getRawValue();
    let transaction: MoneyTransaction = {
      ...this.editedTransaction,
      ...formValue,
      date: formValue.date.getTime(),
    };

    let request$ = transaction.id
      ? this.moneyTransactionService.update(transaction)
      : this.moneyTransactionService.create(transaction);

    request$.subscribe({
      next: () => {
        this.transactionDialogVisible = false;
        this.getMonthSpend();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  monthBalanceDialogVisible = false;
  editMonthBalance() {
    this.monthBalanceDialogVisible = true;
    this.monhtBalanceForm.enable();
    this.monhtBalanceForm.reset();
    this.monhtBalanceForm.patchValue({
      ...this.monthBalance,
      ...this.monthBalance.monthBudget,
    });
  }

  onSubmitBalance(): void {
    if (!this.monhtBalanceForm.valid) return;
    this.monhtBalanceForm.disable();

    let formValue = this.monhtBalanceForm.getRawValue();
    let monthBalance: MonthBalance = {
      ...this.monthBalance,
      cashBalance: formValue.cashBalance,
      digitalBalance: formValue.digitalBalance,
      monthBudget: {
        budget: formValue.budget,
        extraIncrease: formValue.extraIncrease,
        increaseReason: formValue.increaseReason,
      },
    };

    this.monthBalanceService.update(monthBalance).subscribe({
      next: (res) => {
        this.monthBalanceDialogVisible = false;
        this.monthBalance = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getMonthSpend() {
    this.moneyTransactionService
      .getWeekSpend(this.year * 100 + this.week)
      .pipe(
        switchMap((weekSpend) =>
          this.monthBalanceService
            .getMonthBalance(this.year * 100 + this.month)
            .pipe(map((monthBalance) => ({ weekSpend, monthBalance })))
        )
      )
      .subscribe({
        next: ({ weekSpend, monthBalance }) => {
          this.monthBalance = monthBalance;
          this.weekSpend = weekSpend;
          this.totalTransactions = weekSpend.dayTransactions
            .map((e) => e.transactions.length)
            .reduce((sum, len) => sum + len, 0);
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

  @ViewChild('chart') chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  @ViewChild('ratioChart') ratioChartRef!: ElementRef<HTMLCanvasElement>;
  ratioChart!: Chart;

  ngAfterViewInit() {
    this.monthBalanceService
      .getWeekMoneyInMonth(this.year * 100 + this.week)
      .subscribe({
        next: (res) => {
          const data = res;

          const maxValue = Math.max(
            ...data.flatMap((d) => [
              d.cashIncluded + d.cashExcluded,
              d.digitalIncluded + d.digitalExcluded,
            ])
          );
          const maxY = maxValue <= 1000 ? 1000 : undefined;
          if (this.chart) {
            this.chart.destroy();
          }
          this.chart = new Chart(this.chartRef.nativeElement, {
            type: 'bar',
            data: {
              labels: data.map((d) => d.yearWeek),
              datasets: [
                {
                  label: 'Cash Included',
                  data: data.map((d) => d.cashIncluded),
                  backgroundColor: '#42A5F5',
                  stack: 'cash',
                  yAxisID: 'y',
                },
                {
                  label: 'Cash Excluded',
                  data: data.map((d) => d.cashExcluded),
                  backgroundColor: '#90CAF9',
                  stack: 'cash',
                  yAxisID: 'y',
                },
                {
                  label: 'Digital Included',
                  data: data.map((d) => d.digitalIncluded),
                  backgroundColor: '#66BB6A',
                  stack: 'digital',
                  yAxisID: 'y',
                },
                {
                  label: 'Digital Excluded',
                  data: data.map((d) => d.digitalExcluded),
                  backgroundColor: '#A5D6A7',
                  stack: 'digital',
                  yAxisID: 'y',
                },
                {
                  label: 'Transactions Count',
                  data: data.map((d) => d.totalCount),
                  type: 'line',
                  borderColor: '#FFA726',
                  backgroundColor: '#FFA726',
                  yAxisID: 'y1',
                  tension: 0.3,
                  fill: false,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  position: 'left',
                  max: maxY,
                  title: { display: true, text: 'Amount' },
                  stacked: true, // Important for stacking
                },
                y1: {
                  beginAtZero: true,
                  position: 'right',
                  grid: { drawOnChartArea: false },
                  title: { display: true, text: 'Total Transactions' },
                },
                x: {
                  stacked: true, // Important for stacking grouped bars
                },
              },
              plugins: {
                legend: { position: 'top' },
                title: {
                  display: true,
                  text: 'Weekly Cash vs Digital Transactions',
                },
              },
            },
          });
        },
      });

    this.monthBalanceService
      .getTransactionRatio(this.year * 100 + this.month)
      .subscribe({
        next: (res) => {
          const centerTextPlugin = {
            id: 'centerText',
            beforeDraw(chart) {
              const { ctx, data } = chart;
              const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
              const [spend, receive] = data.datasets[0].data;
              const percent = ((receive / total) * 100).toFixed(1);

              ctx.save();
              const centerX = chart.chartArea.width / 2 + chart.chartArea.left;
              const centerY = chart.chartArea.height / 2 + chart.chartArea.top;
              ctx.font = 'bold 18px Arial';
              ctx.textAlign = 'center';
              ctx.fillStyle = '#333';
              ctx.fillText(`${percent}% Receive`, centerX, centerY);
              ctx.restore();
            },
          };

          if (this.ratioChart) {
            this.ratioChart.destroy();
          }
          this.ratioChart = new Chart(this.ratioChartRef.nativeElement, {
            type: 'doughnut',
            data: {
              labels: ['Spend', 'Receive'],
              datasets: [
                {
                  data: [res.spendIncluded, res.receiveIncluded],
                  backgroundColor: ['#EF5350', '#66BB6A'],
                },
              ],
            },
            options: {
              plugins: {
                title: { display: true, text: 'Spend vs Receive Ratio' },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const total = res.receiveIncluded + res.spendIncluded;
                      const val = context.parsed;
                      const pct = ((val / total) * 100).toFixed(1);
                      return `${context.label}: ${val} (${pct}%)`;
                    },
                  },
                },
              },
            },
            plugins: [centerTextPlugin],
          });
        },
      });
  }
}
