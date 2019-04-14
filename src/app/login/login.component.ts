import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LoginService, OPERATION_ONGOING, OPERATION_FINISHED } from '../login.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BusService, OPERATION_STATUS, NOTIFICATION } from '../bus.service';
import { LOGIN_ACTION } from '../action.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, OnDestroy {

  private busSubscription: Subscription;
  private pageAction = LOGIN_ACTION;
  private loginForm: FormGroup;

  public isEnabled = true;

  constructor(private loginService: LoginService, private busService: BusService, private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnInit() {
    this.busSubscription = this.busService.subscribe(this.pageAction.actionCode, {
      onMessage(payload: any) {
      }
    }).add(this.busService.subscribeOperationStatus({
      onOperationStatusChange(status: string) {
        if (OPERATION_ONGOING === status) {
          this.isEnabled = false;
        } else if (OPERATION_FINISHED === status) {
          this.isEnabled = true;
        }
      }
    }).add(this.busService.subscribeNotification({
      onNotification(notification: Notification) {
        console.log('Notification ', notification);
      }
    })));
  }

  ngOnDestroy() {
    if (this.busSubscription != null) {
      this.busSubscription.unsubscribe();
    }
  }

  public authenticate() {
    console.log('Authenticate');
//    this.sub.next();


    this.loginService.login(this.loginForm.value.username, this.loginForm.value.password, this.pageAction);
/*
    .pipe(takeUntil(this.sub)).subscribe( (rslt) => {
      console.log('Resolved');
      console.log('Is unsubscribe ' + unsubscribe.closed);
      setTimeout( () => {
        console.log('Is unsubscribe ' + unsubscribe.closed);
      }, 500);
    }, (error) => {
      console.log('Error', error);
      console.log('Is unsubscribe ' + unsubscribe.closed);
      setTimeout( () => {
        console.log('Is unsubscribe ' + unsubscribe.closed);
      }, 500);
    }, () => {
      console.log('END');
      console.log('Is unsubscribe ' + unsubscribe.closed);
      setTimeout( () => {
        console.log('Is unsubscribe ' + unsubscribe.closed);
      }, 500);
    });
*/
  }
}
