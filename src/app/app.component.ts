import {Component, OnInit} from '@angular/core';
import {AuthService} from "./user/auth/auth.service";
import {AuthXService} from "./user/auth/auth-x.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public isCollapsed:boolean = true;
    public collapsing:any = null;


    constructor(public auth: AuthService, private authHttp: AuthXService) {
    }

    ngOnInit(): void {
        if (this.auth.loggedIn()) {
            this.authHttp.get('/user/info')
                .map(response => { return response.json()})
                .subscribe(
                    data => {
                        this.auth.setUserData(data);
                    }
                );
        }
    }

    toggleCollapse() {
        this.collapsing = setTimeout(() => this.collapsing = null, 300);
        this.isCollapsed = !this.isCollapsed;
    }

    onClickOutside() {
        if (!this.collapsing && !this.isCollapsed)
            this.isCollapsed = true;
    }
}
