import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InviteumpireRoutingModule } from './inviteumpire-routing.module';
import { InviteumpireComponent } from './inviteumpire.component';
import { ViewComponent } from './view/view.component';


@NgModule({
  declarations: [InviteumpireComponent, ViewComponent],
  imports: [
    CommonModule,
    InviteumpireRoutingModule
  ]
})
export class InviteumpireModule { }
