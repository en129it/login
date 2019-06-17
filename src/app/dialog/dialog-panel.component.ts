import { Component, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type, ComponentRef, HostBinding, Inject, OnDestroy, Injector } from '@angular/core';
import { DialogService, DialogRef, DialogInjector } from './dialog.service';
import { Subject } from 'rxjs';

export const DIALOG_ID_PROVIDER_KEY = 'DIALOG_ID';
export const DIALOG_REF_PROVIDER_KEY = 'DIALOG_REF';

@Component({
    selector: 'app-dialog-panel',
    templateUrl: './dialog-panel.component.html',
    styleUrls: ['./dialog-panel.component.scss'],
})
export class DialogPanelComponent implements OnDestroy {

    @Input() title: string;
    @ViewChild('content', {read: ViewContainerRef}) content: ViewContainerRef;
    @HostBinding('attr.id') id;
    @HostBinding('attr.class') cssClass = 'overlay-modal-panel';

    private dialogRef: DialogRef;
    private contentComponentRef: ComponentRef<any>;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private defaultInjector: Injector, @Inject(DIALOG_ID_PROVIDER_KEY) dialogId) {
        this.id = dialogId;
    }

    ngOnDestroy() {
        if (this.contentComponentRef != null) {
            this.contentComponentRef.destroy();
        }
    }

    setDialogRef(dialogRef: DialogRef) {
        this.dialogRef = dialogRef;
    }

    public attachContent<T>(contentComponentType: Type<T>, dialogRef: DialogRef) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(contentComponentType);
        this.contentComponentRef = this.content.createComponent(componentFactory, 0, new DialogInjector(this.defaultInjector, DIALOG_REF_PROVIDER_KEY, dialogRef));
    }

    public closeDialog(event: MouseEvent) {
        this.dialogRef.notifyCloseDialog();
        event.preventDefault();
    }
}
