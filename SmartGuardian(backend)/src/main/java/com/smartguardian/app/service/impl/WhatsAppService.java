package com.smartguardian.app.service.impl;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import net.javaguides.todo.config.TwilioConfig;
import org.springframework.stereotype.Service;

@Service
public class WhatsAppService {
    private final TwilioConfig twilioConfig;

    public WhatsAppService(TwilioConfig twilioConfig) {
        this.twilioConfig = twilioConfig;
    }

    public void sendWhatsAppMessage(String to, String messageBody) {
        Message.creator(
                new PhoneNumber("whatsapp:" + to),
                new PhoneNumber("whatsapp:" + twilioConfig.getFromNumber()),
                messageBody
        ).create();
    }
}

