import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ModalService} from "./modal.service";
import {ModalOptions} from "ngx-bootstrap";

export class Modal {
    type: string = 'dialog';
    title: string = 'Notification';
    body: string = 'Empty';
    modalClasses: string = '';
    contentClasses: string = '';
    bodyClasses: string = '';
}

@Component({
    selector: 'global-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    exportAs: 'globalModal'
})
export class ModalComponent implements OnInit {
    @ViewChild('globalModal') public globalModal: ModalDirective;

    subscription: any;
    private modalQueue: Array<any> = [];
    private modalShown: boolean = false;
    private modalTimeout: any = null;

    private config: ModalOptions = new ModalOptions();

    modal: Modal = new Modal();


    constructor(public modalData: ModalService) {

    }

    ngOnInit() {
        this.subscription = this.modalData.modal.subscribe(data => {
            this.modalQueue.push(data);
            if (!this.modalShown)
                this.popModal();
        });
    }

    public showModal(): void {
        this.modalShown = true;
        this.globalModal.config = this.config;
        this.globalModal.show();
    }

    public hideModal(): void {
        this.globalModal.hide();
    }

    onHidden(event) {
        if (this.modalTimeout) {
            clearTimeout(this.modalTimeout);
            this.modalTimeout = null;
        }
        this.modalShown = false;
        this.popModal();
    }


    popModal() {
        if (this.modalQueue.length > 0) {
            let data = this.modalQueue.pop();
            console.log('modal data', data);
            this.modal.type = 'dialog';
            this.modal.title = 'Notification';
            this.modal.body = 'Empty';
            this.modal.modalClasses = '';
            this.modal.contentClasses = '';
            this.modal.bodyClasses = '';
            if (data.modalClasses) this.modal.modalClasses = data.modalClasses;
            if (data.contentClasses) this.modal.contentClasses = data.contentClasses;
            if (data.bodyClasses) this.modal.bodyClasses = data.bodyClasses;
            if (data.title) this.modal.title = data.title;
            if (data.body) this.modal.body = data.body;
            if (data.type == 'toast') {
                this.modal.type = data.type;
                this.config.backdrop = false;
                this.modal.modalClasses += ' toast';
                this.modalTimeout = setTimeout(() => {
                    this.modalTimeout = null;
                    this.hideModal();
                }, 1500);
            }
            this.showModal();
        }
    }
}

