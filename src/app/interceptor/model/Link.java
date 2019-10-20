package com.ddv.test.model;

public class Link implements ParagraphElement {

    private LabelActionElement link;
    
    public Link(String label, String action) {
        setLink(new LabelActionElement(label, action));
    }

    public LabelActionElement getLink() {
        return link;
    }

    public void setLink(LabelActionElement link) {
        this.link = link;
    }
    
}
