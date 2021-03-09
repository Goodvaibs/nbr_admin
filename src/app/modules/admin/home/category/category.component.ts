import { Component, OnInit, AfterViewInit, ViewChild, Renderer } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NavbarService } from 'src/app/core/services/navbar.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  NavList:any;
  loaded = false;

  constructor(
    private navService: NavbarService,
    private renderer: Renderer,
    private router: Router,
    private route: ActivatedRoute,
    private catService: CategoryService
  ) { }

  ngOnInit() {
    this.getNavList();
  }

  getNavList() {
    this.catService.catList().subscribe(res=> {
      console.log(res);
      this.NavList = res.data;
      this.loaded = true;
    });
  }

  deleteNav(id) {
    this.catService.DeleteCat(id).subscribe(res => {
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
