import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportrecordRoutingModule } from './reportrecord-routing.module';
import { ReportrecordComponent } from './reportrecord.component';
import { ViewComponent } from './view/view.component';


@NgModule({
  declarations: [ReportrecordComponent, ViewComponent],
  imports: [
    CommonModule,
    ReportrecordRoutingModule
  ]
})
export class ReportrecordModule { }
