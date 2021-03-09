import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientHalfLayoutComponent } from './core/layouts/client-half-layout/client-half-layout.component';

//system
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

//custom plugins
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION,
  PB_DIRECTION, NgxUiLoaderRouterModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';

//Guards
import { AdminGuardGuard } from 'src/app/core/guards/admin-guard.guard';
import { UserGuardGuard } from 'src/app/core/guards/user-guard.guard';

//Services
import { CookieService } from 'ngx-cookie-service';
import { EncrDecrServiceService } from 'src/app/core/services/encr-decr-service.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NgxUiLoaderDemoService } from 'src/app/core/services/ngx-ui-loader-demo.service'

//Interceptors
import { BasicAuthInterceptor } from 'src/app/core/interceptors/basic-auth.interceptor';
import { ErrorInterceptor } from 'src/app/core/interceptors/error.interceptor';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//ngx loader config
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'red',
  bgsType: "three-strings",
  fgsType: "three-strings",
  blur: 15,
  overlayColor: "rgb(40,40,40)",
  // bgsOpacity: 0.5,
  // bgsPosition: POSITION.bottomCenter,
  // bgsSize: 60,
  // bgsType: SPINNER.rectangleBounce,
  fgsColor: '#fa4b2a',
  // fgsPosition: POSITION.centerCenter,
  // fgsSize: 60,
  // fgsType: SPINNER.chasingDots,
  logoUrl: '../../assets/images/logo11.png',
  logoSize: 200,
  pbColor: "#fa4b2a",
  // pbDirection: PB_DIRECTION.leftToRight,
  // pbThickness: 5,
  // text: 'Welcome to ngx-ui-loader',
  // textColor: '#FFFFFF',
  // textPosition: POSITION.centerCenter
};

@NgModule({
  declarations: [
    AppComponent,
    ClientHalfLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule, // import this module for showing loader automatically when navigating between app routes
    NgxUiLoaderHttpModule,
    DataTablesModule,
    NgSelectModule,
    FormsModule, BsDatepickerModule.forRoot(), BrowserAnimationsModule
  ],
  providers: [AuthService, UserGuardGuard, AdminGuardGuard, CookieService, EncrDecrServiceService, NgxUiLoaderDemoService,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
