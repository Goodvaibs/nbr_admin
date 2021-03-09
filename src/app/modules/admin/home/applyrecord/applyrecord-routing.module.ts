import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplyrecordComponent } from './applyrecord.component';
import { ViewComponent } from './view/view.component'


const routes: Routes = [
  {
    path: 'view/:id',
    component: ViewComponent
  },
  {
    path: '',
    component: ApplyrecordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplyrecordRoutingModule { }
