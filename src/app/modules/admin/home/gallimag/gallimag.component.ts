import { Component, OnInit, AfterViewInit, ViewChild, Renderer } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NavbarService } from 'src/app/core/services/navbar.service';
import { GallimageService } from 'src/app/core/services/gallimage.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gallimag',
  templateUrl: './gallimag.component.html',
  styleUrls: ['./gallimag.component.css']
})
export class GallimagComponent implements OnInit {

  NavList:any;
  loaded = false;

  constructor(
    private navService: NavbarService,
    private renderer: Renderer,
    private router: Router,
    private route: ActivatedRoute,
    private gallService: GallimageService
  ) { }

  ngOnInit() {
    this.getNavList();
  }

  getNavList() {
    this.gallService.imageList().subscribe(res=> {
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

  copyText(val: string){
    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    }

    deleteImage(id) {
      this.gallService.deleteImage(id).subscribe(res => {
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
