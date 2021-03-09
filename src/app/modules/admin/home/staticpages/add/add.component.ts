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
import { environment } from '../../../../../../environments/environment';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

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
  Design;
  selectedBody;
  url = environment.url;

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
    this.getDesign();

      const currentAdminUser = this.authenticationService.currentAdminValue;
      console.log('Bearer ' + currentAdminUser['data'].token);
      this.ckEditorConfig = {
        extraPlugins: 'embed,autoembed,image2',
        embed_provider : '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}',
        stylesSet: this.url+'assets/user/css/style.css',
        extraAllowedContent: '*(*)',
        filebrowserUploadMethod: 'form',
        filebrowserUploadUrl: environment.apiUrl+'upload-image-ckeditor',
        fileTools_requestHeaders: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': 'Bearer ' + currentAdminUser['data'].token
        },
        allowedContent : true
      }
  }


  ngOnInit() {
    this.getNavList();
    this.createForm();
  }

  //Controls for form
  createForm() {
    this.loading = true;
    this.Form = this.fb.group({
      navbar_id: [null,Validators.required],
      subnavbar_id: [null],
      body: ['', Validators.required],
      button_name: ['', Validators.required],
      button_url: ['', Validators.required],
      title: ['', Validators.required],
      title_image: ['', Validators.required],
      title_description: ['', Validators.required]
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
    formData.append('title_image', this.fileData);
    if(this.f.subnavbar_id.value == null) {
      formData.append('subnavbar_id', null);
    } else {
      formData.append('subnavbar_id', this.f.subnavbar_id.value);
    }
    formData.append('navbar_id', this.f.navbar_id.value);

    formData.append('body', this.f.body.value);
    formData.append('button_name', this.f.button_name.value);
    formData.append('button_url', this.f.button_url.value);
    formData.append('title_description', this.f.title_description.value);
    formData.append('title', this.f.title.value);

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

  getDesign() {
    this.staticService.getMasterPagesDesign().subscribe(res => {
      this.Design = res.data;
      console.log(this.Design);
    });
  }

  getDesChange(id) {
    console.log(id);
    this.Design.forEach(element => {
      if(element.id == id.id)  {
        this.selectedBody = element.body;
        console.log(this.selectedBody);
        this.Form.patchValue({body: this.selectedBody});
      }
    });
  }

}
