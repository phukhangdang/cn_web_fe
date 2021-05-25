import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';

@NgModule({
    declarations: [
		NavbarComponent,
        FooterComponent,
        SidebarComponent,
		DefaultLayoutComponent,
	],
	exports: [
		NavbarComponent,
        FooterComponent,
        SidebarComponent,
		DefaultLayoutComponent,
	],
	imports: [
		CommonModule,
		RouterModule,
		NgbModule,
	]
})

export class ThemeModule {}
