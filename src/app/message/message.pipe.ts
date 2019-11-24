import { ChangeDetectorRef, Injectable, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MessageService } from './message.service';

@Injectable()
@Pipe({
  name: 'message',
  pure: false
})
export class MessagePipe implements PipeTransform, OnDestroy {
  value = '';
  lastKey: string;
  subscribers = new Array<Subscription>();

  constructor(private messageService: MessageService, private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef) {
  }

  transform(query: string, ...args: any[]): any {
    if (query === this.lastKey) {
      return this.value;
    } else {
      this.lastKey = query;
      this.updateValue(query);

      // if there is a subscription to onLangChange, clean it
      this._dispose();

      if (this.subscribers.length === 0) {
          const eventHandler = () => {
            if (this.lastKey) {
                this.lastKey = null;
                this.updateValue(query);
            }
          };

          // subscribe to onLangChange event, in case the language changes
          this.subscribers.push(this.messageService.onLangChange().subscribe(eventHandler));

          // subscribe to onDefaultLangChange event, in case the default language changes
          this.subscribers.push(this.messageService.onDefaultLangChange().subscribe(eventHandler));
      }

      return this.value;
    }
  }

  updateValue(key: string): void {
    this.messageService.get(key, this.translateService).subscribe((res: string) => {
      this.value = res !== undefined ? res : key;
      this.lastKey = key;
      this.changeDetectorRef.markForCheck();
    });
  }

  private _dispose(): void {
    this.subscribers.forEach(element => {
        element.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this._dispose();
  }
}
