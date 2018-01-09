import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../user/auth/auth.service";
import {AuthXService} from "../../user/auth/auth-x.service";
import {ModalService} from "../../shared/modal/modal.service";


class Loading {
    adding: boolean;
    sites: boolean;
}

@Component({
	templateUrl: './feed-edit.component.html'
})
export class FeedEditComponent implements OnInit {

    error: any;

    sites: any;

    loading: Loading = new Loading();

    constructor(private authHttp: AuthXService, private modalService: ModalService) {
        this.error = null;
        this.sites = [];
    }

    ngOnInit() {
        this.loadSites();
    }

    loadSites() {
        this.loading.sites = true;
        this.authHttp.get('/sites')
            .subscribe(
                data => this.sites = data.json(),
                err => {
                    console.error(err);
                    this.loading.sites = false;
                },
                () => this.loading.sites = false
            )
    }

    onAddSite(form: NgForm) {
        this.loading.adding = true;
        this.authHttp.post('/site/add', {
            url: form.value.url,
            title: form.value.title,
            domain: form.value.domain
        })
            .subscribe(
                response => {
                    let data = response.json();
                    console.log(data);
                    if (data.message) {
                        this.modalService.show({
                            title: 'Sources Added',
                            body: data.message,
                        });
                    } else if (data.error) {
                        this.modalService.show({
                            title: 'Error',
                            body: data.error,
                        });
                    }
                    this.loadSites();
                },
                err => {
                    console.error(err);
                    this.loading.sites = false;
                },
                () => this.loading.adding = false
            )
    }

    onAddFeed(form: NgForm) {
        this.loading.adding = true;
        this.authHttp.post('/source/add', {
            url: form.value.url,
            site_id: form.value.site_id
        })
            .subscribe(
                response => {
                    let data = response.json();
                    console.log(data);
                    if (data.message) {
                        this.modalService.show({
                            title: 'Source Added',
                            body: data.message,
                        });
                    } else if (data.error) {
                        this.modalService.show({
                            title: 'Error',
                            body: data.error,
                        });
                    }
                    this.loadSites();
                },
                err => {
                    console.error(err);
                    this.loading.sites = false;
                },
                () => this.loading.adding = false
            )
    }

    onAddBulk(form: NgForm) {
        this.loading.adding = true;
        this.authHttp.post('/source/bulk', {
            urls: form.value.urls,
            site_id: form.value.site_id
        })
            .subscribe(
                response => {
                    let data = response.json();
                    console.log(data);
                    if (data.message) {
                        this.modalService.show({
                            title: 'Sources Added',
                            body: data.message,
                        });
                    } else if (data.error) {
                        this.modalService.show({
                            title: 'Error',
                            body: data.error,
                        });
                    }
                    this.loadSites();
                },
                err => {
                    console.error(err);
                    this.loading.sites = false;
                },
                () => this.loading.adding = false
            )
    }

}