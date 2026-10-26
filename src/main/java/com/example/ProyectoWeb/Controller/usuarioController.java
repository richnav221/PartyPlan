package com.example.ProyectoWeb.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.ProyectoWeb.Entities.usuario;
import com.example.ProyectoWeb.Services.usuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class usuarioController {

    @Autowired
    private usuarioService service;

    @GetMapping
    public List<usuario> listar() {
        return service.obtenerTodos();
    }

    @GetMapping("/{id}")
    public usuario obtener(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public usuario crear(@RequestBody usuario usuario) {
        usuario.setId(null);
        usuario.setActivo(true);
        return service.guardar(usuario);
    }

    @PutMapping("/{id}")
    public usuario actualizar(@PathVariable Long id, @RequestBody usuario usuario) {
        usuario actual = service.obtenerPorId(id);
        usuario.setId(id);
        usuario.setActivo(actual.isActivo());
        return service.guardar(usuario);
    }

    // Eliminación lógica: el usuario queda inactivo
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desactivar(@PathVariable Long id) {
        service.eliminar(id);
    }

    @PatchMapping("/{id}/activar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void activar(@PathVariable Long id) {
        service.activar(id);
    }
}
