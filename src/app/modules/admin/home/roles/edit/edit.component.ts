import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, FormsModule, Form, FormArray, FormBuilder, Validators} from '@angular/forms';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { first } from 'rxjs/operators';

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

  constructor(
    private renderer: Renderer2, 
    private el: ElementRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  //Controls for form
  createForm() {
    this.loading = true;
    this.Form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.Form.controls; }

  onSubmit() {
    console.log(this.Form.value);

    this.submitted = true;

    if (this.Form.invalid) {
      console.log("sd");
      return;
    }
    // else {
    //   console.log("dsd");
    //   this.loading = true;
    //   this.userService.registerUser(this.Form.value).pipe(first())
    //   .subscribe(
    //       data => {
    //         Swal.fire({
    //           icon: 'success',
    //           title: data.message,
    //           showConfirmButton: false,
    //           timer: 1500
    //         }).then( () => {
    //           this.router.navigate([this.returnUrl]);
    //         });
              
    //       },
    //       error => {
    //           // this.alertService.error(error);
    //           this.error = error.message
    //           this.loading = false;
    //       });
    // }
  }

}
