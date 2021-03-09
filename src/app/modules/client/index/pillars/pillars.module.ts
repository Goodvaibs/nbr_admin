import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PillarsRoutingModule } from './pillars-routing.module';
import { PillarsComponent } from './pillars.component';


@NgModule({
  declarations: [PillarsComponent],
  imports: [
    CommonModule,
    PillarsRoutingModule
  ]
})
export class PillarsModule { }
