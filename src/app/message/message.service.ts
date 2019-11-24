import { Injectable, EventEmitter } from '@angular/core';
import { TranslateService, TranslationChangeEvent, DefaultLangChangeEvent, LangChangeEvent } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class MessageService {

    constructor(private rootTranslateService: TranslateService) {
        console.log('### root ', rootTranslateService);
    }

    public registerChildTranslateService(translateService: TranslateService) {
        console.log('### child ', translateService);
        translateService.setDefaultLang(this.rootTranslateService.getDefaultLang());
        this.rootTranslateService.onDefaultLangChange.subscribe( (event: DefaultLangChangeEvent) => {
            translateService.setDefaultLang(event.lang);
        });
        translateService.use(this.rootTranslateService.currentLang);
        this.rootTranslateService.onLangChange.subscribe( (event: LangChangeEvent) => {
            translateService.use(event.lang);
        });
    }

    public setDefaultLang(lang: string) {
        this.rootTranslateService.setDefaultLang(lang);
    }

    public use(lang: string): Observable<any> {
        return this.rootTranslateService.use(lang);
    }

    public instant(key: string, translateService: TranslateService): string {
        let rslt = null;
        if (translateService != null) {
            rslt = translateService.instant(key);
        }
        if (rslt == null || rslt === key) {
            rslt = this.rootTranslateService.instant(key);
        }
        return rslt;
    }

    public onTranslationChange(): EventEmitter<TranslationChangeEvent> {
        return this.rootTranslateService.onTranslationChange;
    }

    public onLangChange(): EventEmitter<LangChangeEvent> {
        return this.rootTranslateService.onLangChange;
    }

    public onDefaultLangChange(): EventEmitter<DefaultLangChangeEvent> {
        return this.rootTranslateService.onDefaultLangChange;
    }

    public currentLang(): string {
        return this.rootTranslateService.currentLang;
    }

    public getParsedResult(translations: any, key: any, interpolateParams?: any): any {
        return this.rootTranslateService.getParsedResult(translations, key, interpolateParams);
    }

    public get(key: string, translateService: TranslateService): Observable<any> {
        if (translateService != null) {
            return translateService.get(key).pipe(mergeMap( val => {
                return ((val == null) || (val === key)) ? this.rootTranslateService.get(key) : of(val);
            }));
        } else {
            return this.rootTranslateService.get(key);
        }
    }

}
