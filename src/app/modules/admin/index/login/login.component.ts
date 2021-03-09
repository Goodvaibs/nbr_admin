import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';
import { DynamicScriptLoaderServiceService } from 'src/app/core/services/dynamic-script-loader-service.service';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

//Services
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //Basic Variables
  Form: FormGroup;
  returnUrl: string;
  error: '';

  //Flags
  loading = false;
  submitted = false;

  //Custom Variables

  constructor(
    private dynamicScriptLoader: DynamicScriptLoaderServiceService,
    private renderer: Renderer2, 
    private el: ElementRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { 
    this.renderer.addClass(document.body, 'img-login');
    this.loadExternalStyles('../../../../assets/admin/css/bootstrap.min.css');
    this.loadExternalStyles('../../../../assets/admin/css/style.css');
    this.loadExternalStyles('../../../../assets/admin/css/lines.css');
    this.loadExternalStyles('../../../../assets/admin/css/font-awesome.css');
    this.loadExternalStyles('../../../../assets/admin/css/custom.css');
    this.loadExternalStyles('../../../../assets/admin/css/clndr.css');
    this.loadExternalStyles('../../../../assets/admin/css/jqvmap.css');
    this.loadScripts();
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
    this.createForm();
  }

  //Load template specific stylesheets
  private loadExternalStyles(styleUrl: string) {
    return new Promise((resolve, reject) => {
      const styleElement = document.createElement('link');
      styleElement.href = styleUrl;
      styleElement.rel = 'stylesheet';
      styleElement.type = 'text/css';
      styleElement.onload = resolve;
      document.head.appendChild(styleElement);
    });
  }
  
  //Load template specific javascripts
  private loadScripts() {
    // You can load multiple scripts by just providing the key as argument into load method of the service
    //'jquerymin', 'metis', 'd3', 'rickshaw', 'underscore', 'moment', 'clndr', 'site', 'vmap', 'sampledata', 'world', 'bootstrap'
    this.dynamicScriptLoader.load('jquerymin', 'bootstrap').then(data => {
      // Script Loaded Successfully
    }).catch(error => console.log(error));
  }

  //Controls for form
  createForm() {
    this.Form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.Form.controls; }

  onSubmit() {
    console.log('Username:-'+this.f.username.value+', Pass:-'+ this.f.password.value);

    this.submitted = true;

    if (this.Form.invalid) {
      return;
    }
    else {
      this.loading = true;
        this.authService.adminLogin(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                  Swal.fire({
                    icon: 'success',
                    title: data.message,
                    showConfirmButton: false,
                    timer: 1500
                  }).then( () => {
                    // location.reload();
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

}
