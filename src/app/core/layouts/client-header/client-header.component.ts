import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderServiceService } from 'src/app/core/services/dynamic-script-loader-service.service'

@Component({
  selector: 'app-client-header',
  templateUrl: './client-header.component.html',
  styleUrls: ['./client-header.component.css']
})
export class ClientHeaderComponent implements OnInit {

  constructor(
    private dynamicScriptLoader: DynamicScriptLoaderServiceService
  ) { 
    this.loadExternalStyles('../../../../assets/client/css/bootstrap.css');
    this.loadExternalStyles('../../../../assets/client/css/style.css');
    this.loadExternalStyles('../../../../assets/client/css/animate.min.css');
    this.loadExternalStyles('../../../../assets/client/css/custom/global.css');
    this.loadScripts();
  }

  ngOnInit() {
  }

  private loadExternalStyles(styleUrl: string) {
    return new Promise((resolve, reject) => {
      const styleElement = document.createElement('link');
      styleElement.href = styleUrl;
      styleElement.rel = 'stylesheet';
      styleElement.type = 'text/css';
      styleElement.onload = resolve;
      document.head.appendChild(styleElement);
    });
  }
  
  private loadScripts() {
    // You can load multiple scripts by just providing the key as argument into load method of the service
    this.dynamicScriptLoader.load('jquery', 'bootstrap', 'wow', 'countries').then(data => {
      // Script Loaded Successfully
    }).catch(error => console.log(error));
  }
}
