import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientHeaderComponent } from 'src/app/core/layouts/client-header/client-header.component'


const routes: Routes = [
  { 
    path: 'home', 
    loadChildren: () => import(`./home/home.module`).then(m => m.HomeModule)
  },
  { 
    path: '',
    component: ClientHeaderComponent,
    children: [
      {
        path: '',
        loadChildren: () => import(`./index/index.module`).then(m => m.IndexModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
