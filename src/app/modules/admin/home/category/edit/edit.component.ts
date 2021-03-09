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
  cats

  user_id = this.route.snapshot.params.id;
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
    this.getCategoryByid();
  }

  //Controls for form
  createForm() {
    this.loading = true;
    this.Form = this.fb.group({
      name: [this.cats.name, Validators.required]
    });
  }
  get f() { return this.Form.controls; }

  onSubmit() {
    console.log(this.Form.value);

    this.submitted = true;
    const formData = new FormData();
    if(this.fileData) {
      formData.append('image', this.fileData);
    }
    formData.append('name', this.f.name.value);

    if (this.Form.invalid) {
      console.log("sd");
      return;
    } else {
      this.catService.UpdateCategory(formData).subscribe(res => {
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 1500
        }).then( () => {
          // location.reload();
          this.router.navigate(['/admin/category/']);
        });
      });
    }
  }

  getCategoryByid() {
    this.catService.getCatById(this.user_id).subscribe(res => {
      this.cats = res.data;
      this.createForm();
    });
  }

  fileUpload(fileInput) {
    this.fileData = <File>fileInput.target.files[0];
    console.log(this.fileData);
  }



}
