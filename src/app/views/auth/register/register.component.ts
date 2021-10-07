// Angular
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Auth
import { User } from '../../../core/auth/_models/user.model'
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/auth/reducers';

import { ConfirmPasswordValidator } from './confirm-password.validator';
import { UserService } from '../../../services/modules/user/user.service';
import { AuthService } from '../../../core/auth/_services/auth.service';
import * as authConfig from '../../../core/_config/auth.config';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {
	registerForm: FormGroup;
	public authConfig: any;
	
	constructor(
		private router: Router,
		private fb: FormBuilder,
		private userService: UserService,
		private store: Store<AppState>,
		private authService: AuthService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
		this.authConfig = authConfig.Auth_CONFIG;
		this.initRegisterForm();
	}

	initRegisterForm() {
		this.registerForm = this.fb.group({
			email: ['', Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				// https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
				Validators.maxLength(320)
			]),
			],
			username: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			]),
			],
			password: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			],
			confirmPassword: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			],
		}, {
			validator: ConfirmPasswordValidator.MatchPassword
		});
	}

	submit() {
		const controls = this.registerForm.controls;

		// check form
		if (this.registerForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		var _user: any = {};
		_user.email = controls.email.value;
		_user.userName = controls.username.value;
		_user.password = controls.password.value;
		_user.role = 'user';
		_user.status = 1;
		_user.firstName = "unknown";
		_user.lastName = "unknown";
		this.userService.create(_user).subscribe(res => {
			this.authService.deleteCookie(this.authConfig.accessToken);
			this.authService.deleteCookie(this.authConfig.userInfo);
			this.toastr.success(
				'<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message"><b>Register Successfully</b><br><b>Welcome to Sunday!</b></span>',
				"",
				{
				  timeOut: 4000,
				  closeButton: true,
				  enableHtml: true,
				  toastClass: "alert alert-success alert-with-icon",
				  positionClass: "toast-" + "top" + "-" + "center"
				}
			  );
			setTimeout(() => {
				this.router.navigate(['auth/login']);
			}, 4000);
		}, err => {
			this.toastr.error(
				`<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message"><b>${err.error}</b></span>`,
				  "",
				  {
					timeOut: 4000,
					enableHtml: true,
					closeButton: true,
					toastClass: "alert alert-danger alert-with-icon",
					positionClass: "toast-" + "top" + "-" + "center"
				  }
				);
		});
	}

	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.registerForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
