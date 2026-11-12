# CliniSalud — Sistema de gestión para clínicas y consultorios (Paraguay)

Webapp en español para clínicas y consultorios: agendas médicas, historias
clínicas y prontuario, recetas, certificados médicos y notificaciones a pacientes.

## Estado actual (v0.1)

- ✅ Landing page con botón "Ingresar al sistema" (`index.html`)
- ✅ Login con usuario/contraseña (Supabase Auth) (`login.html`)
- ✅ Dashboard según rol: médico, recepcionista, enfermería o administrador (`dashboard.html`)
- ✅ Esquema de base de datos con roles y RLS (`sql/schema.sql`)
- ⏳ Próximos pasos: gestión real de turnos, historia clínica, recetas/certificados PDF, notificaciones

## Estructura

```
clinica-app/
├── index.html          Landing page
├── login.html          Inicio de sesión
├── dashboard.html      Panel principal (según rol)
├── js/
│   ├── config.js       Configuración de Supabase (URL y anon key)
│   └── dashboard.js    Lógica del dashboard y vistas por rol
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

Mientras `js/config.js` no esté configurado, la app funciona con datos de
ejemplo: el login acepta cualquier correo/contraseña y el dashboard muestra
turnos, pacientes y usuarios de prueba.

## Roles

| Rol | Acceso |
|---|---|
| Médico | Agenda, historia clínica, recetas, certificados, notificaciones |
| Recepcionista | Pacientes, turnos, sala de espera, avisos |
| Enfermería | Agenda compartida, signos vitales, pacientes del día |
| Administrador | Usuarios y roles, agendas, reportes, configuración |
