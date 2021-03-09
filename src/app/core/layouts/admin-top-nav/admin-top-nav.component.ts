import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin-top-nav',
  templateUrl: './admin-top-nav.component.html',
  styleUrls: ['./admin-top-nav.component.css']
})
export class AdminTopNavComponent implements OnInit {

  returnUrl: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
  }

  logout() {
    let status = this.authService.adminLogout();
    if(status == true) {
      Swal.fire({
        icon: 'success',
        title: 'Logout successfull..!!',
        showConfirmButton: false,
        timer: 1500,
        onClose: () => {
          location.reload(true);
      }
      });
    }
    // else {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Logout unsuccessfull..!!',
    //     showConfirmButton: false,
    //     timer: 1500
    //   }).then( () => {
    //     this.router.navigate([this.returnUrl]);
    //   });
    // }
  }

}
