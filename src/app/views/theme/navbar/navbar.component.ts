import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../../core/auth/_services/auth.service';
import * as authConfig from '../../../core/_config/auth.config';
import { UserService } from '../../../services/modules/user/user.service';
import { UserRequestPayload } from '../../../services/modules/user/user-request.payload';

@Component({
  moduleId: module.id,
  selector: 'navbar-cmp',
  templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;
  public authConfig: any;
  public title: any;
  public userRequest = new UserRequestPayload();
  public userData: any = [];

  public isCollapsed = true;
  @ViewChild("navbar-cmp", { static: false }) button;

  constructor (
    private cdr: ChangeDetectorRef,
    location: Location,
    private authService: AuthService,
    private renderer: Renderer2,
    private element: ElementRef,
    private router: Router,
    private userService: UserService) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
    this.authConfig = authConfig.Auth_CONFIG;
  }

  ngOnInit() {
    var userInfo = JSON.parse(this.authService.getCookie(this.authConfig.userInfo));
    this.title = userInfo.userName;
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
    });
    this.initUser();
  }

  logout() {
    this.authService.deleteCookie(this.authConfig.accessToken);
    this.authService.deleteCookie(this.authConfig.userInfo);
    this.router.navigate(['']);
  }

  initUser() {
    this.userRequest.pageSize = 10;
    this.userRequest.pageIndex = 0;
    this.userService.select(this.userRequest).subscribe(res => {
      this.userData = res;
      this.cdr.detectChanges();
    });
  }

  search(e) {
    this.initUser();
    // if (e.code == "Enter") {
    //   this.initUser();
    // }
  }

  viewProfile(userId: any) {
    this.router.navigate([`apps/user-profile/${userId}`]);
  }

  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName('html')[0];
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);

    html.classList.add('nav-open');
    if (window.innerWidth < 991) {
      mainPanel.style.position = 'fixed';
    }
    this.sidebarVisible = true;
  };
  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
    if (window.innerWidth < 991) {
      setTimeout(function () {
        mainPanel.style.position = '';
      }, 500);
    }
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  };
  collapse() {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    console.log(navbar);
    if (!this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    } else {
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }

  }

}
