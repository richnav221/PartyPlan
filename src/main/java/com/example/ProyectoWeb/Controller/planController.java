package com.example.ProyectoWeb.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.ProyectoWeb.Entities.plan;
import com.example.ProyectoWeb.Services.planService;

@Controller
@RequestMapping("/planes")
public class planController {

    @Autowired
    private planService service;

    @GetMapping
    public String listar(Model model) {
        model.addAttribute("planes", service.obtenerTodos());
        return "planes";
    }

    @GetMapping("/nuevo")
    public String nuevo(Model model) {
        model.addAttribute("plan", new plan());
        return "plan-form";
    }

    @PostMapping("/guardar")
    public String guardar(@ModelAttribute plan plan) {
        service.guardar(plan);
        return "redirect:/planes";
    }

    @GetMapping("/editar/{id}")
    public String editar(@PathVariable Long id, Model model) {
        model.addAttribute("plan", service.obtenerPorId(id));
        return "plan-form";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return "redirect:/planes";
    }

}
