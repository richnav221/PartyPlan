package com.example.ProyectoWeb.Controller;

import com.example.ProyectoWeb.Entities.pago;
import com.example.ProyectoWeb.Services.pagoService;
import com.example.ProyectoWeb.Services.reservaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/pagos")
public class pagoController {

    @Autowired
    private pagoService service;

    @Autowired
    private reservaService reservaService;

    @GetMapping
    public String listar(Model model) {
        model.addAttribute("pagos", service.obtenerTodos());
        return "pagos";
    }

    @GetMapping("/{id}")
    public String obtenerPorId(
            @PathVariable Long id,
            Model model) {

        model.addAttribute("pago", service.obtenerPorId(id));

        return "pago";
    }

    @GetMapping("/reserva/{idReserva}")
    public String obtenerPorReserva(
            @PathVariable Long idReserva,
            Model model) {

        model.addAttribute(
                "pago",
                service.obtenerPorReserva(idReserva)
        );

        return "pago";
    }

    @GetMapping("/nuevo")
    public String nuevo(Model model) {

        model.addAttribute("pago", new pago());
        model.addAttribute("reservas", reservaService.obtenerTodas());

        return "pago-form";
    }

    @PostMapping("/guardar")
    public String guardar(@ModelAttribute pago pago) {

        service.registrarPago(pago);

        return "redirect:/pagos";
    }

    @GetMapping("/editar/{id}")
    public String editar(
            @PathVariable Long id,
            Model model) {

        model.addAttribute(
                "pago",
                service.obtenerPorId(id)
        );

        model.addAttribute(
                "reservas",
                reservaService.obtenerTodas()
        );

        return "pago-form";
    }

    @GetMapping("/estado/{id}/{estado}")
    public String actualizarEstado(
            @PathVariable Long id,
            @PathVariable String estado) {

        service.actualizarEstado(id, estado);

        return "redirect:/pagos/" + id;
    }
}
