# CliniSalud — Sistema de gestión para clínicas y consultorios (Paraguay)

Sistema web en español, 100% en la nube, que centraliza la gestión administrativa,
clínica y financiera de clínicas médicas, consultorios particulares, dentistas y
profesionales de la salud en general.

## Módulos

| Módulo | Qué hace |
|---|---|
| 📅 Agenda y atendimientos | Turnos por paciente, cambio de estados (pendiente, confirmado, sala de espera, atendido), sala de espera |
| 👥 Pacientes | Registro completo (cédula, teléfono, alergias, etc.) y prontuario con consultas, turnos y facturas |
| 💊 Recetas y certificados | Emisión desde el sistema e impresión con datos de la clínica y firma |
| 💰 Facturación y finanzas | Facturas en guaraníes (₲), registro de pagos, ingresos del mes y montos por cobrar |
| 📊 Reportes | Turnos del mes, tasa de confirmación, cancelaciones, ingresos y resumen por estado |
| ✅ Tareas y avisos internos | Tareas con responsable y vencimiento, avisos dirigidos a un rol o a todo el equipo |
| 🔔 Notificaciones | Mensajes al paciente: recordatorios, resultados e información del médico |
| 👤 Portal del paciente | Acceso exclusivo del paciente: sus turnos, facturas y mensajes |

## Roles

Al ingresar, cada usuario ve su propio panel:

| Rol | Acceso |
|---|---|
| Médico | Agenda, pacientes, historia clínica, recetas, certificados, tareas, avisos, notificaciones |
| Recepcionista | Turnos, pacientes, facturación, sala de espera, tareas, avisos |
| Enfermería | Agenda, pacientes, signos vitales, tareas, avisos |
| Administrador | Todo: agendas, pacientes, facturación, reportes, usuarios, configuración |
| Paciente | Portal del paciente (turnos, facturas y mensajes propios) |

## Estructura

```
ProjetoKodiac/
├── index.html          Landing page (diseño Stitch, Sanatorio Serena)
├── login.html          Inicio de sesión del equipo
├── dashboard.html      Redirige según el rol al panel correcto
├── portal.html         Portal del paciente
├── agenda.html         Agenda de turnos (grilla día/semana + panel nueva cita)
├── pacientes.html      Pacientes: listado, alta con validación de C.I. y ficha/prontuario
├── preconsulta.html    Cola del día y registro de signos vitales
├── consultas.html      Historia clínica con formato SOAP
├── recetas.html        Recetas, certificados y órdenes de estudios (impresión A4 membretada)
├── facturacion.html    Facturas, cobros y caja del día (guaraníes ₲)
├── reportes.html       KPIs, gráficos de tendencia y estadísticas por especialidad
├── administracion.html Usuarios, horarios, feriados, auditoría y configuración
├── js/
│   ├── config.js       Configuración de Supabase (URL y anon key)
│   ├── tokens.js       Tokens de diseño (paleta Sanatorio Serena para Tailwind)
│   ├── shell.js        Estructura común: barra lateral, cabecera, roles y avisos
│   └── store.js        Capa de datos (Supabase o modo demo con localStorage)
└── sql/
    └── schema.sql      Tablas, roles y políticas RLS para Supabase
```

## Puesta en marcha

1. Creá un proyecto en [Supabase](https://supabase.com).
2. Ejecutá `sql/schema.sql` en el SQL Editor del proyecto.
3. En Supabase → Authentication, creá los usuarios de la clínica.
4. Editá `js/config.js` y pegá la **URL** y la **anon public key** de tu proyecto
   (Project Settings → API).
5. Asigná el rol de cada usuario en la tabla `profiles`.
6. Serví el sitio con cualquier servidor estático, por ejemplo:

   ```bash
   npx serve .
   # o
   python3 -m http.server 8080
   ```

   Abrí `http://localhost:8080`.

## Modo demo

Mientras `js/config.js` no esté configurado, la app funciona con datos de ejemplo
guardados en el navegador: el login acepta cualquier correo/contraseña y se pueden
crear y editar turnos, pacientes, facturas, tareas y avisos normalmente. Los datos
se guardan en `localStorage` del navegador.

## Próximos pasos

- Versión móvil de las pantallas (carpetas de Stitch para móvil)
- Envío real de notificaciones (WhatsApp / correo)
- Firma digital de recetas y certificados
- Reportes exportables
