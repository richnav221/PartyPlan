package com.example.ProyectoWeb.Services;

import java.util.List;

import com.example.ProyectoWeb.Entities.lugar;

public interface lugarService {

    List<lugar> obtenerTodos();

    lugar obtenerPorId(Long id);

    List<lugar> obtenerPorCategoria(String categoria);

    lugar guardar(lugar lugar);

    void eliminar(Long id);
}
