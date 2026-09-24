package com.example.ProyectoWeb.Controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class InicioController {

    @GetMapping("/")
    public String inicio(Model model, Authentication authentication) {

        if (authentication != null) {
            model.addAttribute("usuarioLogueado", authentication.getName());
        }

        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }
    @GetMapping("/error")
    public String error() {
        return "error";
    }
}