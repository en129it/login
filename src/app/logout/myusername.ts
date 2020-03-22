import { Subject, Observable, Subscription, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

abstract class AbstractOperation<T> {
    private subject = new Subject<T>();

    constructor(protected httpClient: HttpClient) {
    }

    abstract execute(): Observable<any>;

    asObservable(): Observable<T> {
        return this.subject.asObservable();
    }
}

class LogoutOperation extends AbstractOperation<void> {
    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    execute(): Observable<any> {
        return this.httpClient.get('http://localhost:1200/logoutUser');
    }
}

class GetUserNameOperation extends AbstractOperation<string> {
    private userName: string;
    private userNameSubject = new Subject<string>();
    isExecuted: boolean;

    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    execute(): Observable<any> {
        return (this.httpClient.get('http://localhost:1200/getUserName').pipe(
            tap( (data: string) => {
                this.userName = data;
                this.userNameSubject.next(this.userName);
                this.isExecuted = true;
            })
        ));
    }

    subscribe(): Observable<string> {
        if (this.userName != null) {
            return of(this.userName);
        } else {
            return (this.userNameSubject).asObservable();
        }
    }

    stop(rescheduledOperation: GetUserNameOperation) {
        rescheduledOperation.userNameSubject.observers.push
            .apply(rescheduledOperation.userNameSubject.observers, this.userNameSubject.observers);
        this.userNameSubject.unsubscribe();
    }

}

@Injectable()
export class MyUserName {
    private currentOperation: GetUserNameOperation | LogoutOperation;
    private nextOperation: GetUserNameOperation;

    constructor(private httpClient: HttpClient) {

    }

    public getUserName(): Observable<string> {
        if (this.currentOperation != null && this.currentOperation instanceof GetUserNameOperation) {
            return (this.currentOperation as GetUserNameOperation).subscribe();
        } else {
            let operation = this.nextOperation;
            if (operation == null) {
                operation = new GetUserNameOperation(this.httpClient);
                this.nextOperation = operation;
            }
            this.executeNextGetUserNameOperation();
            return operation.subscribe();
        }
    }

    public clear(): void {
        if (this.currentOperation != null && this.currentOperation instanceof GetUserNameOperation) {
            if (!(this.currentOperation as GetUserNameOperation).isExecuted) {
                if (this.nextOperation == null) {
                    this.nextOperation = new GetUserNameOperation(this.httpClient);
                }
                (this.currentOperation as GetUserNameOperation).stop(this.nextOperation);
            }
            this.currentOperation = null;
        }
        if (this.currentOperation == null) {
            this.currentOperation = new LogoutOperation(this.httpClient);

            const actionFct = () => {
                this.currentOperation = null;
                this.executeNextGetUserNameOperation();
            };
            this.currentOperation.execute().subscribe(actionFct, actionFct);
        }
    }

    private executeNextGetUserNameOperation() {
        if (this.nextOperation != null && this.currentOperation == null) {
            this.currentOperation = this.nextOperation;
            this.nextOperation = null;

            const actionFct = () => {};
            this.currentOperation.execute().subscribe(actionFct, actionFct, actionFct);
        }
    }
}
