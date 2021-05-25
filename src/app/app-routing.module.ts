// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { DefaultLayoutComponent } from './views/theme/layouts/default-layout/default-layout.component';
// Auth
import { AuthGuard } from './core/auth/_guard/auth.guard';

import { DashboardComponent } from './views/pages/dashboard/dashboard.component';
import { UserComponent } from './views/pages/user/user.component';
import { TableComponent } from './views/pages/table/table.component';
import { TypographyComponent } from './views/pages/typography/typography.component';
import { IconsComponent } from './views/pages/icons/icons.component';
import { MapsComponent } from './views/pages/maps/maps.component';
import { NotificationsComponent } from './views/pages/notifications/notifications.component';
import { UpgradeComponent } from './views/pages/upgrade/upgrade.component';
import { P404Component } from './views/error/404.component';

const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule) },
    {
        path: 'apps',
        component: DefaultLayoutComponent,
        // canActivate: [AuthGuard],
        children: [
            {
                path: 'post',
                loadChildren: () => import('./views/pages/post/post.module').then(m => m.PostModule)
            },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'user', component: UserComponent },
            { path: 'table', component: TableComponent },
            { path: 'typography', component: TypographyComponent },
            { path: 'icons', component: IconsComponent },
            { path: 'maps', component: MapsComponent },
            { path: 'notifications', component: NotificationsComponent },
            { path: 'upgrade', component: UpgradeComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
        ]
    },
    { path: '', component: P404Component },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule],
})

export class AppRoutingModule {
}