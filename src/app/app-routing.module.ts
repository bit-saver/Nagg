import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {RegisterComponent} from './user/register/register.component';
import {LoginComponent} from './user/login/login.component';
import {FeedComponent} from './feed/feed.component';
import {FeedEditComponent} from './feed/edit/feed-edit.component';
import {AuthGuard} from './user/auth/auth-guard.service';
import {VerifyComponent} from "./user/verify/verify.component";

const routes: Routes = [
    {path: '', component: HomeComponent},
    // { path: 'features', component: FeatureListComponent },
    // { path: 'features/:id', component: FeatureComponent },

    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'verify', component: VerifyComponent},
    {
        path: 'feed/edit',
        component: FeedEditComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'feed',
        component: FeedComponent,
        canActivate: [AuthGuard],
        data: {
            subpage: 'feed'
        }
    },
    {
        path: 'feed/saved',
        component: FeedComponent,
        canActivate: [AuthGuard],
        data: {
            subpage: 'saved'
        }
    },
    {
        path: 'feed/hidden',
        component: FeedComponent,
        canActivate: [AuthGuard],
        data: {
            subpage: 'hidden'
        }
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
