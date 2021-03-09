import { Component, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormService } from 'src/app/core/services/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  loaded = false
  records;
  user_id = this.route.snapshot.params.id;

  constructor(
    private formService: FormService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getApply();
  }

  getApply() {
    this.formService.getReportById(this.user_id).subscribe(res => {
      console.log(res);
      this.records = res.data;
      this.loaded = true;
    });
  }

  cleanURL(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
