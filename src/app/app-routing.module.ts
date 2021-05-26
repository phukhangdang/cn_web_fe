// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { DefaultLayoutComponent } from './views/theme/layouts/default-layout/default-layout.component';
// Auth
import { AuthGuard } from './core/auth/_guard/auth.guard';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';

const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule) },
    {
        path: 'apps',
        component: DefaultLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'post',
                loadChildren: () => import('./views/pages/post/post.module').then(m => m.PostModule)
            },
            {
                path: 'follow',
                loadChildren: () => import('./views/pages/follow/follow.module').then(m => m.FollowModule)
            },
            {
                path: 'user-profile',
                loadChildren: () => import('./views/pages/user-profile/user-profile.module').then(m => m.UserProfileModule)
            },
            {
                path: 'user-profile/:userId',
                loadChildren: () => import('./views/pages/user-profile/user-profile.module').then(m => m.UserProfileModule)
            },
            { path: '', redirectTo: 'post', pathMatch: 'full' },
            { path: '**', redirectTo: 'post', pathMatch: 'full' },
        ]
    },
    { path: '404', component: P404Component },
    { path: '500', component: P500Component },
    { path: '**', redirectTo: 'auth/login', pathMatch: 'full' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule],
})

export class AppRoutingModule {
}