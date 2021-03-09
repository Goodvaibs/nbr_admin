import { Component, OnInit } from '@angular/core';
import { MasterApisService } from 'src/app/core/services/master-apis.service'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(
    private masterService: MasterApisService,
  ) { }

  ngOnInit() {
    this.getFrontendUserRoles();
  }

  getFrontendUserRoles() {
    this.masterService.getFrontEndUserRoles().subscribe(res => {
      console.log(res);
    });
  }

}
