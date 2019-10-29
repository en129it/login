import { parse } from 'url';
import { Renderer2, ComponentRef, Type } from '@angular/core';
import { TestComponent } from '../test/test.component';
import { RadioButtonWrapperComponent } from '../test/radiobutton.wrapper.component';
import { ParagraphWrapperComponent } from '../test/paragraph.wrapper.component';


export interface InterceptorContent {
    isClosable: boolean;
    title: string;
    content: Array<any>;
    actions: Array<any>;
}

function addParagraphComponent(interceptorPage: TestComponent): ComponentRef<ParagraphWrapperComponent> {
    const compFactory = interceptorPage.componentFactoryResolver.resolveComponentFactory(ParagraphWrapperComponent);
    const compRef = interceptorPage.contentRoot.createComponent(compFactory, null, interceptorPage.dinjector);
    return compRef;
}

abstract class ElementParser {
    abstract parse(element: any, id: string, lastComponentRef: ComponentRef<any>, interceptorPage: TestComponent): ComponentRef<any>;
}

class TextElementParser extends ElementParser {
    parse(element: any, id: string, lastComponentRef: ComponentRef<any>, interceptorPage: TestComponent): ComponentRef<any> {
        const message = element['message'];
        const isBoldStyle = element['boldStyle'];

        let componentRef: ComponentRef<ParagraphWrapperComponent>;

        if ((lastComponentRef != null) && (lastComponentRef.instance instanceof ParagraphWrapperComponent && (isBoldStyle !== ((lastComponentRef.instance as ParagraphWrapperComponent).isBoldStyle)))) {
            componentRef = lastComponentRef as ComponentRef<ParagraphWrapperComponent>;
        } else {
            componentRef = addParagraphComponent(interceptorPage);
        }

        const textNode = interceptorPage.renderer2.createText(message);
        if (isBoldStyle) {
            componentRef.instance.addParagraphElement(interceptorPage.renderer2.createElement('b') as HTMLElement, true).appendChild(textNode);
        } else {
            componentRef.instance.addParagraphElement(textNode, false);
        }
        return componentRef;
    }

}

class LinkElementParser extends ElementParser {
    parse(element: any, id: string, lastComponentRef: ComponentRef<any>, interceptorPage: TestComponent): ComponentRef<any> {
        const label = element['label'];
        const action = element['action'];

        let componentRef: ComponentRef<ParagraphWrapperComponent>;
        if ((lastComponentRef != null) && (lastComponentRef.instance instanceof ParagraphWrapperComponent)) {
            componentRef = lastComponentRef as ComponentRef<ParagraphWrapperComponent>;
        } else {
            componentRef = addParagraphComponent(interceptorPage);
        }

        const anchorElem = interceptorPage.renderer2.createElement('a') as HTMLAnchorElement;
        anchorElem.appendChild(interceptorPage.renderer2.createText(label));
        anchorElem.href = '#';
        anchorElem.addEventListener('click', (event) => {
            console.log('#### Link click');
            interceptorPage.setSyncAction(action);
            event.preventDefault();
        });
        componentRef.instance.addParagraphElement(anchorElem, false);
        return componentRef;
    }
}

class RadioButtonGroupElementParser extends ElementParser {
    parse(elements: any, id: string, lastComponentRef: ComponentRef<any>, interceptorPage: TestComponent): ComponentRef<any> {
        const compFactory = interceptorPage.componentFactoryResolver.resolveComponentFactory(RadioButtonWrapperComponent);
        const compRef = interceptorPage.contentRoot.createComponent(compFactory, null, interceptorPage.dinjector);

        const data = elements.map( (element) => {
            return {label: element['label'], action: element['action']};
        });
        compRef.instance.groupName = id;
        compRef.instance.data = data;
        compRef.instance.choice = data[0].action;
        compRef.instance.choiceChange.subscribe( (newAction) => {
            interceptorPage.setAsyncAction(newAction);
        });
        return compRef;
    }
}

export class Parser {
    private readonly MODEL = new Map<string, any>([
        ['text', TextElementParser],
        ['link', LinkElementParser],
        ['radioButtonGroup', RadioButtonGroupElementParser]
    ]);

    public parse(content: InterceptorContent, interceptorPage: TestComponent, renderer2: Renderer2): void {
        let lastComponentRef: ComponentRef<any>;
        let id = 0;

        content.content.forEach(contentItem => {
            for (const entry of this.MODEL.entries()) {
                const val = contentItem[entry[0]];
                if (val != null) {
                    const itemParser = new entry[1](val) as ElementParser;
                    lastComponentRef = itemParser.parse(val, '' + (id++), lastComponentRef, interceptorPage);
                }
            }
        });
    }
}
