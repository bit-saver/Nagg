import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {tokenNotExpired} from 'angular2-jwt';

import {Observable} from 'rxjs';

import 'rxjs/Rx';
import {Router} from "@angular/router";

import {environment} from "../../../environments/environment";

@Injectable()
export class AuthService {

    private api_url: string;

    public verified: boolean = true;

    private admin: boolean = false;

    constructor(private http: Http, private router: Router) {
        this.api_url = environment.apiUrl;
    }

    register(username: string, email: string, password: string) {
        return this.http.post(this.api_url + '/user/register',
            {name: username, email: email, password: password},
            {headers: new Headers({'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json'})})
            .map(
                (response: Response) => {
                    return response.json();
                }
            )
            .catch(error => {
                console.warn(error.json());
                return Observable.throw(error.json() || 'Server error.');
            })
            .do(
                data => {
                    console.log('doing token data', data);
                    this.verified = false;
                    localStorage.setItem('token', data.token);
                }
            );
    }

    login(email: string, password: string) {
        return this.http.post(this.api_url + '/user/login',
            {email: email, password: password},
            {headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})})
            .map(
                (response: Response) => {
                    return response.json();
                }
            )
            .catch(error => {
                console.warn(error.json());
                return Observable.throw(error.json() || 'Server error.');
            })
            .do(
                data => {
                    console.log('doing token data', data);
                    this.verified = data.verified;
                    this.admin = data.admin;
                    localStorage.setItem('token', data.token);
                }
            );
    }

    verify(email: string, token: string) {
        return this.http.post(this.api_url + '/user/verify',
            {email: email, token: token},
            {headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})})
            .map(
                (response: Response) => {
                    return response.json();
                }
            )
            .catch(error => {
                console.warn(error.json());
                return Observable.throw(error.json() || 'Server error.');
            })
            .do(
                data => {
                    console.log('doing verify data', data);
                    if (data.token)
                        localStorage.setItem('token', data.token);
                }
            );
    }

    resend(email: string) {
        return this.http.post(this.api_url + '/user/resend',
            {email: email},
            {headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})})
            .map(
                (response: Response) => {
                    return response.json();
                }
            )
            .catch(error => {
                console.warn(error.json());
                return Observable.throw(error.json() || 'Server error.');
            })
            ;
    }

    setUserData(data: any) {
        this.verified = data.verified;
        this.admin = data.admin;
    }

    public logout() {
        localStorage.removeItem('token');
        this.router.navigate(['login']);

    }

    loggedIn(): boolean {
        return tokenNotExpired();
    }

    isAdmin(): boolean {
        return this.admin;
    }
}
