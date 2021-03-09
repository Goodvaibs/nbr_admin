import { Component, OnInit, AfterViewInit, ViewChild, Renderer } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NavbarService } from 'src/app/core/services/navbar.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  NavList:any;
  loaded = false;

  constructor(
    private navService: NavbarService,
    private renderer: Renderer,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getNavList();
  }

  getNavList() {
    this.navService.NavList().subscribe(res=> {
      console.log(res);
      this.NavList = res.data;
      this.loaded = true;
    });
  }

  deleteNav(id) {
    this.navService.DeleteNav(id).subscribe(res => {
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
