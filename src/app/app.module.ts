import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {Http, HttpModule, RequestOptions} from '@angular/http';
import {BsDropdownModule, CollapseModule, AccordionModule, TypeaheadModule, ModalModule} from 'ngx-bootstrap';
import {ModalService} from "./shared/modal/modal.service";
import {AuthXService} from "./user/auth/auth-x.service"
import {ValuesPipe} from "./shared/values.pipe";
import {InfiniteScrollModule} from 'angular2-infinite-scroll';
import {ClickOutsideModule} from 'ng-click-outside';


import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {HomeComponent} from './home/home.component';
import {FeedComponent} from './feed/feed.component';
import {FeedEditComponent} from './feed/edit/feed-edit.component';
import {RegisterComponent} from './user/register/register.component';
import {LoginComponent} from './user/login/login.component';

import {AuthService} from "./user/auth/auth.service";
import {AuthGuard} from "./user/auth/auth-guard.service";
import {AuthHttp, AuthConfig, provideAuth} from 'angular2-jwt';

import {ModalComponent} from "./shared/modal/modal.component";

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {VerifyComponent} from "./user/verify/verify.component";

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
        headerName: 'Authorization',
        headerPrefix: 'Bearer',
        tokenName: 'token',
        tokenGetter: (() => localStorage.getItem('token')),
        globalHeaders: [{'Content-Type': 'application/json'}],
        noJwtError: true
    }), http, options);
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        RegisterComponent,
        LoginComponent,
        FeedComponent,
        FeedEditComponent,
        ModalComponent,
        VerifyComponent,
        ValuesPipe,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BsDropdownModule.forRoot(),
        CollapseModule.forRoot(),
        AccordionModule.forRoot(),
        TypeaheadModule.forRoot(),
        ModalModule.forRoot(),
        InfiniteScrollModule,
        ClickOutsideModule,
        BrowserModule,
        HttpModule,
        FormsModule,
    ],
    providers: [
        AuthHttp,
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        },
        AuthService,
        AuthGuard,
        ModalService,
        AuthXService,
    ],
    entryComponents: [
        ModalComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
