import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHeaderComponent } from 'src/app/core/layouts/admin-header/admin-header.component';
import { AdminFooterComponent } from 'src/app/core/layouts/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from 'src/app/core/layouts/admin-sidebar/admin-sidebar.component';
import { AdminTopNavComponent } from 'src/app/core/layouts/admin-top-nav/admin-top-nav.component';

@NgModule({
  declarations: [
    AdminHeaderComponent,
    AdminSidebarComponent,
    AdminTopNavComponent,
    AdminFooterComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
