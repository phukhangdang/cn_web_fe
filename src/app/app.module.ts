import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Injector, NgModule } from '@angular/core';
import { ToastrModule } from "ngx-toastr";
import { HttpClientModule } from '@angular/common/http';

import { ThemeModule } from './views/theme/theme.module'
import { PostModule } from './views/pages/post/post.module'

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store'
import { AuthService } from './core/auth/_services/auth.service'
import { HttpService } from './services/common/http/http.service'
import { ServiceLocator } from './services/common/utility/service-locator.service';
import { Configuration } from './services/common/utility/app-configuration.service'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    ThemeModule,
    PostModule,
    StoreModule.forRoot({}, {}),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [
    AuthService,
    Configuration,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {    // Create global Service Injector.
    ServiceLocator.injector = this.injector;
  }
}
