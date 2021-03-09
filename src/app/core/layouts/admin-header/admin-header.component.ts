import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderServiceService } from 'src/app/core/services/dynamic-script-loader-service.service'

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

  constructor(
    private dynamicScriptLoader: DynamicScriptLoaderServiceService,
  ) { 
    this.loadExternalStyles('../../../../assets/admin/css/bootstrap.min.css');
    this.loadExternalStyles('../../../../assets/admin/css/style.css');
    this.loadExternalStyles('../../../../assets/admin/css/lines.css');
    this.loadExternalStyles('../../../../assets/admin/css/font-awesome.css');
    this.loadExternalStyles('../../../../assets/admin/css/custom.css');
    this.loadExternalStyles('../../../../assets/admin/css/clndr.css');
    this.loadExternalStyles('../../../../assets/admin/css/jqvmap.css');
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
    //'jquerymin', 'metis', 'd3', 'rickshaw', 'underscore', 'moment', 'clndr', 'site', 'vmap', 'sampledata', 'world', 'bootstrap'
    this.dynamicScriptLoader.load('metis', 'custom', 'underscore', 'moment', 'clndr', 'site', 'bootstrap').then(data => {
      // Script Loaded Successfully
    }).catch(error => console.log(error));
  }

}
