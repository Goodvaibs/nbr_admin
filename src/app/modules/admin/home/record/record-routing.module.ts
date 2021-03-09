import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { RecordComponent } from './record.component';


const routes: Routes = [
  {
    path: 'add/:id',
    component: AddComponent
  },
  {
    path: 'edit/:id/:id2',
    component: EditComponent
  },
  {
    path: 'list/:id',
    component: RecordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordRoutingModule { }
