import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";

import {AuthService} from "../auth/auth.service";
import {ModalService} from "../../shared/modal/modal.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

    error: any;

    constructor(private router: Router, private authService: AuthService, private modalService: ModalService) {
        this.error = null;
    }

    ngOnInit() {
    }

    onRegister(form: NgForm) {
        this.error = null;
        this.authService.register(form.value.username, form.value.email, form.value.password)
            .subscribe(
                response => {
                    if (response.error)
                        this.error = response.error;
                    else {
                        this.authService.verified = false;
                        this.modalService.show({
                            title: 'Registration Successful!',
                            body: 'A verification link has been sent to your email address.  Please verify your account to use the site.',
                        });
                        this.router.navigate(['verify']);
                    }
                },
                error => this.error = error
            );
    }

}
