import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, FormsModule, Form, FormArray, FormBuilder, Validators} from '@angular/forms';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { first } from 'rxjs/operators';
import { UsersService } from 'src/app/core/services/users.service';
import { MasterApisService } from 'src/app/core/services/master-apis.service';

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
  languages = [];
  countries = [];
  states = [];
  userData;
  user_id = this.route.snapshot.params.id;

  gender = [
    {id: 1, name: 'Male'},
    {id: 2, name: 'Female'},
    {id: 3, name: 'Others'}
  ];

  //ng date
  bsInlineValue = new Date();
  bsInlineRangeValue: Date[];
  maxDate = new Date();

  constructor(
    private renderer: Renderer2, 
    private el: ElementRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UsersService,
    private masterApiService: MasterApisService
  ) { }

  ngOnInit() {
    this.getUserRoles();
  }

  //Controls for form
  createForm() {
    this.loading = true;
    this.Form = this.fb.group({
      firstname: [this.userData.first_name, Validators.required],
      middlename: [this.userData.middle_name],
      lastname: [this.userData.last_name, Validators.required],
      email: [this.userData.email, Validators.required],
      // cemail: [''],
      mobile: ['', Validators.required],
      // password: [''],
      // c_password: [''],
      gender: [null, Validators.required],
      dob: ['', Validators.required],
      country_code: ['', Validators.required],
      language: [this.userData.language, Validators.required],
      role: [null, Validators.required],
      country: [null, Validators.required],
      state: [null, Validators.required],
      // knowledge: ['', Validators.required],
      // profile_image: ['', Validators.required],
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
    else {
      console.log("dsd");
      this.loading = true;
      this.userService.registerUser(this.Form.value).pipe(first())
      .subscribe(
          data => {
            Swal.fire({
              icon: 'success',
              title: data.message,
              showConfirmButton: false,
              timer: 1500
            }).then( () => {
              this.router.navigate([this.returnUrl]);
            });
              
          },
          error => {
              // this.alertService.error(error);
              this.error = error.message
              this.loading = false;
          });
    }
  }

  getUserRoles() {
    this.masterApiService.getFrontEndUserRoles().subscribe(res => {
      this.userRoles = res.data;
      this.getLanguages();
    });
  }

  getLanguages() {
    this.masterApiService.getLanguages().subscribe(res => {
      this.languages = res.data;
      this.getCountries({});
    });
  }

  getCountries(payload) {
    this.masterApiService.getCountries(payload).subscribe(res => {
      this.countries = res.data;
      this.getUserDetails(this.user_id);
    });
  }

  getState(country_id) {
    console.log(country_id);
    let payload = {
      "country_id": country_id
    }
    this.masterApiService.getCountries(payload).subscribe(res => {
      this.states = res.data;
    });
  }

  getUserDetails(user_id) {
    this.userService.getUserDetails(user_id).subscribe(res => {
      console.log(res);
      this.userData = res.data;
      this.createForm();
    });
  }

}
