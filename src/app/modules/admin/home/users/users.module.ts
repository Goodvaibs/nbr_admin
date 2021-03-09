import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';

import { UsersRoutingModule } from './users-routing.module';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddComponent, ViewComponent, EditComponent, ListComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    DataTablesModule,
    NgSelectModule, 
    FormsModule,
    BsDatepickerModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
