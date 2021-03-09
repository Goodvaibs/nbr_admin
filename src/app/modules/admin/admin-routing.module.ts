import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminHeaderComponent } from 'src/app/core/layouts/admin-header/admin-header.component'
import { AdminGuardGuard } from 'src/app/core/guards/admin-guard.guard';


const routes: Routes = [
  {
    path: '',
    canActivate: [AdminGuardGuard],
    component: AdminHeaderComponent,
    loadChildren: () =>
      import(`./home/home.module`).then(m => m.HomeModule)

  },
  {
    path: '',
    loadChildren: () =>
      import(`./index/index.module`).then(m => m.IndexModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
