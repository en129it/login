import { Component, forwardRef, OnInit } from '@angular/core';
import { WizardStepComponent } from './wizard.step.component';

@Component({
    selector: 'app-test2',
    templateUrl: './test2.component.html',
    styleUrls: ['./test2.component.scss']
  })
export class Test2Component extends WizardStepComponent implements OnInit {
  public isButtonDisabled = false;

  constructor() {
    super();
    console.log('#### TEST2 constructor');
  }

  ngOnInit() {
    console.log('#### TEST2 ngOnInit');
//    this.onStepperButtonsEnablingEvent.emit(true);
  }

  public onPreviousStepClicked() {
    return true;
  }

  public onNextStepClicked() {
    return true;
  }

  public goPreviousStep() {
    this.onPreviousButtonEvent.emit();
  }

  public goNextStep() {
    this.onNextButtonEvent.emit();
  }

}
