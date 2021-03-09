import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GallimagComponent } from './gallimag.component';
import { AddComponent } from './add/add.component';


const routes: Routes = [
  {
    path: 'add',
    component: AddComponent
  },
  {
    path: '',
    component: GallimagComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GallimagRoutingModule { }
