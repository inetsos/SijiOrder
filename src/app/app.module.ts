import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth.guard';
import { UsersResolve } from './users.resolve';
import { UserResolve } from './user.resolve';

import { UtilService } from './util.service';
import { AuthService } from './auth.service';
import { RequestInterceptorService } from './request-interceptor.service';
import { UserService } from './user.service';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { Error404Component } from './error404/error404.component';
import { LoginComponent } from './login/login.component';
import { UserNewComponent } from './user-new/user-new.component';
import { UserStoreComponent } from './user-store/user-store.component';
import { UserIndexComponent } from './user-index/user-index.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserShowComponent } from './user-show/user-show.component';

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
    UserShowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptorService,
      multi: true,
    },
    AuthGuard,
    UtilService,
    AuthService,
    UserService,
    UsersResolve,
    UserResolve
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
