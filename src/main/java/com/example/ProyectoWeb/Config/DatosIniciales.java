package com.example.ProyectoWeb.Config;

import com.example.ProyectoWeb.Entities.usuario;
import com.example.ProyectoWeb.Entities.plan;
import com.example.ProyectoWeb.Entities.lugar;
import com.example.ProyectoWeb.Entities.reserva;
import com.example.ProyectoWeb.Entities.pago;

import com.example.ProyectoWeb.Repository.usuarioRepository;
import com.example.ProyectoWeb.Repository.planRepository;
import com.example.ProyectoWeb.Repository.lugarRepository;
import com.example.ProyectoWeb.Repository.reservaRepository;
import com.example.ProyectoWeb.Repository.pagoRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Configuration
public class DatosIniciales {

    @Bean
    CommandLineRunner cargarDatos(
            usuarioRepository usuarioRepository,
            planRepository planRepository,
            lugarRepository lugarRepository,
            reservaRepository reservaRepository,
            pagoRepository pagoRepository) {

        return args -> {

            usuario usuario1;
            usuario usuario2;
            usuario usuario3;

            if (usuarioRepository.count() == 0) {

                usuario1 = usuarioRepository.save(
                        usuario.builder()
                                .nombreCompleto("Juan Pérez")
                                .correo("juan@gmail.com")
                                .telefono("3001234567")
                                .build()
                );

                usuario2 = usuarioRepository.save(
                        usuario.builder()
                                .nombreCompleto("María González")
                                .correo("maria@gmail.com")
                                .telefono("3017654321")
                                .build()
                );

                usuario3 = usuarioRepository.save(
                        usuario.builder()
                                .nombreCompleto("Carlos Rodríguez")
                                .correo("carlos@gmail.com")
                                .telefono("3109876543")
                                .build()
                );

            } else {

                usuario1 = usuarioRepository.findAll().get(0);
                usuario2 = usuarioRepository.findAll().get(1);
                usuario3 = usuarioRepository.findAll().get(2);
            }

            plan plan1;
            plan plan2;
            plan plan3;

            if (planRepository.count() == 0) {

                plan1 = planRepository.save(
                        plan.builder()
                                .tipo("Básico")
                                .nombre("Plan Básico")
                                .descripcion("Acceso a las instalaciones básicas.")
                                .precio(new BigDecimal("30000"))
                                .build()
                );

                plan2 = planRepository.save(
                        plan.builder()
                                .tipo("Premium")
                                .nombre("Plan Premium")
                                .descripcion("Acceso completo a todas las instalaciones.")
                                .precio(new BigDecimal("60000"))
                                .build()
                );

                plan3 = planRepository.save(
                        plan.builder()
                                .tipo("VIP")
                                .nombre("Plan VIP")
                                .descripcion("Acceso exclusivo y beneficios adicionales.")
                                .precio(new BigDecimal("100000"))
                                .build()
                );

            } else {

                plan1 = planRepository.findAll().get(0);
                plan2 = planRepository.findAll().get(1);
                plan3 = planRepository.findAll().get(2);
            }

            if (lugarRepository.count() == 0) {

                lugarRepository.save(
                        lugar.builder()
                                .nombre("Salón Principal")
                                .categoria("Salón")
                                .direccion("Calle 10 #20-30")
                                .capacidad(100)
                                .build()
                );

                lugarRepository.save(
                        lugar.builder()
                                .nombre("Sala de Conferencias")
                                .categoria("Conferencia")
                                .direccion("Calle 10 #20-35")
                                .capacidad(50)
                                .build()
                );

                lugarRepository.save(
                        lugar.builder()
                                .nombre("Terraza")
                                .categoria("Exterior")
                                .direccion("Calle 10 #20-40")
                                .capacidad(80)
                                .build()
                );
            }

            reserva reserva1;
            reserva reserva2;
            reserva reserva3;

            if (reservaRepository.count() == 0) {

                reserva1 = reservaRepository.save(
                        reserva.builder()
                                .usuario(usuario1)
                                .plan(plan1)
                                .fecha(LocalDate.of(2026, 10, 5))
                                .hora(LocalTime.of(10, 0))
                                .numeroPersonas(2)
                                .estado("CONFIRMADA")
                                .build()
                );

                reserva2 = reservaRepository.save(
                        reserva.builder()
                                .usuario(usuario2)
                                .plan(plan2)
                                .fecha(LocalDate.of(2026, 10, 10))
                                .hora(LocalTime.of(14, 30))
                                .numeroPersonas(4)
                                .estado("PENDIENTE")
                                .build()
                );

                reserva3 = reservaRepository.save(
                        reserva.builder()
                                .usuario(usuario3)
                                .plan(plan3)
                                .fecha(LocalDate.of(2026, 10, 15))
                                .hora(LocalTime.of(18, 0))
                                .numeroPersonas(6)
                                .estado("CONFIRMADA")
                                .build()
                );

            } else {

                reserva1 = reservaRepository.findAll().get(0);
                reserva2 = reservaRepository.findAll().get(1);
                reserva3 = reservaRepository.findAll().get(2);
            }

            if (pagoRepository.count() == 0) {

                pagoRepository.save(
                        pago.builder()
                                .reserva(reserva1)
                                .monto(new BigDecimal("30000"))
                                .metodoPago("TARJETA")
                                .fechaPago(LocalDate.of(2026, 9, 20))
                                .estadoPago("PAGADO")
                                .build()
                );

                pagoRepository.save(
                        pago.builder()
                                .reserva(reserva2)
                                .monto(new BigDecimal("60000"))
                                .metodoPago("TRANSFERENCIA")
                                .fechaPago(LocalDate.of(2026, 9, 20))
                                .estadoPago("PENDIENTE")
                                .build()
                );

                pagoRepository.save(
                        pago.builder()
                                .reserva(reserva3)
                                .monto(new BigDecimal("100000"))
                                .metodoPago("EFECTIVO")
                                .fechaPago(LocalDate.of(2026, 9, 20))
                                .estadoPago("PAGADO")
                                .build()
                );
            }

        };
    }
}
