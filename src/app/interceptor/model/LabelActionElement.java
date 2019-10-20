package com.ddv.test.model;

public class LabelActionElement implements ParagraphElement {

    private String label;
    private String action;
    
    protected LabelActionElement(String label, String action) {
        setLabel(label);
        setAction(action);
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
    
    
}
