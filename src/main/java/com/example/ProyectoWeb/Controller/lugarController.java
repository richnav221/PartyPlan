package com.example.ProyectoWeb.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.ProyectoWeb.Entities.lugar;
import com.example.ProyectoWeb.Services.lugarService;

@RestController
@RequestMapping("/api/lugares")
public class lugarController {

    @Autowired
    private lugarService service;

    @GetMapping
    public List<lugar> listar() {
        return service.obtenerTodos();
    }

    @GetMapping("/{id}")
    public lugar obtener(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public lugar crear(@RequestBody lugar lugar) {
        lugar.setId(null);
        return service.guardar(lugar);
    }

    @PutMapping("/{id}")
    public lugar actualizar(@PathVariable Long id, @RequestBody lugar lugar) {
        service.obtenerPorId(id);
        lugar.setId(id);
        return service.guardar(lugar);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
