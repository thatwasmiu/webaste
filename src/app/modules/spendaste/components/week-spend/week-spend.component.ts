import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MoneyTransactionService } from 'src/app/modules/spendaste/services/money-transaction.service';
import { WeekSpend } from '../../models/spendaste.model';

@Component({
  selector: 'app-sc-logistics-list',
  templateUrl: './week-spend.template.html',
  styleUrls: ['./week-spend.style.scss'],
  standalone: true,
  imports: [CommonModule, TableModule],
  providers: [MoneyTransactionService],
})
export class WeekSpendConponent implements OnInit, AfterViewInit {
  weekSpend: WeekSpend;
  public constructor(private moneyTransactionService: MoneyTransactionService) {
    this.moneyTransactionService.getWeekSpend(202538).subscribe({
      next: (res) => {
        this.weekSpend = res;
      },
    });
  }

  ngOnInit(): void {}
  ngAfterViewInit(): void {}
  products = [
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5,
    },
  ];
}
