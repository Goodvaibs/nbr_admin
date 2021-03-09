import { Component, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormService } from 'src/app/core/services/form.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-priorityapp',
  templateUrl: './priorityapp.component.html',
  styleUrls: ['./priorityapp.component.css']
})
export class PriorityappComponent implements OnInit {

  loaded = false
  records;

  constructor(
    private formService: FormService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getApply();
  }

  getApply() {
    this.formService.getPriorList().subscribe(res => {
      console.log(res);
      this.records = res.data;
      this.loaded = true;
    });
  }

  deleteApply(id) {
    this.formService.deletePrior(id).subscribe(res => {
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
