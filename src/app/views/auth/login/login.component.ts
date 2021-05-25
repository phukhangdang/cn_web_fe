// Angular
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// RxJS
import { Observable, Subject } from 'rxjs';
// Auth
import * as authConfig from '../../../core/_config/auth.config';
/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
    EMAIL: 'admin@demo.com',
    PASSWORD: 'demo'
};

@Component({
    selector: 'kt-login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
    // Public params
    loginForm: FormGroup;
    loading = false;
    isLoggedIn$: Observable<boolean>;
    errors: any = [];
    public authConfig: any;
    private unsubscribe: Subject<any>;
    private returnUrl: any;

    /**
     * Component constructor
     *
     * @param router: Router
     * @param auth: AuthService
     * @param authNoticeService: AuthNoticeService
     * @param translate: TranslateService
     * @param store: Store<AppState>
     * @param fb: FormBuilder
     * @param cdr
     * @param route
     */
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.unsubscribe = new Subject();
        this.authConfig = authConfig.Auth_CONFIG;
    }

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit(): void {
        this.initLoginForm();
        // redirect back to the returnUrl before login
        this.route.queryParams.subscribe(params => {
            this.returnUrl = params.returnUrl || '/';
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.loading = false;
    }

    /**
     * Form initalization
     * Default params, validators
     */
    initLoginForm() {
        this.loginForm = this.fb.group({
            email: [DEMO_PARAMS.EMAIL, Validators.compose([
                Validators.required,
                Validators.email,
                Validators.minLength(3),
                Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
            ])
            ],
            password: [DEMO_PARAMS.PASSWORD, Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100)
            ])
            ]
        });
    }

    /**
     * Form Submit
     */
    submit() {
        this.router.navigateByUrl('/auth/login-child');
    }

    /**
     * Checking control validation
     *
     * @param controlName: string => Equals to formControlName
     * @param validationType: string => Equals to valitors name
     */
    isControlHasError(controlName: string, validationType: string): boolean {
        const control = this.loginForm.controls[controlName];
        if (!control) {
            return false;
        }

        const result = control.hasError(validationType) && (control.dirty || control.touched);
        return result;
    }
}
