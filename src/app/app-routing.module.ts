import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import(`./modules/admin/admin.module`).then(m => m.AdminModule)
  },
  { path: '',   redirectTo: '/admin', pathMatch: 'full' },
  // {
  //   path: '',
  //   loadChildren: () => import(`./modules/client/client.module`).then(m => m.ClientModule)
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
