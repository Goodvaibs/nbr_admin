import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordRoutingModule } from './record-routing.module';
import { RecordComponent } from './record.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

import { CKEditorModule } from 'ckeditor4-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [RecordComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    RecordRoutingModule,
    CKEditorModule,
    NgSelectModule,
    ReactiveFormsModule,
    DataTablesModule,
    FormsModule,
    BsDatepickerModule
  ]
})
export class RecordModule { }
