import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import(`./dashboard/dashboard.module`).then(m => m.DashboardModule)
  },
  {
    path: 'community',
    loadChildren: () => import(`./community/community.module`).then(m => m.CommunityModule)
  },
  {
    path: 'contact',
    loadChildren: () => import(`./contact/contact.module`).then(m => m.ContactModule)
  },
  {
    path: 'gallery',
    loadChildren: () => import(`./gallery/gallery.module`).then(m => m.GalleryModule)
  },
  {
    path: 'mission',
    loadChildren: () => import(`./mission/mission.module`).then(m => m.MissionModule)
  },
  {
    path: 'pillars',
    loadChildren: () => import(`./pillars/pillars.module`).then(m => m.PillarsModule)
  },
  {
    path: 'registration',
    loadChildren: () => import(`./registration/registration.module`).then(m => m.RegistrationModule)
  },
  { 
    path: '', 
    loadChildren: () => import(`./login/login.module`).then(m => m.LoginModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule { }
