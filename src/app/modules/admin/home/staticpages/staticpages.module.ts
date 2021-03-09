import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticpagesRoutingModule } from './staticpages-routing.module';
import { StaticpagesComponent } from './staticpages.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';



@NgModule({
  declarations: [StaticpagesComponent],
  imports: [
    CommonModule,
    StaticpagesRoutingModule,
    CKEditorModule,
    NgSelectModule,
    ReactiveFormsModule,
    DataTablesModule,
    FormsModule,
    BsDatepickerModule
  ]
})
export class StaticpagesModule { }
