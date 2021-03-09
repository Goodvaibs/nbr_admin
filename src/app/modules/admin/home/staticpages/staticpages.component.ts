import { Component, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { StaticpagesService } from 'src/app/core/services/staticpages.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-staticpages',
  templateUrl: './staticpages.component.html',
  styleUrls: ['./staticpages.component.css']
})
export class StaticpagesComponent implements OnInit {

  NavList:any;
  loaded = false;

  staticList;

  constructor(
    private staticService: StaticpagesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit() {
    this.getStaticPages();
  }

  getStaticPages() {
    this.staticService.getStaticList().subscribe(res => {
      console.log(res);
      this.staticList = res.data;
      this.loaded = true;
    });
  }

  deleteStaticPage(id) {
    this.staticService.deleteStaticPage(id).subscribe(res => {
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

}
