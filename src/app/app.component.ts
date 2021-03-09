import { Component } from '@angular/core';

import { NgxUiLoaderDemoService } from 'src/app/core/services/ngx-ui-loader-demo.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NBR';

  constructor(
    public loaderService: NgxUiLoaderDemoService
  ) {

  }
}
