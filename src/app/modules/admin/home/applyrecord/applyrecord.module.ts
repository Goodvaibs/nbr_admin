import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplyrecordRoutingModule } from './applyrecord-routing.module';
import { ApplyrecordComponent } from './applyrecord.component';
import { ViewComponent } from './view/view.component';


@NgModule({
  declarations: [ApplyrecordComponent, ViewComponent],
  imports: [
    CommonModule,
    ApplyrecordRoutingModule
  ]
})
export class ApplyrecordModule { }
