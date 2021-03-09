import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddModule } from './add/add.module';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { StaticpagesComponent } from './staticpages.component';


const routes: Routes = [
  {
    path: 'add',
    loadChildren: () => import(`./add/add.module`).then(m => m.AddModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import(`./edit/edit.module`).then(m => m.EditModule)
  },
  {
    path: '',
    component: StaticpagesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticpagesRoutingModule { }
