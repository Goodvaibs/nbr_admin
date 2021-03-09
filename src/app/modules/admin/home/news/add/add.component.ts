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
import { NewsService } from 'src/app/core/services/news.service';
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
  url = environment.url;

  ckEditorConfig;

  newsBody = '<link href="'+this.url+'assets/user/css/font-awesome-4.7.0/css/font-awesome.min.css" rel="stylesheet" /><link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" media="screen" rel="stylesheet" /><link href="'+this.url+'assets/user/css/style.css" media="screen" rel="stylesheet" /><main class="main-info main-body-page">  <div class="region area-1">    <section style="background-color:#008751;color:white">      <div class="container py-5">        <h1>Rubik&#39;s cubes solved underwater in one breath by man in India</h1>        <p>By Dominic PuntPublished 25 August 2020</p>      </div>    </section>    <section class="py-5" style="background-color:whitesmoke">      <div class="container" style="background-color:white">        <div class="row" style="width: 100%">          <div class="col-md-12 col-sm-12 col-xs-12 col-lg-12">            <p style="text-align:center"><img alt="" height="455"                src="'+this.url+'assets/user/images/about/about-us.jpg" style="width: 100% !important;"                width="683" /></p>            <p>Share:</p>            <ul class="social-icons" style="display:inline-block;">              <li style="display:inline-block;">&nbsp;</li>              <li style="display:inline-block;">&nbsp;</li>              <li style="display:inline-block;">&nbsp;</li>              <li style="display:inline-block;">&nbsp;</li>              <li style="display:inline-block;">&nbsp;</li>              <li style="display:inline-block;">&nbsp;</li>              <li style="display:inline-block;">&nbsp;</li>            </ul>            <p style="color:black">Illayaram Sekar, from Chennai, India, combined physical endurance with mental skill              to achieve a new Guinness World Records title for the most Rubik&rsquo;s Cubes solved underwater, managing              six.</p>            <p style="color:black">Spending two minutes and 17 seconds underwater without breathing breaks, Illayaram              was able to beat the previous record of five Rubik&rsquo;s cubes solved.</p>            <!-- <div class="embed-responsive embed-responsive-16by9 pb-10 pt-10">                            <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/t8655cvDc48"                                allowfullscreen></iframe>                        </div> -->            <div data-oembed-url="https://www.youtube.com/embed/NbpdEetp6Hk">              <div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe                  allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen=""                  scrolling="no" src="https://www.youtube.com/embed/NbpdEetp6Hk?rel=0"                  style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"                  tabindex="-1"></iframe></div>            </div>            <p>&nbsp;</p>            <div class="col-md-12">              <p style="color:black">He trained in a special form of yoga meditation called Pranayama to spend extended                amounts of time underwater.</p>              <p style="color:black">Despite practising for this specific record for nearly two years, Illayaram                admitted he has never learned how to swim.</p>              <p style="color:black">The record attempt was performed inside a clear container which was watertight and                allowed filming equipment to capture every turn of every cube.</p>              <p style="color:black">Independent witnesses were in attendance to verify his record attempt.</p>            </div>            <p>&nbsp;</p>            <div class="pt-10 pb-10">              <p style="text-align:center"><img alt=""                  src="'+this.url+'assets/user/images/about/about-us.jpg" /></p>              ssssssss            </div>            <p>&nbsp;</p>            <div style="color:black">              <p>&ldquo;This event was a turning point in my career. Now I&rsquo;m stronger and ready to do more                records,&rdquo; Illayaram said after the attempt.</p>              <p>&ldquo;My personal opinion is this underwater category is the most difficult, that&rsquo;s why I                decided to do this first.&rdquo;</p>              <p>Illayaram first started solving Rubik&rsquo;s cubes in 2013 during his days at college.</p>              <p>&ldquo;In my college days, my friends helped me a lot.&rdquo;</p>              <p>He now works as a Rubik&rsquo;s cube trainer at different schools across Chennai and wants to attempt                more records to inspire his students.</p>            </div>            <p>&nbsp;</p>            <div class="row">              <div class="col-md-6"><img alt="" src="'+this.url+'assets/user/images/about/about-us.jpg" />              </div>              <div class="col-md-6"><img alt="" src="'+this.url+'assets/user/images/about/about-us.jpg" />              </div>            </div>            <p>&nbsp;</p>            <div style="color:black">              <p>He has already set his sights on more record-breaking feats&hellip;</p>              <p>&ldquo;I&rsquo;ve started to learn how to ride a unicycle, it&rsquo;s the next biggest category in                cubing and I have a plan to do it next year,&rdquo;</p>              <p>&ldquo;I have a plan to break Pyramix cube records and the one handed underwater record too.&rdquo;</p>              <p>The current record for most Rubik&rsquo;s cubes solved whilst on a unicycle is 250, set by American                Caleb McEvoy in 2018, while the most Pyraminx (Rubik&#39;s cubes) solved underwater is 9, achieved by                Chinmay Prabhu (India) on 9 December 2018.</p>              <p>&ldquo;I was inspired by Ashrita Furman (holder of over 200 Guinness World Records titles) and I love                the tag line Officially Amazing.&rdquo;</p>              <h3>Other Rubik&#39;s cube articles:</h3>              <ul>                <li><a href="">World&#39;s largest Rubik&#39;s Cube</a></li>                <li><a href="">Fastest time to solve a Rubik&rsquo;s Cube</a></li>                <li><a href="">How Rubik&rsquo;s Cubes helped Max Park with his autism</a></li>              </ul>            </div>            <div>              <p>Share:</p>              <ul class="social-icons" style="display:inline-block;">                <li style="display:inline-block;">&nbsp;</li>                <li style="display:inline-block;">&nbsp;</li>                <li style="display:inline-block;">&nbsp;</li>                <li style="display:inline-block;">&nbsp;</li>                <li style="display:inline-block;">&nbsp;</li>                <li style="display:inline-block;">&nbsp;</li>                <li style="display:inline-block;">&nbsp;</li>              </ul>            </div>          </div>          <div class="col-md-4 col-sm-4 col-xs-12 col-lg-4">&nbsp;</div>        </div>      </div>    </section>  </div></main>';

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
    private newsService: NewsService
  ) {

      const currentAdminUser = this.authenticationService.currentAdminValue;
      console.log('Bearer ' + currentAdminUser['data'].token);
      this.ckEditorConfig = {
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
    this.createForm();
  }

  //Controls for form
  createForm() {
    this.loading = true;
    this.Form = this.fb.group({
      body: [this.newsBody, Validators.required],
      cover_image: ['', Validators.required],
      publish_date: ['', Validators.required],
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      author_name: ['', Validators.required]
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
    formData.append('cover_image', this.fileData);
    formData.append('body', this.f.body.value);
    formData.append('publish_date', this.f.publish_date.value);
    formData.append('author_name', this.f.author_name.value);
    formData.append('subtitle', this.f.subtitle.value);
    formData.append('title', this.f.title.value);

    if (this.Form.invalid) {
      console.log("sd");
      return;
    }
    else {
      console.log("dsd");
      this.loading = true;
      this.newsService.AddNews(formData).pipe(first())
        .subscribe(
          data => {
            Swal.fire({
              icon: 'success',
              title: data.message,
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.router.navigate(['/admin/news/list']);
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
