import { Directive, ElementRef } from '@angular/core';
import { NotificationService } from '../notification.service';

@Directive({
    selector: '[notificationLayout]'
})
export class NotificationLayoutDirective {

    constructor(notificationService: NotificationService, elementRef: ElementRef) {
        const elem: HTMLElement = elementRef.nativeElement;

        notificationService.getNotificationEvent().subscribe((notificationCount: number) => {
            console.log('@@@@@@@@ event');
            elem.style.position = (notificationCount < 2) ? 'absolute' : 'relative';
        });

    }
}
/*
private notificationEvent = new Subject<number>();

public getNotificationEvent(): Observable<number> {
    return this.notificationEvent.asObservable();
}
*/
