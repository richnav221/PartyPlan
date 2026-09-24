package com.example.ProyectoWeb.Repository;

import com.example.ProyectoWeb.Entities.lugar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface lugarRepository extends JpaRepository<lugar, Long> {

    List<lugar> findByCategoriaIgnoreCase(String categoria);

}
