package com.example.ProyectoWeb.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.ProyectoWeb.Services.pagoService;
import com.example.ProyectoWeb.Services.reservaService;

@Controller
@RequestMapping("/reportes")
public class reporteController {

    @Autowired
    private reservaService reservaService;

    @Autowired
    private pagoService pagoService;

    @GetMapping
    public String menu() {
        return "reportes";
    }

    // Reporte 1: cantidad de reservas agrupadas por estado
    @GetMapping("/reservas-por-estado")
    public String reservasPorEstado(Model model) {

        model.addAttribute("reporte", reservaService.obtenerReporteReservasPorEstado());

        return "reporte-reservas-estado";
    }

    // Reporte 2: ingresos totales agrupados por método de pago
    @GetMapping("/ingresos-por-metodo")
    public String ingresosPorMetodo(Model model) {

        model.addAttribute("reporte", pagoService.obtenerReporteIngresosPorMetodo());

        return "reporte-ingresos-metodo";
    }

    // Reporte 3: ranking de planes más reservados
    @GetMapping("/ranking-planes")
    public String rankingPlanes(Model model) {

        model.addAttribute("reporte", reservaService.obtenerReporteRankingPlanes());

        return "reporte-ranking-planes";
    }
}
