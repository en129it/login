import { Component, ViewChild, ElementRef, Inject } from '@angular/core';

export const IS_BOLD_STYLE_PROVIDER_KEY = 'IS_BOLD_STYLE';

@Component({
    selector: 'app-paragraph-wrapper',
    templateUrl: './paragraph.wrapper.component.html',
    styleUrls: ['./paragraph.wrapper.component.scss']
})
export class ParagraphWrapperComponent {

    @ViewChild('rootContent') private rootContent: ElementRef;
    public isBoldStyle: boolean;

    public addParagraphElement(element: HTMLElement, isBoldStyle: boolean): HTMLElement {
        this.isBoldStyle = isBoldStyle;
        return this.rootContent.nativeElement.appendChild(element);
    }
}
