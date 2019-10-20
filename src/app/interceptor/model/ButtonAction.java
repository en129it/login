package com.ddv.test.model;

public class ButtonAction {

    private LabelActionElement button;
    
    public ButtonAction(String label, String action) {
        setButton(new LabelActionElement(label, action));
    }

    public LabelActionElement getButton() {
        return button;
    }

    public void setButton(LabelActionElement button) {
        this.button = button;
    }
    
}
