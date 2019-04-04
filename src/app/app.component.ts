import { Component } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { enable } from 'splash-screen';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  loading = false;
  // showOverlay = true;

  constructor( private router: Router, public authService: AuthService ) {

    router.events.subscribe((event: RouterEvent) => {
      this.refreshToken(event);
      this.updateLoadingBar(event);
      // this.navigationInterceptor(event);
    });
  }

  // navigationInterceptor(event: RouterEvent): void {
  //   if (event instanceof NavigationStart) {
  //     this.showOverlay = true;
  //   }
  //   if (event instanceof NavigationEnd) {
  //     this.showOverlay = false;
  //   }

  //   // Set loading state to false in both of the below events to hide the spinner in case a request fails
  //   if (event instanceof NavigationCancel) {
  //     this.showOverlay = false;
  //   }
  //   if (event instanceof NavigationError) {
  //     this.showOverlay = false;
  //   }
  // }

  private refreshToken(event: RouterEvent): void {
    if (event instanceof NavigationStart && this.authService.isLoggedIn()) {
      this.authService.refresh().catch(response => null);
    }
  }

  private updateLoadingBar(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
    }
    if (event instanceof NavigationEnd
      || event instanceof NavigationCancel
      || event instanceof NavigationError) {
      this.loading = false;
    }
  }
}
