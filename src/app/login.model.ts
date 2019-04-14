

export interface NotificationParam {
    key: string;
    value: string;
}

export interface Notification {
    level: string;
    code: number;
    message: string;
    params: Array<NotificationParam>;
}

export interface Response {
    notifications: Array<Notification>;
    payload: any;
}

export function toResponseObject(obj: any): Response {
    return ((obj != null) && (obj.hasOwnProperty('payload') || obj.hasOwnProperty('notifications'))) ? obj : null;
}
