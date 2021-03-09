import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Form, FormArray, FormBuilder, Validators } from '@angular/forms';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { first } from 'rxjs/operators';
import { PagesService } from 'src/app/core/services/pages.service';
import { NavbarService } from 'src/app/core/services/navbar.service';
import { StaticpagesService } from 'src/app/core/services/staticpages.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

   //Basic Variables
   Form: FormGroup;
   returnUrl: string;
   error: '';

   //Flags
   loading = false;
   submitted = false;

   //custom
   userRoles = [];
   countries = [];
   states = [];
   navType = [];
   pageType = [];
   languages = [];
   navList = [];
   subNavList = [];
   fileData:File;

   ckEditorConfig;
   nav_id = this.route.snapshot.params.id;
   staticData;

   constructor(
     private renderer: Renderer2,
     private el: ElementRef,
     private fb: FormBuilder,
     private router: Router,
     private route: ActivatedRoute,
     private pagesService: PagesService,
     private navService: NavbarService,
     private staticService: StaticpagesService,
     private elem: ElementRef,
     private authenticationService: AuthService
   ) {

       const currentAdminUser = this.authenticationService.currentAdminValue;
       console.log('Bearer ' + currentAdminUser['data'].token);
       this.ckEditorConfig = {
         stylesSet: 'http://localhost:4200/assets/user/css/style.css',
         extraAllowedContent: '*(*)',
         filebrowserUploadMethod: 'form',
         filebrowserUploadUrl: 'https://nbrserver.herokuapp.com/api/upload-image-ckeditor',
         fileTools_requestHeaders: {
           'X-Requested-With': 'XMLHttpRequest',
           'Authorization': 'Bearer ' + currentAdminUser['data'].token
         },
         allowedContent : true
       }
   }


   ngOnInit() {
     this.getNavList();
     this.getStaticPageById();
   }

   //Controls for form
   createForm() {
     this.loading = true;
     this.Form = this.fb.group({
       body: [this.staticData.body, Validators.required],
       button_name: [this.staticData.button_name, Validators.required],
       button_url: [this.staticData.button_url, Validators.required],
       title: [this.staticData.title, Validators.required],
       title_image: [''],
       title_description: [this.staticData.title_description, Validators.required]
     });
   }

   // convenience getter for easy access to form fields
   get f() { return this.Form.controls; }

   fileUpload(fileInput) {
     this.fileData = <File>fileInput.target.files[0];
     console.log(this.fileData);
   }

   onSubmit() {
     console.log(this.Form);
     console.log(this.Form.value);

     this.submitted = true;

     const formData = new FormData();

     if(this.fileData) {
      formData.append('title_image', this.fileData);
     }

     formData.append('navbar_id', this.staticData.navbar_id);
     formData.append('subnavbar_id', this.staticData.subnavbar_id);
     formData.append('body', this.f.body.value);
     formData.append('button_name', this.f.button_name.value);
     formData.append('button_url', this.f.button_url.value);
     formData.append('title_description', this.f.title_description.value);
     formData.append('title', this.f.title.value);
     formData.append('id', this.nav_id);

     // let body = {
     //   navbar_id: this.f.navbar_id.value,
     //   subnavbar_id: this.f.subnavbar_id.value,
     //   body: this.f.body.value,
     //   button_name: this.f.button_name.value,
     //   button_url: this.f.button_url.value,
     //   title: this.f.title.value,
     //   title_image: this.fileData,
     //   title_description: this.f.title_description.value
     // }

     if (this.Form.invalid) {
       console.log("sd");
       return;
     }
     else {
       console.log("dsd");
       this.loading = true;
       this.staticService.AddStaticPage(formData).pipe(first())
         .subscribe(
           data => {
             Swal.fire({
               icon: 'success',
               title: data.message,
               showConfirmButton: false,
               timer: 1500
             }).then(() => {
               this.router.navigate(['/admin/staticpage/']);
             });

           },
           error => {
             // this.alertService.error(error);
             this.error = error.message
             this.loading = false;
           });
     }
   }

   getNavList() {
     this.navService.NavList().subscribe(res => {
       console.log();
       this.navList = res.data;
     });
   }

   getSubnavbar(event) {
     console.log(event.id);
     this.navService.subNavList(event.id).subscribe(res => {
       console.log(res);
       this.subNavList = res.data;
     });
   }

   getStaticPageById() {
    this.staticService.getStaticPageById(this.nav_id).subscribe(res => {
      console.log(res);
      this.staticData = res.data;
      this.createForm();
    });
   }

}
