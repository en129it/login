import { Component, Input, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface LabelAction {
    label: string;
    action: string;
}

@Component({
    selector: 'app-radiobutton-wrapper',
    templateUrl: './radiobutton.wrapper.component.html',
    styleUrls: ['./radiobutton.wrapper.component.scss']
})
export class RadioButtonWrapperComponent {

    @Input() groupName: string;
    @Input() data: Array<LabelAction>;
    @Output() choiceChange = new EventEmitter<string>();

    private _choice: string;

    get choice(): string {
        return this._choice;
    }

    @Input()
    set choice(val: string) {
        if (this._choice !== val) {
            const oldChoice = this._choice;
            this._choice = val;
            if (oldChoice != null) {
                this.choiceChange.emit(val);
            }
        }
    }
}
