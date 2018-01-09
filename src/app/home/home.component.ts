import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../user/auth/auth.service";

@Component({
	templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    constructor(private router: Router, private authService: AuthService) {

    }

    ngOnInit(): void {
        if (this.authService.loggedIn())
            this.router.navigate(['/feed']);
        else
            this.router.navigate(['/login']);
    }

}