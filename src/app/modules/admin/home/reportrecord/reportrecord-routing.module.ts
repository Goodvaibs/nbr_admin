import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportrecordComponent } from './reportrecord.component';
import { ViewComponent } from './view/view.component';


const routes: Routes = [
  {
    path: 'view/:id',
    component: ViewComponent
  },
  {
    path: '',
    component: ReportrecordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportrecordRoutingModule { }
