import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, FormsModule, Form, FormArray, FormBuilder, Validators} from '@angular/forms';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { first } from 'rxjs/operators';
import { NavbarService } from '../../../../../core/services/navbar.service';

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
  navData;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private navService: NavbarService
  ) { }


  ngOnInit() {
    this.getNavDetails();
  }

  //Controls for form
  createForm() {
    this.loading = true;
    this.Form = this.fb.group({
      name: [this.navData.name, Validators.required],
      url: [this.navData.url, Validators.required],
      sort_order: [this.navData.sort_order, Validators.required],
      is_child_present: [this.navData.is_child_present, Validators.required],
      is_static: [this.navData.is_static, Validators.required],
      in_footer: [this.navData.in_footer, Validators.required],
    });
  }
  get f() { return this.Form.controls; }

  onSubmit() {
    console.log(this.Form.value);

    this.submitted = true;

    let body = {
      id: this.user_id,
      name: this.f.name.value,
      url: this.f.url.value,
      sort_order: this.f.sort_order.value,
      is_child_present: this.f.is_child_present.value,
      is_static: this.f.is_static.value,
      in_footer: this.f.in_footer.value
    }

    if (this.Form.invalid) {
      console.log("sd");
      return;
    } else {
      this.navService.updateNavbar(body).subscribe(res => {
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 1500
        }).then( () => {
          // location.reload();
          this.router.navigate(['/admin/navbar/']);
        });
      });
    }
  }

  getNavDetails() {
    this.navService.getNavById(this.user_id).subscribe(res => {
      console.log(res)
      this.navData = res.data[0];
      this.createForm();
    });
  }

}
