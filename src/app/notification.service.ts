import { Injectable } from '@angular/core';
import { Notification } from './login.model';

@Injectable({
    providedIn: 'root'
  })
export class NotificationService {

    private notifications = new Array<Notification>();

    public addAll(notifications: Array<Notification>) {
        this.notifications.concat(notifications);
    }

    public clearAll() {
        this.notifications.splice(0, this.notifications.length);
    }
}
