// Angular
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// RxJS
import { Observable, Subject } from 'rxjs';
// Auth
import * as authConfig from '../../../core/_config/auth.config';
// NGRX
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/auth/reducers';
// Auth
import { AuthService } from '../../../core/auth/_services/auth.service';
import { User } from '../../../core/auth/_models/user.model'
import { Login } from '../../../core/auth/_actions/auth.actions'

/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
    EMAIL: 'admin@demo.com',
    PASSWORD: 'demo'
};

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    @ViewChild('form', { static: true }) form: NgForm;
    public authConfig: any;
    hide = true;
    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private store: Store<AppState>,
        private router: Router,
    ) { }

    ngOnInit() {
        this.authConfig = authConfig.Auth_CONFIG;
        if (this.isLogin) {
            this.router.navigateByUrl('/apps/post');
        }
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    isLogin() {
        const accessToken = this.authService.getCookie(this.authConfig.accessToken);
        const user = this.authService.getCookie(this.authConfig.userInfo);
        if(accessToken && accessToken !== null && user && user !== null)
        {
            var userInfo = JSON.parse(this.authService.getCookie(this.authConfig.userInfo))
            this.store.dispatch(new Login({ user: userInfo }));
            return true;
        } else {
            return false;
        }
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const loginRequest = {
                userName: this.loginForm.value["username"],
                password: this.loginForm.value["password"],
            };
            this.authService.login(loginRequest).subscribe(res => {
                if (res.canAccess && res.accessToken != null) {
                    this.authService.setCookie(this.authConfig.accessToken, res.accessToken, 7);
                    this.authService.setCookie(this.authConfig.userInfo, JSON.stringify(res.userInfo), 7);
                    this.store.dispatch(new Login({ user: res.userInfo }))
                    this.router.navigateByUrl('/apps/post');
                } else {
                    alert("Wrong!")
                    // show message wrong user-password
                }
            });
        }
    }

    register(): void {
        this.router.navigate(['/auth/register']);
    }
}
