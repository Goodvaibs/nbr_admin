import { Component, OnInit, AfterViewInit, ViewChild, Renderer } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { UsersService } from 'src/app/core/services/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements AfterViewInit, OnInit {

  //datatables
  // @ViewChild(DataTableDirective, { static: false })
  // dtElement: DataTableDirective;

  dtOptions: any = {};
  // dtTrigger: Subject<any> = new Subject();

  //custom
  loaded = false;
  users: any; //stores user list
  returnUrl: string;

  constructor(
    private userService: UsersService,
    private renderer: Renderer,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/users/list';
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      searching: false,
      responsive: true,
      serverSide: true,
      processing: true,
      autoWidth: false,
      paging: true,
      lengthMenu: [10, 25, 50, 100],
      dom: 'Bfrtip',
      // Configure the buttons
      ajax: (dataTablesParameters: any, callback) => {
        console.log(dataTablesParameters);
        dataTablesParameters.Page = ((dataTablesParameters.start) / parseInt(dataTablesParameters.length) + 1);
        that.userService.userList(dataTablesParameters).subscribe(resp => {
          console.log(resp);
            callback({
              recordsTotal: resp.data.total,
              recordsFiltered: resp.data.total,
              data: resp.data.data
            });
          });
      },
      columns: [
        { title: 'First Name', data: 'first_name', orderable: false },
        { title: 'Last Name', data: 'last_name', orderable: false },
        { title: 'Status', data: 'status', orderable: false},
        {
          title: 'Action',
          data: 'id',
          render: function (data: any, type: any, full: any) {
            return '<a class="btn btn-warning" id="'+data+'" view-user="'+data+'"><i class="fa fa-eye"></i></a><a class="btn btn-info" id="'+data+'" edit-user="'+data+'"><i class="fa fa-pencil"></i></a><a class="btn btn-success" id="'+data+'" delete-user="'+data+'"><i class="fa fa-trash-o"></i></a>';
          }
        }
      ],
      buttons: [
        {
          text: '<i class="fa fa-plus"></i> Add User',
          key: '1',
          className: 'btn btn-warning',
          action: function (e, dt, node, config) {
            that.router.navigate(["admin/users/add"]);
          }
        }
      ]
    };
  }

  ngAfterViewInit(): void {
    this.renderer.listenGlobal('document', 'click', (event) => {
      if (event.target.hasAttribute("view-user")) {
        this.router.navigate(["admin/users/view/" + event.target.getAttribute("view-user")]);
      }
      if (event.target.hasAttribute("edit-user")) {
        this.router.navigate(["admin/users/edit/" + event.target.getAttribute("edit-user")]);
      }
      if (event.target.hasAttribute("delete-user")) {
        // this.router.navigate(["admin/users/view/" + event.target.getAttribute("view-user")]);
        this.deleteUser(event.target.getAttribute("delete-user"), 'delete');
      }

    });
  }

  deleteUser(user_id, status) {
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
      },
      error => {
          // this.alertService.error(error);
      //     this.error = error.message
      //     this.loading = false;
      // }
    });
  }

}
