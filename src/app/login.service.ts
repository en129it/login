import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ActionService, Action, LOGIN_ACTION } from './action.service';
import { BusService, OPERATION_STATUS } from './bus.service';
import { Response, toResponseObject } from './login.model';
import { NotificationService } from './notification.service';

interface HttpOption {
  headers?: HttpHeaders | {
      [header: string]: string | string[];
  };
  observe?: 'body';
  params?: HttpParams | {
      [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType: 'arraybuffer';
  withCredentials?: boolean;
}

const HTTP_OPTIONS: HttpOption = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  }),
  observe: 'response' as 'body',
  responseType: 'json' as 'arraybuffer'
};

export const OPERATION_ONGOING = 'OPERATION_ONGOING';
export const OPERATION_FINISHED = 'OPERATION_FINISHED';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient, private router: Router, private actionService: ActionService, private busService: BusService, private notificationService: NotificationService) { }

  private executeRequest(httpResponse: Observable<any>, context: Action) {
    httpResponse.subscribe(
      (data: HttpResponse<Response>) => {
        const ssoToken = data.headers.get('SSO_TOKEN');
        console.log('User authenticated. Redirect using token ', ssoToken);
        if (ssoToken != null) {

        }
        const response: Response = toResponseObject(data.body);
        this.dispatchNotifications(response);
      },
      (error: HttpErrorResponse) => {
        const response: Response = toResponseObject(error.error);
        if (error.status === 401) {
          console.log('User not authenticated. Redirect to login page');
          this.dispatchNotifications(response);
          this.updateView(context, LOGIN_ACTION, response);
        } else if (error.status === 417) {
          console.log('User partially authenticated. Redirect to specified action');
          const newAction = error.headers.get('AUTH_ACTION');
          this.dispatchNotifications(response);
          this.updateView(context, this.actionService.getAction(newAction), response);
        } else {
          // including 200OK but with invalid payload
          console.log('Unexpected error. Redirect to same page ', error);
          this.updateView(context, context, response);
        }
      },
      () => {
        this.busService.broadcast(OPERATION_STATUS, OPERATION_FINISHED);
        console.log('Completed');
      }
    );
  }

  private updateView(currentAction: Action, newAction: Action, response: Response) {
    if (currentAction === newAction) {
      this.busService.broadcast(currentAction.actionCode, (response != null) ? response.payload : null);
    } else {
      this.router.navigate([newAction.route]);
    }
  }

  private dispatchNotifications(response: Response) {
    if ((response != null) && (response.notifications != null)) {
      this.notificationService.addAll(response.notifications);
    }
  }

  public get(url: string, context: Action): void {
    this.busService.broadcast(OPERATION_STATUS, OPERATION_ONGOING);
    this.executeRequest(this.httpClient.get(url, HTTP_OPTIONS), context);
  }

  public post(url: string, body: any, context: Action): void {
    this.busService.broadcast(OPERATION_STATUS, OPERATION_ONGOING);
    this.executeRequest(this.httpClient.post(url, body, HTTP_OPTIONS), context);
  }

  public login(userName: string, pwd: string, context: Action): void {
    this.post('http://localhost:1200/login', {username: userName, password: pwd}, context);
  }
}
