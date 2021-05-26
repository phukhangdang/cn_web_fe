import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: 'post', title: 'Newsfeed', icon: 'nc-bank', class: '' },
    { path: 'user-profile', title: 'User Profile', icon: 'nc-bank', class: '' },
    { path: 'follow', title: 'Follow', icon: 'nc-bank', class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
