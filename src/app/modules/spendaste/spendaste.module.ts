import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SpendasteRouting } from './spendaste.routing';

@NgModule({
  imports: [SpendasteRouting],
  providers: [],
  exports: [RouterModule],
})
export class SpendasteModule {}
