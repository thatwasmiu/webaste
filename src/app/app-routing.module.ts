import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('src/app/modules/home/home.component').then(
        (c) => c.HomeConponent
      ),
  },
  {
    path: 'spendaste',
    loadChildren: () =>
      import('src/app/modules/spendaste/spendaste.module').then(
        (m) => m.SpendasteModule
      ),
  },
  {
    path: 'notfound',
    title: '404 Notfound',
    loadComponent: () =>
      import('./pages/notfound/notfound.component').then(
        (c) => c.NotfoundComponent
      ),
  },
  { path: '**', redirectTo: '/notfound' }, // Wildcard route for handling 404s
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
