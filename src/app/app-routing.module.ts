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

import { MenuIndexComponent } from './menu-index/menu-index.component';
import { MenuNewComponent } from './menu-new/menu-new.component';
import { MenuEditComponent } from './menu-edit/menu-edit.component';
import { MenusResolve } from './menus.resolve';
import { MenuResolve } from './menu.resolve';
import { MenuAddComponent } from './menu-add/menu-add.component';
import { MenuUpdateComponent } from './menu-update/menu-update.component';

import { OrdersComponent } from './orders/orders.component';
import { MyordersComponent } from './myorders/myorders.component';

import { StoresIndexComponent } from './stores-index/stores-index.component';

import { SettingsComponent } from './settings/settings.component';
import { SettingsAddComponent } from './settings-add/settings-add.component';

import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpUpdateComponent } from './sign-up-update/sign-up-update.component';

import { Error404Component } from './error404/error404.component';

const routes: Routes = [
  { path: '',  component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users/signup',  component: SignUpComponent },
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
      {
        path: ':username/update',
        component: SignUpUpdateComponent,
        resolve: {
          user: UserResolve
        }
      },
    ]
  },
  { path: 'menus', canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: MenuIndexComponent,
        resolve: {
          menus: MenusResolve,
        }
      },
      {
        path: 'new',
        component: MenuNewComponent
      },
      {
        path: ':menuNo/edit',
        component: MenuEditComponent,
        resolve: {
          menu: MenuResolve
        }
      },
      {
        path: 'add',
        component: MenuAddComponent
      },
      {
        path: ':menuNo/update',
        component: MenuUpdateComponent,
        resolve: {
          menu: MenuResolve
        }
      }
    ]
  },
  { path: 'orders', canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: OrdersComponent
      }
    ]
  },
  { path: 'myorders', canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: MyordersComponent
      }
    ]
  },
  { path: 'stores',
    children: [
      {
        path: '',
        component: StoresIndexComponent
      },
    ]
  },
  { path: 'settings', canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: SettingsComponent
      },
      {
        path: 'add',
        component: SettingsAddComponent
      },
    ]
  },
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes,
      {
        onSameUrlNavigation: 'reload',
        anchorScrolling: 'enabled'
      })
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
