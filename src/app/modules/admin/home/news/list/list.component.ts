import { Component, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NavbarService } from 'src/app/core/services/navbar.service';
import { NewsService } from 'src/app/core/services/news.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  NavList:any;
  loaded = false;

  nav_id = this.route.snapshot.params.id;

  constructor(
    private navService: NavbarService,
    private router: Router,
    private route: ActivatedRoute,
    private newsServie: NewsService
  ) { }

  ngOnInit() {
    this.getNewsList();
  }

  getNewsList() {
    this.newsServie.newsList().subscribe(res=> {
      console.log(res);
      this.NavList = res.data;
      this.loaded = true;
    });
  }

  deleteSubNav(id) {
    this.navService.deleteSubNav(id).subscribe(res => {
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

  deleteNews(id) {
    this.newsServie.deleteNews(id).subscribe(res => {
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
