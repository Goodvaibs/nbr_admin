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
import { RecordService } from 'src/app/core/services/record.service';
import { CategoryService } from 'src/app/core/services/category.service'

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
  cat;
  subcat;
  recordData;

  record_id = this.route.snapshot.params.id;
  id2 = this.route.snapshot.params.id2;

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
    private recordService: RecordService,
    private catService: CategoryService
  ) {

      const currentAdminUser = this.authenticationService.currentAdminValue;
      console.log('Bearer ' + currentAdminUser['data'].token);
      this.ckEditorConfig = {
        extraPlugins: 'embed,autoembed,image2',
        embed_provider : '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}',
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
    this.getCategory();
    this.getRecordByid();
  }

  //Controls for form
  createForm() {
    this.loading = true;
    this.Form = this.fb.group({
      name: [this.recordData.name,Validators.required],
      description: [this.recordData.name,Validators.required],
      title: [this.recordData.name,Validators.required],
      mini_title: [this.recordData.name,Validators.required],
      body: [this.recordData.name,Validators.required],
      youtube_link: [this.recordData.name,Validators.required]
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
    formData.append('name', this.f.name.value);
    formData.append('title', this.f.title.value);
    formData.append('description', this.f.description.value);
    formData.append('mini_title', this.f.mini_title.value);
    formData.append('body', this.f.body.value);
    formData.append('youtube_link', this.f.youtube_link.value);
    formData.append('category_id', this.recordData.category_id);
    formData.append('subcategory_id', this.recordData.subcategory_id);
    formData.append('id', this.recordData.id);

    if (this.Form.invalid) {
      console.log("sd");
      return;
    }
    else {
      console.log("dsd");
      this.loading = true;
      this.recordService.AddRecord(formData).pipe(first())
        .subscribe(
          data => {
            Swal.fire({
              icon: 'success',
              title: data.message,
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.router.navigate(['/admin/record/list/', this.id2]);
            });

          },
          error => {
            // this.alertService.error(error);
            this.error = error.message
            this.loading = false;
          });
    }
  }

  getCategory() {
    this.catService.catList().subscribe(res => {
      this.cat = res.data;
    });
  }

  getSubCategory(event) {
    this.catService.subcatList(event.id).subscribe(res => {
      this.subcat = res.data;
    });
  }

  getRecordByid() {
    this.recordService.getRecById(this.record_id).subscribe(res => {
      this.recordData = res.data;
      this.createForm();
    });
  }

}
