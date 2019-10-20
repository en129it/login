import { parse } from 'url';
import { Renderer2, ComponentRef } from '@angular/core';


export interface InterceptorContent {
    isClosable: boolean;
    title: string;
    content: Array<any>;
    actions: Array<any>;
}

abstract class ElementParser {
    abstract parse(element: any, rootElem: HTMLElement, renderer2: Renderer2, lastParser: ElementParser, componentRef: ComponentRef<any>);
}

abstract class PParentElementParser extends ElementParser {
    pElem: HTMLParagraphElement;

    createPElement(rootElem: HTMLElement, renderer2: Renderer2): HTMLParagraphElement {
        const pElem = renderer2.createElement('p') as HTMLParagraphElement;
        rootElem.appendChild(pElem);
        return pElem;
    }

}

class TextElementParser extends PParentElementParser {
    public isBoldStyle: boolean;

    parse(element: any, rootElem: HTMLElement, renderer2: Renderer2, lastParser: ElementParser, componentRef: ComponentRef<any>) {
        const message = element['message'];
        this.isBoldStyle = element['boldStyle'];

        if (lastParser != null && (!((!this.isBoldStyle) && lastParser instanceof TextElementParser && (!(lastParser as TextElementParser).isBoldStyle)))) {
            this.pElem = (lastParser as TextElementParser).pElem;
        } else {
            this.pElem = this.createPElement(rootElem, renderer2);
        }

        const textNode = renderer2.createText(message);
        if (this.isBoldStyle) {
            this.pElem.appendChild(renderer2.createElement('b') as HTMLElement).appendChild(textNode);
        } else {
            this.pElem.appendChild(textNode);
        }
    }

}

class LinkElementParser extends PParentElementParser {
    parse(element: any, rootElem: HTMLElement, renderer2: Renderer2, lastParser: ElementParser, componentRef: ComponentRef<any>) {
        const label = element['label'];
        const action = element['action'];

        if ((lastParser != null) && (lastParser instanceof PParentElementParser)) {
            this.pElem = (lastParser as PParentElementParser).pElem;
        } else {
            this.pElem = this.createPElement(rootElem, renderer2);
        }

        const anchorElem = renderer2.createElement('a') as HTMLAnchorElement;
        anchorElem.appendChild(renderer2.createText(label));
        anchorElem.href = '#';
        anchorElem.addEventListener('click', () => {
            componentRef.instance.routeTo(action);
        });
        this.pElem.appendChild(anchorElem);
    }
}

class RadioButtonGroupElementParser extends ElementParser {
    parse(elements: any, rootElem: HTMLElement, renderer2: Renderer2, lastParser: ElementParser, componentRef: ComponentRef<any>) {
        const id = rootElem.childElementCount;
        elements.forEach( (element, index) => {
            const label = element['label'];
            const action = element['action'];

            const divElem = rootElem.appendChild(renderer2.createElement('div') as HTMLDivElement);
            const inputElem = divElem.appendChild(renderer2.createElement('input') as HTMLInputElement);
            inputElem.type = 'radio';
            inputElem.name = '' + id;
            inputElem.id = '' + id + '_' + index;
            inputElem.value = action;
            const labelElem = renderer2.createElement('label') as HTMLLabelElement;
            labelElem.htmlFor = inputElem.id;
            labelElem.appendChild(renderer2.createText(label));
            divElem.appendChild(labelElem);
        });
    }
}

export class Parser {
    private readonly MODEL = new Map<string, any>([
        ['text', TextElementParser],
        ['link', LinkElementParser],
        ['radioButtonGroup', RadioButtonGroupElementParser]
    ]);

    public parse(content: InterceptorContent, componentRef: ComponentRef<any>, renderer2: Renderer2): HTMLElement {
        const rootElem = renderer2.createElement('div') as HTMLDivElement;
        let lastItemParser: ElementParser = null;

        content.content.forEach(contentItem => {
            for (const entry of this.MODEL.entries()) {
                const val = contentItem[entry[0]];
                if (val != null) {
                    const itemParser = new entry[1](val) as ElementParser;
                    itemParser.parse(val, rootElem, renderer2, lastItemParser, componentRef);
                    lastItemParser = itemParser;
                }
            }
        });
        return rootElem;
    }
}
