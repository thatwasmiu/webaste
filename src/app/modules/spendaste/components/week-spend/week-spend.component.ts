import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MoneyTransactionService } from 'src/app/modules/spendaste/services/money-transaction.service';
import { WeekSpend } from '../../models/spendaste.model';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

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
  ],
  providers: [MoneyTransactionService],
})
export class WeekSpendConponent implements OnInit, AfterViewInit {
  weekSpend: WeekSpend = { daySpends: [], cashSpend: '0', digitalSpend: '0' };
  public constructor(private moneyTransactionService: MoneyTransactionService) {
    this.setWeekOfYear(new Date());
    this.moneyTransactionService.getWeekSpend(202538).subscribe({
      next: (res) => {
        this.weekSpend = res;
      },
    });
  }

  ngOnInit(): void {
    this.weeks = Array.from({ length: 53 }, (_, i) => ({
      label: `${i + 1}`,
      value: i + 1,
    }));
  }
  ngAfterViewInit(): void {}

  weekOfYear;
  year;
  date: Date;
  weeks: any[] = [];

  setWeekOfYear(date: Date) {
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
    this.weekOfYear = Math.floor(diffDays / 7) + 1;
    this.year = date.getFullYear();
  }

  selectDate(date: Date): void {
    console.log(date);
    this.date = date;
    this.year = date.getFullYear;
    if (!date) {
      console.error('Date is required');
      return;
    }

    // const firstOfYear = new Date(date.getFullYear(), 0, 1);
    // const dayOfWeek = firstOfYear.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

    // // previousOrSame Monday logic
    // const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    // // Explanation:
    // // If Jan 1 is Sunday (0), go back 6 days to Monday
    // // Else go back (dayOfWeek - 1) days to Monday

    // const firstMonday = new Date(firstOfYear);
    // firstMonday.setDate(firstOfYear.getDate() + diffToMonday);

    // // Days since first Monday
    // const diffDays = Math.floor(
    //   (date.getTime() - firstMonday.getTime()) / (24 * 60 * 60 * 1000)
    // );
    // this.weekOfYear = Math.floor(diffDays / 7) + 1;
    // this.year = date.getFullYear();
  }
}
