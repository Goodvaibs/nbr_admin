import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PillarsComponent } from './pillars.component';


const routes: Routes = [
  { 
    path: '', 
    component: PillarsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PillarsRoutingModule { }
