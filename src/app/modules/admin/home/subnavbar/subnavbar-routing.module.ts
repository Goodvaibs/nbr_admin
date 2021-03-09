import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubnavbarComponent } from './subnavbar.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';


const routes: Routes = [{
  path: 'list/:id',
  component: SubnavbarComponent
},
{
  path: 'add/:id',
  component: AddComponent
},
{
  path: 'edit/:id/:id2',
  component: EditComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubnavbarRoutingModule { }
