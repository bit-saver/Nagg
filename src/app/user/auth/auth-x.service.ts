import {Injectable} from '@angular/core';
import {Request, Response, RequestOptionsArgs} from '@angular/http';
import {Router} from '@angular/router';
import {AuthHttp as JwtAuthHttp} from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import {ModalService} from "../../shared/modal/modal.service";
import {AuthService} from "./auth.service";
import {environment} from "../../../environments/environment";

@Injectable()
export class AuthXService {

    private api_url: string = 'http://nagg/api';

    constructor(private authHttp: JwtAuthHttp, private router: Router, private modalService: ModalService, private authService: AuthService) {
        this.api_url = environment.apiUrl;
    }

    private isUnauthorized(status: number): boolean {
        return status === 0 || status === 401 || status === 403;
    }

    private authIntercept(response: Observable<Response>): Observable<Response> {
        let sharableResponse = response.share();
        sharableResponse.subscribe(null, (err) => {
            if (this.isUnauthorized(err.status)) {
                this.modalService.show({
                    body: 'You have been logged out.',
                    bodyClasses: 'alert-warning',
                    type: 'toast'
                });
                this.router.navigate(['/login']);
            } else if (err.status === 405) {
                this.authService.verified = false;
                this.modalService.show({
                    body: 'Your account has not been verified.',
                    bodyClasses: 'alert-danger',
                    type: 'toast'
                });
                this.router.navigate(['/verify']);
            }
            // Other error handling may be added here, such as refresh token …
        });
        return sharableResponse;
    }

    public setGlobalHeaders(headers: Array<Object>, request: Request | RequestOptionsArgs) {
        this.authHttp.setGlobalHeaders(headers, request);
    }

    public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.authIntercept(this.authHttp.request(this.api_url + url, options));
    }

    public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.authIntercept(this.authHttp.get(this.api_url + url, options));
    }

    public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.authIntercept(this.authHttp.post(this.api_url + url, body, options));
    }

    public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.authIntercept(this.authHttp.put(this.api_url + url, body, options));
    }

    public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.authIntercept(this.authHttp.delete(this.api_url + url, options));
    }

    public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.authIntercept(this.authHttp.patch(this.api_url + url, body, options));
    }

    public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.authIntercept(this.authHttp.head(this.api_url + url, options));
    }

    public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.authIntercept(this.authHttp.options(this.api_url + url, options));
    }
}