package com.ddv.test.model;

import java.util.ArrayList;
import java.util.List;

public class InterceptorContent {

    private boolean isClosable;
    private String title;
    private List<ParagraphElement> content;
    private List<ButtonAction> actions;
    
    public InterceptorContent(String title, boolean isCloseable) {
        setTitle(title);
        setClosable(isCloseable);
        content = new ArrayList<ParagraphElement>();
        actions = new ArrayList<ButtonAction>();
    }
    
    public boolean isClosable() {
        return isClosable;
    }
    public void setClosable(boolean isClosable) {
        this.isClosable = isClosable;
    }
    
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    
    public void addContentElement(ParagraphElement element) {
        content.add(element);
    }
    public List<ParagraphElement> getContent() {
        return content;
    }
    public void setContent(List<ParagraphElement> content) {
        this.content = content;
    }

    public void addAction(ButtonAction action) {
        actions.add(action);
    }
    public List<ButtonAction> getActions() {
        return actions;
    }
    public void setActions(List<ButtonAction> actions) {
        this.actions = actions;
    }
    
    
}
