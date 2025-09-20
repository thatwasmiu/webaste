import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'week-spend',
        title: 'week spending',
        loadComponent: () =>
          import('./components/week-spend/week-spend.component').then(
            (c) => c.WeekSpendConponent
          ),
      },
    ]),
  ],
  exports: [RouterModule],
})
export class SpendasteRouting {}
