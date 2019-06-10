import { Component, ViewChild, ViewContainerRef, Input, Type, OnInit, Output, EventEmitter } from '@angular/core';
import { ComponentFactoryResolver } from '@angular/core';
import { WizardStepComponent } from '../test/wizard.step.component';
import { Observable } from 'rxjs';

/**
 * The model used by the StepperComponent to define the different steps. Each step is defined by a step label,
 * by the label of the Previous and Next step buttons and by the @Component that provides the step content.
 * All those @Component must be classes that extends WizardStepComponent. If no label is provided for a Previous
 * or Next step button then that button gets not visible.
 */
export interface StepperStepModel {
    stepLabelKey: string;
    previousButtonLabelKey?: string;
    nextButtonLabelKey?: string;
    component: Type<WizardStepComponent>;
}

/**
 * Widget that renders a stepper. The steps are declared by providing the @Input() stepsData with an array of
 * StepperStepModel. The content of each step if provided by a @Component class that must extends the
 * WizardStepComponent class. See StepperStepModel for more information. The widget displays a horizontal
 * progress bar with milestones, each milestone representing a step. The widget also manages the Previous and
 * Next buttons. These buttons are disabled on display of another step. It is the responsability of the class
 * that renders the new displayed step (so a class that extends WizardStepComponent) to re-enable these buttons
 * if necessary. See WizardStepComponent declared methods and variables to know how this widget can communicate
 * with the classes that renders the step content and vice-versa. When the user completes this stepper, this
 * widget emits a onCompletionEvent event.
 */
@Component({
    selector: 'app-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {
    @Input() public stepsData: Array<StepperStepModel>;
    @Output() public onCompletionEvent = new EventEmitter<void>();

    @ViewChild('content', {read: ViewContainerRef}) contentAnchor: ViewContainerRef;
    private _activeComponent: WizardStepComponent;
    private _currentStepIndex = 0;
    public isButtonDisabled = true;
    public progressBarWidthPercentage = 0;

    set currentStepIndex(index: number) {
        if (this._currentStepIndex !== index) {
            if (index >= this.stepsData.length) {
                this.onCompletionEvent.emit();
            } else {
                const returnRslt = (index > this._currentStepIndex)
                ? this._activeComponent.onNextStepClicked()
                : this._activeComponent.onPreviousStepClicked();

                const applyCurrentStepIndexChange = (canApplyChange: boolean) => {
                    if (canApplyChange) {
                        this._currentStepIndex = index;
                        this.updateContent();
                        setTimeout(() => {
                            this.progressBarWidthPercentage = Math.min(this._currentStepIndex * 100 / (this.stepsData.length - 1), 100);
                            this.isButtonDisabled = false;
                        }, 50);
                    }
                };

                if (returnRslt instanceof Observable) {
                    this.isButtonDisabled = true;
                    (returnRslt as Observable<boolean>).subscribe( (canApplyChange: boolean) => {
                        applyCurrentStepIndexChange(canApplyChange);
                    });
                } else {
                    applyCurrentStepIndexChange(returnRslt);
                }
            }
        }
    }
    get currentStepIndex(): number {
        return this._currentStepIndex;
    }

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit() {
        this.updateContent();
    }

    public isStepDone(index: number): boolean {
        return index < this.currentStepIndex;
    }

    public isStepActive(index: number): boolean {
        return index === this.currentStepIndex;
    }

    public isStepAccessible(index: number): boolean {
        return this.isStepDone(index);
    }

    public goPreviousStep() {
        this.currentStepIndex = Math.max(0, --this.currentStepIndex);
    }

    public goNextStep() {
        this.currentStepIndex = ++this.currentStepIndex;
    }

    public goToStep(index: number) {
        if (index < this.currentStepIndex) {
            this.currentStepIndex = index;
        }
    }

    public getPreviousButtonLabel() {
        const labelKey = this.stepsData[this.currentStepIndex].previousButtonLabelKey;
        return (labelKey != null) ? labelKey : 'Previous';
    }

    public getNextButtonLabel() {
        const labelKey = this.stepsData[this.currentStepIndex].nextButtonLabelKey;
        return (labelKey != null) ? labelKey : 'Next';
    }

    private updateContent() {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.stepsData[this.currentStepIndex].component);

        this.contentAnchor.clear();
        const componentRef = this.contentAnchor.createComponent(componentFactory);
        this._activeComponent = componentRef.instance;
        this._activeComponent.onStepperButtonsEnablingEvent.subscribe( (mustEnableButtons: boolean) => {
            this.isButtonDisabled = !mustEnableButtons;
        });
    }
}
