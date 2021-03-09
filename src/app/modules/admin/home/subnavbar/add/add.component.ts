import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, FormsModule, Form, FormArray, FormBuilder, Validators} from '@angular/forms';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { first } from 'rxjs/operators';
import { NavbarService } from '../../../../../core/services/navbar.service';

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

  nav_id = this.route.snapshot.params.id;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private navbarService:NavbarService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  //Controls for form
  createForm() {
    this.loading = true;
    this.Form = this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
      sort_order: ['', Validators.required],
      is_static: ['', Validators.required],
      in_footer: ['', Validators.required],
    });
  }
  get f() { return this.Form.controls; }

  onSubmit() {
    console.log(this.Form.value);

    this.submitted = true;
    let body = {
      name: this.f.name.value,
      url: this.f.url.value,
      sort_order: this.f.sort_order.value,
      navbar_id: this.nav_id,
      is_static: this.f.is_static.value,
      in_footer: this.f.in_footer.value
    }

    if (this.Form.invalid) {
      console.log("sd");
      return;
    } else {
      this.navbarService.AddSubNavbar(body).subscribe(res => {
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 1500
        }).then( () => {
          // location.reload();
          this.router.navigate(['/admin/subnavbar/list/', this.nav_id]);
        });
      });
    }
  }

}
