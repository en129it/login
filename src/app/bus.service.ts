import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export const OPERATION_STATUS = 'OPERATION_STATUS';

class BusMessage {
    messageType: string;
    payload: any;
}

export interface BusMessageListener {
    onMessage(payload: any);
}

export interface OperationStatusBusMessageListener {
    onOperationStatusChange(status: string);
}

export interface NotificationBusMessageListener {
    onNotification(notification: Notification);
}

@Injectable({
    providedIn: 'root'
  })
export class BusService {
    private subject = new Subject<BusMessage>();

    public broadcast(messageType: string, payload: any): void {
        this.subject.next({messageType, payload});
    }

    public subscribe(messageType: string, listener: BusMessageListener): Subscription {
        return this.subject.pipe(
            filter( (m: BusMessage) => (m.messageType === messageType)),
            map( (m: BusMessage) => m.payload)
        ).subscribe( (payload: string) => listener.onMessage(payload) );
    }

    public subscribeOperationStatus(listener: OperationStatusBusMessageListener): Subscription {
        return this.subscribe(OPERATION_STATUS, {
            onMessage(payload: any) {
                listener.onOperationStatusChange(payload as string);
            }
        });
    }
}
