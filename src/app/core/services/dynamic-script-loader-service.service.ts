import { Injectable } from '@angular/core';

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  //client
  { name: 'jquery', src: '../../../../assets/client/js/jquery-1.11.1.min.js' },
  { name: 'bootstrap', src: '../../../../assets/client/js/bootstrap.min.js' },
  { name: 'wow', src: '../../../../assets/client/js/wow.min.js' },
  { name: 'countries', src: '../../../../assets/client/js/countries.js' },
  //admin
  { name: 'jquerymin', src: '../../../../assets/admin/js/jquery.min.js' },
  { name: 'metis', src: '../../../../assets/admin/js/metisMenu.min.js' },
  { name: 'custom', src: '../../../../assets/admin/js/custom.js' },
  { name: 'd3', src: '../../../../assets/admin/js/d3.v3.js' },
  { name: 'rickshaw', src: '../../../../assets/admin/js/rickshaw.js' },
  { name: 'underscore', src: '../../../../assets/admin/js/underscore-min.js' },
  { name: 'moment', src: '../../../../assets/admin/js/moment-2.2.1.js' },
  { name: 'clndr', src: '../../../../assets/admin/js/clndr.js' },
  { name: 'site', src: '../../../../assets/admin/js/site.js' },
  { name: 'vmap', src: '../../../../assets/admin/js/jquery.vmap.js' },
  { name: 'sampledata', src: '../../../../assets/admin/js/jquery.vmap.sampledata.js' },
  { name: 'world', src: '../../../../assets/admin/js/jquery.vmap.world.js' },
  //bootstrapmin
];

declare var document: any;

@Injectable({
  providedIn: 'root'
})
export class DynamicScriptLoaderServiceService {

  private scripts: any = {};

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
        //load script
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {  //IE
          script.onreadystatechange = () => {
            if (script.readyState === "loaded" || script.readyState === "complete") {
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              resolve({ script: name, loaded: true, status: 'Loaded' });
            }
          };
        } else {  //Others
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({ script: name, loaded: true, status: 'Loaded' });
          };
        }
        script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      }
    });
  }
}
