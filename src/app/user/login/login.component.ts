import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import { Router } from '@angular/router';

import {AuthService} from "../auth/auth.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

    error: any;

    constructor(private router: Router, private authService: AuthService) {
        this.error = null;
    }

    ngOnInit() {
    }

    onLogin(form: NgForm) {
        this.error = null;
        this.authService.login(form.value.email, form.value.password)
            .subscribe(
                data => {
                    if (data.verified)
                        this.router.navigate(['feed']);
                    else
                        this.router.navigate(['verify']);
                },
                error => this.error = error
            );
    }
}
