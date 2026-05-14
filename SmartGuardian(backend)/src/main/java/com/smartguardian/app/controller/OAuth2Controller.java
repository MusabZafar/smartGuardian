package com.smartguardian.app.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


@Controller
public class OAuth2Controller {

    @GetMapping("/oauth2/success")
    @ResponseBody
    public String getOAuth2LoginInfo(Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        return "Logged in as: " + oAuth2User.getAttributes().get("name"); // Customize this response
    }
}
