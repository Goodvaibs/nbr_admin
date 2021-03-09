import { Component, OnInit, AfterViewInit, ViewChild, Renderer } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NavbarService } from 'src/app/core/services/navbar.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { RecordService } from 'src/app/core/services/record.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-homevedio',
  templateUrl: './homevedio.component.html',
  styleUrls: ['./homevedio.component.css']
})
export class HomevedioComponent implements OnInit {



  NavList:any;
  loaded = false;
  recordList;
  video

  record_id = this.route.snapshot.params.id;

  constructor(
    private navService: NavbarService,
    private renderer: Renderer,
    private router: Router,
    private route: ActivatedRoute,
    private catService: CategoryService,
    private recordService: RecordService
  ) { }

  ngOnInit() {
    console.log(this.record_id);
    this.getVideo();
  }

  deleteNav(id) {
    this.recordService.DeleteRecord(id).subscribe(res => {
      console.log(res);
      if(res.status) {
        Swal.fire({
            icon: 'success',
            title: res.message,
            showConfirmButton: false,
            timer: 1500
          }).then( () => {
            location.reload();
            // this.router.navigate([this.returnUrl]);
          });
        }
    });
  }

  getRecord() {
    this.recordService.recordList(this.record_id).subscribe(res => {
      this.recordList = res.data;
      this.loaded = true;
    });
  }

  getVideo() {
    this.recordService.getVideoId(1).subscribe(res => {
      this.video = res.message;
      this.loaded = true;
    });
  }

}
