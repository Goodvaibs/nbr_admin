import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, FormsModule, Form, FormArray, FormBuilder, Validators} from '@angular/forms';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { first } from 'rxjs/operators';
import { NavbarService } from '../../../../../core/services/navbar.service';
import { CategoryService } from '../../../../../core/services/category.service';
import { RecordService } from '../../../../../core/services/record.service';

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
  video

  user_id = this.route.snapshot.params.id;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private navbarService:NavbarService,
    private catService: CategoryService,
    private recordService: RecordService
  ) { }

  ngOnInit() {
    this.getVideo();
  }

  //Controls for form
  createForm() {
    this.loading = true;
    this.Form = this.fb.group({
      video_link: [this.video.video_link, Validators.required]
    });
  }
  get f() { return this.Form.controls; }

  onSubmit() {
    console.log(this.Form.value);

    this.submitted = true;
    let body = {
      id: 1,
      video_link: this.f.video_link.value
    }

    if (this.Form.invalid) {
      console.log("sd");
      return;
    } else {
      this.recordService.UpdateVideo(body).subscribe(res => {
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 1500
        }).then( () => {
          // location.reload();
          this.router.navigate(['/admin/homevideo/']);
        });
      });
    }
  }

  getVideo() {
    this.recordService.getVideoId(1).subscribe(res => {
      console.log(res);
      this.video = res.message;
      this.createForm();
    });
  }

}
