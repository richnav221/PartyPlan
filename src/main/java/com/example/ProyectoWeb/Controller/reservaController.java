package com.example.ProyectoWeb.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.ProyectoWeb.Entities.reserva;
import com.example.ProyectoWeb.Services.planService;
import com.example.ProyectoWeb.Services.reservaService;
import com.example.ProyectoWeb.Services.usuarioService;

@Controller
@RequestMapping("/reservas")
public class reservaController {

    @Autowired
    private reservaService service;

    @Autowired
    private usuarioService usuarioService;

    @Autowired
    private planService planService;

    @GetMapping
    public String listar(Model model) {

        model.addAttribute("reservas", service.obtenerTodas());

        return "reservas";
    }

    @GetMapping("/nuevo")
    public String nuevo(Model model) {

        model.addAttribute("reserva", new reserva());
        model.addAttribute("usuarios", usuarioService.obtenerTodos());
        model.addAttribute("planes", planService.obtenerTodos());

        return "reserva-form";
    }

    @PostMapping("/guardar")
    public String guardar(@ModelAttribute reserva reserva) {

        service.crear(reserva);

        return "redirect:/reservas";
    }

    @GetMapping("/editar/{id}")
    public String editar(
            @PathVariable Long id,
            Model model) {

        model.addAttribute("reserva", service.obtenerPorId(id));
        model.addAttribute("usuarios", usuarioService.obtenerTodos());
        model.addAttribute("planes", planService.obtenerTodos());

        return "reserva-form";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id) {

        service.eliminar(id);

        return "redirect:/reservas";
    }
}
