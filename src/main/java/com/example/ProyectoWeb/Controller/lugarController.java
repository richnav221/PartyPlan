package com.example.ProyectoWeb.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.ProyectoWeb.Entities.lugar;
import com.example.ProyectoWeb.Services.lugarService;

@Controller
@RequestMapping("/lugares")
public class lugarController {

    @Autowired
    private lugarService service;

    @GetMapping
    public String listar(Model model) {
        model.addAttribute("lugares", service.obtenerTodos());
        return "lugares";
    }

    @GetMapping("/nuevo")
    public String nuevo(Model model) {
        model.addAttribute("lugar", new lugar());
        return "lugar-form";
    }

    @PostMapping("/guardar")
    public String guardar(@ModelAttribute lugar lugar) {
        service.guardar(lugar);
        return "redirect:/lugares";
    }

    @GetMapping("/editar/{id}")
    public String editar(@PathVariable Long id, Model model) {
        model.addAttribute("lugar", service.obtenerPorId(id));
        return "lugar-form";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return "redirect:/lugares";
    }
}
