import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StickyComponent} from './sticky.component';

export default {
    directives: [StickyComponent]
}

@NgModule({
    imports: [CommonModule],
    declarations: [StickyComponent],
    exports: [StickyComponent]
})
export class StickyModule { }