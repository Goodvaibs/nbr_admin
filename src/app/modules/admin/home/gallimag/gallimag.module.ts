import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GallimagRoutingModule } from './gallimag-routing.module';
import { GallimagComponent } from './gallimag.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [GallimagComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    GallimagRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgSelectModule,
    FormsModule,
    BsDatepickerModule
  ]
})
export class GallimagModule { }
