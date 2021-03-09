import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute} from '@angular/router';
import { UsersService } from 'src/app/core/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  user_id: any;
  userData: any;
  loaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UsersService
  ) {
    this.user_id = route.snapshot.params.id;
   }

  ngOnInit() {
    this.getUserDetails(this.user_id);
  }

  getUserDetails(user_id) {
    this.userService.getUserDetails(user_id).subscribe(res => {
      console.log(res);
      this.userData = res.data;
      this.loaded = true;
    });
  }

  changeStatus(user_id, status) {
    this.userService.updateUserStatus(user_id, status).subscribe(res => {
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
