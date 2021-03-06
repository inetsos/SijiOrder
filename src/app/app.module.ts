import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  MatProgressBarModule,
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatDatepicker,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatOptionModule,
  MatSlideToggleModule,
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher
} from '@angular/material';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth.guard';
import { UsersResolve } from './users.resolve';
import { UserResolve } from './user.resolve';
import { MenusResolve } from './menus.resolve';
import { MenuResolve } from './menu.resolve';

import { UtilService } from './util.service';
import { AuthService } from './auth.service';
import { RequestInterceptorService } from './request-interceptor.service';
import { UserService } from './user.service';
import { MenuService } from './menu.service';
import { SettingService } from './setting.service';
import { OrdersService } from './orders.service';
import { FcmsService } from './fcms.service';

import { WelcomeComponent } from './welcome/welcome.component';
import { Error404Component } from './error404/error404.component';
import { LoginComponent } from './login/login.component';
import { UserNewComponent } from './user-new/user-new.component';
import { UserStoreComponent } from './user-store/user-store.component';
import { UserIndexComponent } from './user-index/user-index.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserShowComponent } from './user-show/user-show.component';

import { MenuIndexComponent } from './menu-index/menu-index.component';
import { MenuNewComponent } from './menu-new/menu-new.component';
import { MenuEditComponent } from './menu-edit/menu-edit.component';

import { SettingsComponent } from './settings/settings.component';
import { SettingsAddComponent } from './settings-add/settings-add.component';
import { StoresIndexComponent } from './stores-index/stores-index.component';
import { OrdersComponent } from './orders/orders.component';
import { MyordersComponent } from './myorders/myorders.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpUpdateComponent } from './sign-up-update/sign-up-update.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    Error404Component,
    LoginComponent,
    UserNewComponent,
    UserStoreComponent,
    UserIndexComponent,
    UserEditComponent,
    UserShowComponent,
    MenuIndexComponent,
    MenuNewComponent,
    MenuEditComponent,
    SettingsComponent,
    SettingsAddComponent,
    StoresIndexComponent,
    OrdersComponent,
    MyordersComponent,
    SignUpComponent,
    SignUpUpdateComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    ScrollToModule.forRoot()
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptorService,
      multi: true,
    },
    {
      provide: ErrorStateMatcher,
      useClass: ShowOnDirtyErrorStateMatcher
    },
    AuthGuard,
    UtilService,
    AuthService,
    UserService,
    MenuService,
    SettingService,
    OrdersService,
    FcmsService,
    UsersResolve,
    UserResolve,
    MenusResolve,
    MenuResolve,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
