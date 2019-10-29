import { Component, forwardRef, OnInit, Input, OnDestroy, Inject, ElementRef, ViewChild, NgZone, ViewContainerRef, Renderer2, Injector, ComponentFactoryResolver } from '@angular/core';
import { WizardStepComponent } from './wizard.step.component';
import { Observable, Subject } from 'rxjs';
import { DIALOG_REF_PROVIDER_KEY, DIALOG_DATA_PROVIDER_KEY } from '../dialog/dialog-panel.component';
import { DialogRef } from '../dialog/dialog.service';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { InterceptorContent, Parser } from '../interceptor/interceptor.model';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
  })
export class TestComponent extends WizardStepComponent implements OnInit, OnDestroy {

  private obs: Subject<boolean>;
  public isButtonDisabled = false;
  @ViewChild('contentroot', {read: ViewContainerRef}) public contentRoot: ViewContainerRef;
  @ViewChild('contentroot2', {read: ViewContainerRef}) public contentRoot2: ViewContainerRef;

  constructor(@Inject(DIALOG_REF_PROVIDER_KEY) private dialogRef: DialogRef,
        @Inject(DIALOG_DATA_PROVIDER_KEY) private data: InterceptorContent,
        @Inject(DOCUMENT) private document: Document,
        public componentFactoryResolver : ComponentFactoryResolver,
        public router: Router, private zone: NgZone,
        public dinjector: Injector,
        public renderer2: Renderer2) {
    super();
    console.log('#### TEST constructor', dialogRef);
  }

  ngOnInit() {
    const parser = new Parser();
    parser.parse(this.data, this, this.renderer2);
  }

  ngOnDestroy() {
    console.log('#### TEST ngOnDestroy');
  }

  public onPreviousStepClicked() {
    return true;
  }

  public onNextStepClicked() {
    this.obs = new Subject<boolean>();
    setTimeout( () => {
      this.obs.next(true);
    }, 3000);
    return this.obs;
  }

  public goNextStep() {
    console.log('#### goNextStep ####');
    this.onNextButtonEvent.emit();
  }

  public setSyncAction(action: string): void {
    console.log('### setSyncAction ' + action);
    this.dialogRef.closeDialog();
    this.router.navigateByUrl('/pwdmgt/changepwd', {skipLocationChange: true});
  }

  public setAsyncAction(action: string): void {
    console.log('################## async route to ' + action, this.router.routerState);
    this.dialogRef.closeDialog();
    this.router.navigateByUrl('/pwdmgt/changepwd');
  }

  public setContent(content: HTMLElement) {
    console.log('################## set content ');
//    this.contentRoot.nativeElement.appendChild(content);
  }


  public routeToTest2() {
    console.log('################## route to test2');
    this.router.navigateByUrl('/pwdmgt/changepwd');

  }
}
