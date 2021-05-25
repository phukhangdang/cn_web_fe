// Angular
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// NGRX
import { StoreModule } from '@ngrx/store';

// Module components
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

// Auth
import { AuthGuard } from '../../core/auth/_guard/auth.guard';
import { AuthService } from '../../core/auth/_services/auth.service'
import { authReducer } from '../../core/auth/_reducers/auth.reducers'
import { InterceptService } from '../../services/common/utility/intercept.service'

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: LoginComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'register',
                component: RegisterComponent
            }
        ]
    }
];


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        StoreModule.forFeature('auth', authReducer),
        ],
    providers: [
        InterceptService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptService,
            multi: true
        },
    ],
    exports: [AuthComponent],
    declarations: [
        AuthComponent,
        LoginComponent,
        RegisterComponent,
    ]
})

export class AuthModule {
    static forRoot(): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule,
            providers: [
                AuthService,
                AuthGuard
            ]
        };
    }
}
