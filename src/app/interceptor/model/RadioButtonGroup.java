package com.ddv.test.model;

import java.util.ArrayList;
import java.util.List;

public class RadioButtonGroup implements ParagraphElement {

    private List<LabelActionElement> radioButtonGroup;
    
    public RadioButtonGroup() {
        radioButtonGroup = new ArrayList<LabelActionElement>();
    }

    public RadioButtonGroup addItem(String label, String action) {
        radioButtonGroup.add(new LabelActionElement(label, action));
        return this;
    }
    
    public List<LabelActionElement> getRadioButtonGroup() {
        return radioButtonGroup;
    }

    public void setRadioButtonGroup(List<LabelActionElement> radioButtonGroup) {
        this.radioButtonGroup = radioButtonGroup;
    }
    
}
