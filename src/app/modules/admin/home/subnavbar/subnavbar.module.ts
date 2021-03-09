import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubnavbarRoutingModule } from './subnavbar-routing.module';
import { SubnavbarComponent } from './subnavbar.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [SubnavbarComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    SubnavbarRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgSelectModule,
    FormsModule,
    BsDatepickerModule
  ]
})
export class SubnavbarModule { }
