import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

export interface WizardStepModel {
    stepLabelKey: string;
    previousButtonLabelKey?: string;
    nextButtonLabelKey?: string;
}

@Component({
    selector: 'app-wizard',
    templateUrl: './wizard.component.html',
    styleUrls: ['./wizard.component.scss']
})
export class WizardComponent {

    @Input() public stepsData: Array<WizardStepModel>;
    private _currentStepIndex = 0;
    public progressBarWidthPercentage = 0;

    @Input()
    set currentStepIndex(index: number) {
        if (this._currentStepIndex !== index) {
            this._currentStepIndex = index;
            setTimeout(() => {
                this.progressBarWidthPercentage = Math.min(this._currentStepIndex * 100 / (this.stepsData.length-1), 100);
            }, 50);
            this.stepChangedEvent.emit(index);
        }
    }
    get currentStepIndex(): number {
        return this._currentStepIndex;
    }

    @Output()
    public stepChangedEvent = new EventEmitter<number>();

    public isStepDone(index: number): boolean {
        return index < this.currentStepIndex;
    }

    public isStepActive(index: number): boolean {
        return index === this.currentStepIndex;
    }

    public isStepAccessible(index: number): boolean {
        return this.isStepDone(index);
    }

    public getPreviousButtonLabel() {
        const labelKey = this.stepsData[this.currentStepIndex].previousButtonLabelKey;
        return (labelKey != null) ? labelKey : 'Previous';
    }

    public getNextButtonLabel() {
        const labelKey = this.stepsData[this.currentStepIndex].nextButtonLabelKey;
        return (labelKey != null) ? labelKey : 'Next';
    }

    public goPreviousStep() {
        this.currentStepIndex--;
    }

    public goNextStep() {
        this.currentStepIndex++;
    }
}
