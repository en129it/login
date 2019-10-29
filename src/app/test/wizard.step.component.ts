import { EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Generalization of all the classes that implements a wizard step.
 */
export abstract class WizardStepComponent {

    /**
     * Event that can be emitted to notify the StepperComponent if it must enable or disable
     * the Previous and Next step buttons. When a new step gets activated, the buttons are
     * disabled. Typically an event should be generated in the ngOnInit() to re-enable them
     * if necessary.
     */
    @Output() onStepperButtonsEnablingEvent = new EventEmitter<boolean>();

    @Output() onPreviousButtonEvent = new EventEmitter<void>();

    @Output() onNextButtonEvent = new EventEmitter<void>();

    /**
     * Method invoked by StepperComponent when the user clicks onto the Previous step button.
     * Typically implementation of this method will perform some operations before the display
     * of the previous step. For example data captured in this step may be sent to the server.
     * This method can also prevent the display of the previous step by returning a False value.
     * For example this can be the case if the data submitted the server are wrong and that
     * the user has to make some modifications before being allowed to leave this step.
     * @returns A boolean, true if the previous step can be displayed, false if the current step
     * must remain active. An Observable can also be returned in which case the StepperComponent
     * will wait until resolution to either activate the previous step or to keep this one active.
     */
    public abstract onPreviousStepClicked(): Observable<boolean> | boolean;

    /**
     * Method invoked by StepperComponent when the user clicks onto the Next step button.
     * Typically implementation of this method will perform some operations before the display
     * of the next step. For example data captured in this step may be sent to the server.
     * This method can also prevent the display of the next step by returning a False value.
     * For example this can be the case if the data submitted the server are wrong and that
     * the user has to make some modifications before being allowed to leave this step.
     * @returns A boolean, true if the next step can be displayed, false if the current step
     * must remain active. An Observable can also be returned in which case the StepperComponent
     * will wait until resolution to either activate the next step or to keep this one active.
     */
    public abstract onNextStepClicked(): Observable<boolean> | boolean;
}
