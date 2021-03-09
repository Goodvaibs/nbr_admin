import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, FormsModule, Form, FormArray, FormBuilder, Validators} from '@angular/forms';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { first } from 'rxjs/operators';
import { NavbarService } from '../../../../../core/services/navbar.service';
import { CategoryService } from '../../../../../core/services/category.service';

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

  user_id = this.route.snapshot.params.id;
  sub_id = this.route.snapshot.params.id2;
  subData
  fileData:File;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private navbarService:NavbarService,
    private catService: CategoryService
  ) { }

  ngOnInit() {
    this.getSubCat();
  }

  //Controls for form
  createForm() {
    this.loading = true;
    this.Form = this.fb.group({
      name: [this.subData.name, Validators.required]
    });
  }
  get f() { return this.Form.controls; }

  onSubmit() {
    console.log(this.Form.value);

    this.submitted = true;
    let body = {
      id: this.sub_id,
      category_id: this.user_id,
      name: this.f.name.value
    }

    const formData = new FormData();
    if(this.fileData) {
      formData.append('image', this.fileData);
    }
    formData.append('id', this.sub_id);
    formData.append('name', this.f.name.value);
    formData.append('category_id', this.user_id);

    if (this.Form.invalid) {
      console.log("sd");
      return;
    } else {
      this.catService.UpdateSubCategory(body).subscribe(res => {
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 1500
        }).then( () => {
          // location.reload();
          this.router.navigate(['/admin/subcategory/list/', this.user_id]);
        });
      });
    }
  }

  getSubCat() {
    this.catService.getSubCatById(this.sub_id).subscribe(res => {
      this.subData = res.data;
      this.createForm();
    });
  }

  fileUpload(fileInput) {
    this.fileData = <File>fileInput.target.files[0];
    console.log(this.fileData);
  }


}
