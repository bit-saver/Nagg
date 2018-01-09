import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";

@Injectable()
export class ModalService {

    modal: Observable<any>;
    private observer: Observer<any>;

    constructor() {
        this.modal = new Observable<any>(observer =>
            this.observer = observer
        ).share();
    }

    show(args) {
        if (this.observer !== undefined) this.observer.next(args);
    }
}
