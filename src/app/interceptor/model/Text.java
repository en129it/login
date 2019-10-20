package com.ddv.test.model;

public class Text implements ParagraphElement {

    private TextMessage text;
    
    public Text(String message) {
        this(message, false);
    }

    public Text(String message, boolean isBoldStyle) {
        setText(new TextMessage(message, isBoldStyle));
    }
    
    public TextMessage getText() {
        return text;
    }

    public void setText(TextMessage text) {
        this.text = text;
    }

    public static class TextMessage {
        private String message;
        private boolean isBoldStyle;

        public TextMessage(String message, boolean isBoldStyle) {
            setMessage(message);
            setBoldStyle(isBoldStyle);
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public boolean isBoldStyle() {
            return isBoldStyle;
        }

        public void setBoldStyle(boolean isBoldStyle) {
            this.isBoldStyle = isBoldStyle;
        }
    }
}

// Attention use a method name so that the bean name is "messageSource"
@Bean
public ResourceBundleMessageSource messageSource() {
    ResourceBundleMessageSource rslt = new ResourceBundleMessageSource();
    rslt.setBasename("messages");
    return rslt;
}

@Autowired
private MessageSource messageSource;
