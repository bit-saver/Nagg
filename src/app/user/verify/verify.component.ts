import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';

import {AuthService} from "../auth/auth.service";
import {ModalService} from "../../shared/modal/modal.service";
import {AuthXService} from "../auth/auth-x.service";

class Loading {
    verifying: boolean = false;
    resending: boolean = false;
}

@Component({
    selector: 'app-verify',
    templateUrl: './verify.component.html',
})
export class VerifyComponent implements OnInit {

    error: any;

    loading: Loading = new Loading();

    token: string = null;
    email: string = null;

    constructor(private router: Router, private route: ActivatedRoute, private modalService: ModalService, private authService: AuthService, private authHttp: AuthXService) {
        this.error = null;
    }

    ngOnInit() {
        this.route
            .queryParams
            .subscribe(params => {
                this.token = params.token;
                this.email = params.email;
                if (this.token && this.email)
                    this.verifyUser();
            });
    }

    verifyUser() {
        this.loading.verifying = true;
        this.error = null;
        this.authService.verify(this.email, this.token)
            .subscribe(
                data => {
                    if (data.message) {
                        this.authService.verified = true;
                        this.modalService.show({
                            body: 'Your account has been verified.',
                            bodyClasses: 'alert-success',
                            type: 'toast'
                        });
                        this.router.navigate(['feed']);
                    } else {
                        this.error = data.error;
                    }
                    this.loading.verifying = false;
                },
                error => {
                    this.error = error;
                    this.loading.verifying = false;
                }

            );
    }

    onResend() {
        this.loading.resending = true;
        if (this.authService.loggedIn()) {
            this.authHttp.get('/user/resend')
                .map(response => {
                    return response.json()
                })
                .subscribe(
                    data => {
                        if (data.message) {
                            this.modalService.show({
                                title: 'Verification Sent',
                                body: data.message,
                            });
                        } else {
                            this.error = data.error;
                        }
                        this.loading.resending = false;
                    },
                    error => {
                        this.error = error;
                        this.loading.resending = false;
                    }

                );
        } else {
            this.authService.resend(null)
                .subscribe(
                    data => {
                        if (data.message) {
                            this.modalService.show({
                                title: 'Verification Sent',
                                body: data.message,
                            });
                        } else {
                            this.error = data.error;
                        }
                        this.loading.resending = false;
                    },
                    error => {
                        this.error = error;
                        this.loading.resending = false;
                    }

                );
        }
    }
}
