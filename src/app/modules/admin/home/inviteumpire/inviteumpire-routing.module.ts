import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InviteumpireComponent } from './inviteumpire.component';
import { ViewComponent } from './view/view.component';


const routes: Routes = [
  {
    path: 'view/:id',
    component: ViewComponent
  },
  {
    path: '',
    component: InviteumpireComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InviteumpireRoutingModule { }
