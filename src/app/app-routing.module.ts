import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { UsersResolve } from './users.resolve';
import { UserResolve } from './user.resolve';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserNewComponent } from './user-new/user-new.component';
import { UserStoreComponent } from './user-store/user-store.component';
import { UserIndexComponent } from './user-index/user-index.component';
import { UserShowComponent } from './user-show/user-show.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { LoginComponent } from './login/login.component';
import { Error404Component } from './error404/error404.component';

const routes: Routes = [
  { path: '',  component: WelcomeComponent },
  { path: 'users/new',  component: UserNewComponent },
  { path: 'users/store',  component: UserStoreComponent },
  { path: 'users', canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: UserIndexComponent,
        resolve: {
          users: UsersResolve,
        }
      },
      {
        path: ':username',
        component: UserShowComponent,
        resolve: {
          user: UserResolve
        }
      },
      {
        path: ':username/edit',
        component: UserEditComponent,
        resolve: {
          user: UserResolve
        }
      },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  bootstrap: [
    AppComponent
  ],
  declarations: []
})
export class AppRoutingModule { }
