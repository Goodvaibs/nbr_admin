import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomevedioComponent } from './homevedio/homevedio.component';
import { EditComponent } from './homevedio/edit/edit.component';


const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import(`./users/users.module`).then(m => m.UsersModule)
  },
  // {
  //   path: 'languages',
  //   loadChildren: () => import(`./languages/languages.module`).then(m => m.LanguagesModule)
  // },
  {
    path: 'admin-users',
    loadChildren: () => import(`./admin-users/admin-users.module`).then(m => m.AdminUsersModule)
  },
  {
    path: 'roles',
    loadChildren: () => import(`./roles/roles.module`).then(m => m.RolesModule)
  },
  {
    path: 'job',
    loadChildren: () => import(`./jobs/jobs.module`).then(m => m.JobsModule)
  },
  {
    path: 'ads',
    loadChildren: () => import(`./advertisement/advertisement.module`).then(m => m.AdvertisementModule)
  },
  {
    path: 'images',
    loadChildren: () => import(`./images/images.module`).then(m => m.ImagesModule)
  },
  {
    path: 'post',
    loadChildren: () => import(`./posts/posts.module`).then(m => m.PostsModule)
  },
  {
    path: 'news',
    loadChildren: () => import(`./news/news.module`).then(m => m.NewsModule)
  },
  {
    path: 'downloads',
    loadChildren: () => import(`./downloads/downloads.module`).then(m => m.DownloadsModule)
  },
  {
    path: 'contact',
    loadChildren: () => import(`./contact-us/contact-us.module`).then(m => m.ContactUsModule)
  },
  // {
  //   path: 'page',
  //   loadChildren: () => import(`./pages/pages.module`).then(m => m.PagesModule)
  // },
  {
    path: 'navbar',
    loadChildren: () => import(`./navbar/navbar.module`).then(m => m.NavbarModule)
  },
  {
    path: 'subnavbar',
    loadChildren: () => import(`./subnavbar/subnavbar.module`).then(m => m.SubnavbarModule)
  },
  {
    path: 'staticpage',
    loadChildren: () => import(`./staticpages/staticpages.module`).then(m => m.StaticpagesModule)
  },
  {
    path: 'gallimage',
    loadChildren: () => import(`./gallimag/gallimag.module`).then(m => m.GallimagModule)
  },
  {
    path: 'category',
    loadChildren: () => import(`./category/category.module`).then(m => m.CategoryModule)
  },
  {
    path: 'subcategory',
    loadChildren: () => import(`./subcategory/subcategory.module`).then(m => m.SubcategoryModule)
  },
  {
    path: 'record',
    loadChildren: () => import(`./record/record.module`).then(m => m.RecordModule)
  },
  {
    path: 'apply-record',
    loadChildren: () => import(`./applyrecord/applyrecord.module`).then(m => m.ApplyrecordModule)
  },
  {
    path: 'priority-app',
    loadChildren: () => import(`./priorityapp/priorityapp.module`).then(m => m.PriorityappModule)
  },
  {
    path: 'invite-umpire',
    loadChildren: () => import(`./inviteumpire/inviteumpire.module`).then(m => m.InviteumpireModule)
  },
  {
    path: 'report-record',
    loadChildren: () => import(`./reportrecord/reportrecord.module`).then(m => m.ReportrecordModule)
  },
  {
    path: 'homevideo',
    component: HomevedioComponent
  },
  {
    path: 'homevideo/edit/:id',
    component: EditComponent
  },
  {
    path: '',
    loadChildren: () => import(`./dashboard/dashboard.module`).then(m => m.DashboardModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
