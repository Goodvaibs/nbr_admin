import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriorityappRoutingModule } from './priorityapp-routing.module';
import { PriorityappComponent } from './priorityapp.component';
import { ViewComponent } from './view/view.component';


@NgModule({
  declarations: [PriorityappComponent, ViewComponent],
  imports: [
    CommonModule,
    PriorityappRoutingModule
  ]
})
export class PriorityappModule { }
