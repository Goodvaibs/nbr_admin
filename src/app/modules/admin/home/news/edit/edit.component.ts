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
import { NewsService } from 'src/app/core/services/news.service';

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

  user_id = this.route.snapshot.params.id;
  newsdetails;

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
    private authenticationService: AuthService,
    private newsService: NewsService
  ) {

      const currentAdminUser = this.authenticationService.currentAdminValue;
      console.log('Bearer ' + currentAdminUser['data'].token);
      this.ckEditorConfig = {
        stylesSet: 'http://localhost:4200/assets/user/css/style.css',
        extraAllowedContent: '*(*)',
        filebrowserUploadMethod: 'form',
        filebrowserUploadUrl: 'http://127.0.0.1:8000/api/upload-image-ckeditor',
        fileTools_requestHeaders: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': 'Bearer ' + currentAdminUser['data'].token
        },
        allowedContent : true
      }
  }


  ngOnInit() {
    this.getNewsDetails();
  }

  //Controls for form
  createForm() {
    this.loading = true;
    this.Form = this.fb.group({
      body: [this.newsdetails.body, Validators.required],
      cover_image: ['', Validators.required],
      publish_date: [this.newsdetails.publish_date, Validators.required],
      title: [this.newsdetails.title, Validators.required],
      subtitle: [this.newsdetails.subtitle, Validators.required],
      author_name: [this.newsdetails.author_name, Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.Form.controls; }

  fileUpload(fileInput) {
    this.fileData = <File>fileInput.target.files[0];
    console.log(this.fileData);
  }

  getNewsDetails() {
    this.newsService.getNewsByid(this.user_id).subscribe(res => {
      this.newsdetails = res.data;
      this.createForm();
    });
  }

  onSubmit() {
    console.log(this.Form);
    console.log(this.Form.value);

    this.submitted = true;

    const formData = new FormData();
    formData.append('cover_image', this.fileData);
    formData.append('body', this.f.body.value);
    formData.append('publish_date', this.f.publish_date.value);
    formData.append('author_name', this.f.author_name.value);
    formData.append('subtitle', this.f.subtitle.value);
    formData.append('title', this.f.title.value);
    formData.append('id', this.user_id);

    if (this.Form.invalid) {
      console.log("sd");
      return;
    }
    else {
      console.log("dsd");
      this.loading = true;
      this.newsService.AddNews(formData).pipe(first())
        .subscribe(
          data => {
            Swal.fire({
              icon: 'success',
              title: data.message,
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.router.navigate(['/admin/news/list']);
            });

          },
          error => {
            // this.alertService.error(error);
            this.error = error.message
            this.loading = false;
          });
    }
  }


}
