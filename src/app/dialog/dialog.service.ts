import { Injectable, Inject, OnDestroy, Type, ApplicationRef, ComponentFactoryResolver, Injector, EmbeddedViewRef, ComponentRef, InjectionToken, InjectFlags } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DialogPanelComponent, DIALOG_ID_PROVIDER_KEY } from './dialog-panel.component';
import { Observable, Subject } from 'rxjs';

/*

.overlay-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: none;

    .overlay-container-react {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        opacity: 1;
        pointer-events: auto;
        background: rgba(0, 0, 0, .32);
    }

    .dialog-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
    }
}

ATTENTION : add to entryComponent : DialogPanelComponent

Usage example:
    const dialogRef = this.dialogService.openDialog(TestComponent, {title: 'Toto'});
    dialogRef.onCloseDialogEvent().subscribe( () => {
      console.log('CLOSE');
      dialogRef.closeDialog();
    });

*/

export interface DialogConfig {
    title: string;
}

export class DialogRef {
    closeDialogEvent = new Subject<void>();

    constructor(private dialogPanel: HTMLElement, private dialogPanelComponentRef: ComponentRef<DialogPanelComponent>, private dialogService: DialogService) {
        dialogPanelComponentRef.instance.setDialogRef(this);
    }

    public notifyCloseDialog() {
        this.closeDialogEvent.next();
    }

    public onCloseDialogEvent(): Observable<void> {
        return this.closeDialogEvent.asObservable();
    }

    public closeDialog() {
        this.dialogService.closeDialog(this.dialogPanel, this.dialogPanelComponentRef);
    }
}

export class DialogInjector implements Injector {

    constructor(private parentInjector: Injector, private customTokenKey: any, private customTokenValue: any) {
    }

    public get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectFlags): T {
        return (token === this.customTokenKey) ? this.customTokenValue : this.parentInjector.get(token, notFoundValue, flags);
    }
}


@Injectable({
    providedIn: 'root'
})
export class DialogService implements OnDestroy {

    private overlayContainer: HTMLElement;
    private dialoPanelIdGenerator = 0;
    private dialogRef: DialogRef;

    constructor(@Inject(DOCUMENT) private document: Document, private applicationRef: ApplicationRef, private componentFactoryResolver: ComponentFactoryResolver, private defaultInjector: Injector) {
    }

    public openDialog(componentType: Type<any>, config?: DialogConfig): DialogRef {
        if (this.overlayContainer == null) {
            this.overlayContainer = this.createOverlayContainer();
        }
        this.overlayContainer.style.display = 'block';

        return this.dialogRef = this.createDialogPanel(componentType, this.overlayContainer, config);
   }

    public closeDialog(dialogPanel: HTMLElement, dialogPanelComponentRef: ComponentRef<DialogPanelComponent>) {
        this.overlayContainer.style.display = 'none';

        dialogPanel.remove();
        dialogPanelComponentRef.destroy();
    }

    public ngOnDestroy() {
        if (this.overlayContainer != null) {
            this.document.removeChild(this.overlayContainer);
        }
    }

    public getOverlayContainer(): HTMLElement {
        if (!this.overlayContainer) {
            this.createOverlayContainer();
        }
        return this.overlayContainer;
    }

    private attachComponent(componentType: Type<any>, rootNode: HTMLElement, injector?: Injector): ComponentRef<any> {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        const componentRef = componentFactory.create( (injector != null) ? injector : this.defaultInjector);
        this.applicationRef.attachView(componentRef.hostView);
        const componentRootNode = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];

        rootNode.appendChild(componentRootNode);
        return componentRef;
    }

    private createOverlayContainer(): HTMLElement {
        const overlayContainer = this.document.createElement('div');
        overlayContainer.classList.add('overlay-container');
        this.document.body.appendChild(overlayContainer);

        const overlayContainerReact = this.document.createElement('div');
        overlayContainerReact.classList.add('overlay-container-react');
        overlayContainer.appendChild(overlayContainerReact);

        overlayContainerReact.addEventListener('click', (event: MouseEvent) => this.dialogRef.notifyCloseDialog());

        return overlayContainer;
    }

    private createDialogPanel(componentType: Type<any>, overlayContainer: HTMLElement, config: DialogConfig): DialogRef {
        const dialogPanel = this.document.createElement('div');
        dialogPanel.classList.add('dialog-container');
        dialogPanel.addEventListener('click', (event: MouseEvent) => event.preventDefault());

        const dialogPanelComponentRef = this.attachComponent(DialogPanelComponent, dialogPanel, new DialogInjector(this.defaultInjector, DIALOG_ID_PROVIDER_KEY, 'dialog-panel-' + (this.dialoPanelIdGenerator++)));
        const dialogRef = new DialogRef(dialogPanel, dialogPanelComponentRef, this);

        const dialogPanelComponent = dialogPanelComponentRef.instance as DialogPanelComponent;
        dialogPanelComponent.attachContent(componentType, dialogRef);
        dialogPanelComponent.title = config.title;

        overlayContainer.appendChild(dialogPanel);

        return dialogRef;
    }
}
