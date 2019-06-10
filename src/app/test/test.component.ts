import { Component, forwardRef, OnInit, Input } from '@angular/core';
import { WizardStepComponent } from './wizard.step.component';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
  })
export class TestComponent extends WizardStepComponent implements OnInit {

  constructor() {
    super();
    console.log('#### TEST constructor');
  }

  ngOnInit() {
    console.log('#### TEST ngOnInit');
    this.onStepperButtonsEnablingEvent.emit(true);
  }

  public onPreviousStepClicked() {
    return true;
  }

  public onNextStepClicked() {
    return true;
  }

}
