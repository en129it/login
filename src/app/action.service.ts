import { Injectable } from '@angular/core';

export interface Action {
  actionCode: string;
  route: string;
}

export const LOGIN_ACTION: Action = {actionCode: 'LOGIN', route: 'login'};
export const CHANGE_PASSWORD_ACTION: Action = {actionCode: 'CHANGE_PASSWORD', route: 'pwdmgt/changepwd'};


@Injectable({
  providedIn: 'root'
})
export class ActionService {

  private actionList: Array<Action> = [
    LOGIN_ACTION,
    CHANGE_PASSWORD_ACTION
  ];

  constructor() { }

  public getAction(actionCode: string): Action {
    const action = this.actionList.find( (item) => (item.actionCode === actionCode));
    return action;
  }
}
