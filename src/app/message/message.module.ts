import { NgModule, Injector, ReflectiveInjector } from '@angular/core';
import { ModuleWithProviders, InjectFlags } from '@angular/compiler/src/core';
import { MessageService } from './message.service';
import { TranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MessagePipe } from './message.pipe';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

const objs = [ MessagePipe ];

@NgModule({
    declarations: objs,
    providers: objs,
    imports: [
        TranslateModule
    ],
    exports: objs
})
export class MessageModule {
    static forRoot(path: string): ModuleWithProviders {
        return {
            ngModule: MessageModule,
            providers:
                TranslateModule.forRoot(
                    {loader: {
                        provide: TranslateLoader,
                        useFactory: (httpClient: HttpClient) => new TranslateHttpLoader(httpClient, path, '.json'),
                        deps: [HttpClient]
                    }, isolate: true
                    }).providers.concat(
                        [{
                            provide: MessageService,
                            useFactory: (translateService: TranslateService) => {
                                return new MessageService(translateService);
                            },
                            deps: [TranslateService]
                        }]
                )
        };
    }

    static forChild(path: string): ModuleWithProviders {
        return {
            ngModule: MessageModule,
            providers:
                TranslateModule.forChild(
                    {loader: {
                        provide: TranslateLoader,
                        useFactory: (httpClient: HttpClient) => new TranslateHttpLoader(httpClient, path, '.json'),
                        deps: [HttpClient]
                    }, isolate: true
                    }).providers.concat(
                        [{
                            provide: MessageService,
                            useFactory: (translateService: TranslateService, injector: Injector) => {
                                const messageService = injector.get(MessageService, null, (InjectFlags.SkipSelf as any));
                                messageService.registerChildTranslateService(translateService);
                                return messageService;
                            },
                            deps: [TranslateService, Injector]
                        }]
                )
        };
    }
}
