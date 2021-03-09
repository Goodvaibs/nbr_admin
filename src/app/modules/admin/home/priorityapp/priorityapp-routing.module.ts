import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriorityappComponent } from './priorityapp.component';
import { ViewComponent } from './view/view.component'


const routes: Routes = [
  {
    path: 'view/:id',
    component: ViewComponent
  },
  {
    path: '',
    component: PriorityappComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriorityappRoutingModule { }
