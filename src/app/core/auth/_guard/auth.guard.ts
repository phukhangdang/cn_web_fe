// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// NGRX
import { Store } from '@ngrx/store';
// Auth reducers and selectors
import { AppState } from '../reducers';
import { Logout, Login } from '../_actions/auth.actions';
import { AuthService } from '../_services/auth.service';
import * as authConfig from '../../_config/auth.config';
@Injectable()
export class AuthGuard implements CanActivate {
    public authConfig: any;
    constructor(
        private store: Store<AppState>,
        private router: Router,
        private auth: AuthService) {
            this.authConfig = authConfig.Auth_CONFIG;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const accessToken = this.getCookie(this.authConfig.accessToken);
        const user = this.getCookie(this.authConfig.userInfo);
        if(accessToken && accessToken !== null && user && user !== null)
        {
            var userInfo = JSON.parse(this.getCookie(this.authConfig.userInfo))
            this.store.dispatch(new Login({ user: userInfo }));
            return true;
        } else {
            this.router.navigateByUrl('auth/login');
            return false;
        }
    }

     /**
     * Get cookies by name
     */
      public getCookie(name: string): string {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (const item of ca) {
            let c = item;
            while (c.charAt(0) === ' ') { c = c.substring(1, c.length); }
            if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length, c.length); }
        }
        return '';
    }
    
    /**
     * Set cookies by name
     */
    public setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
}
