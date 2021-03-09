import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientHeaderComponent } from 'src/app/core/layouts/client-header/client-header.component';
import { ClientNavbarComponent } from 'src/app/core/layouts/client-navbar/client-navbar.component';
import { ClientSidebarComponent } from 'src/app/core/layouts/client-sidebar/client-sidebar.component';
import { ClientFooterComponent } from 'src/app/core/layouts/client-footer/client-footer.component';
import { ClientRightSidebarComponent } from 'src/app/core/layouts/client-right-sidebar/client-right-sidebar.component';

@NgModule({
  declarations: [
    ClientHeaderComponent,
    ClientNavbarComponent,
    ClientSidebarComponent,
    ClientFooterComponent,
    ClientRightSidebarComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
