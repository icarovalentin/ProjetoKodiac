// ─── Dashboard: carga la sesión, detecta el rol y muestra la vista del rol ────

const MENUS_POR_ROL = {
  medico: [
    { id: 'inicio', icono: '🏠', texto: 'Inicio', titulo: 'Panel del médico' },
    { id: 'agenda', icono: '📅', texto: 'Mi agenda', titulo: 'Mi agenda del día' },
    { id: 'pacientes', icono: '📋', texto: 'Pacientes', titulo: 'Historia clínica y prontuario' },
    { id: 'recetas', icono: '💊', texto: 'Recetas', titulo: 'Recetas' },
    { id: 'certificados', icono: '📄', texto: 'Certificados', titulo: 'Certificados médicos' },
    { id: 'mensajes', icono: '🔔', texto: 'Notificaciones', titulo: 'Notificaciones a pacientes' },
  ],
  recepcionista: [
    { id: 'inicio', icono: '🏠', texto: 'Inicio', titulo: 'Panel de recepción' },
    { id: 'agenda', icono: '📅', texto: 'Turnos', titulo: 'Gestión de turnos' },
    { id: 'pacientes', icono: '👥', texto: 'Pacientes', titulo: 'Registro de pacientes' },
    { id: 'sala', icono: '🪑', texto: 'Sala de espera', titulo: 'Sala de espera' },
    { id: 'mensajes', icono: '🔔', texto: 'Avisos', titulo: 'Confirmaciones y avisos' },
  ],
  enfermeria: [
    { id: 'inicio', icono: '🏠', texto: 'Inicio', titulo: 'Panel de enfermería' },
    { id: 'agenda', icono: '📅', texto: 'Agenda del día', titulo: 'Agenda compartida' },
    { id: 'signos', icono: '💉', texto: 'Signos vitales', titulo: 'Signos vitales' },
    { id: 'pacientes', icono: '📋', texto: 'Pacientes', titulo: 'Pacientes del día' },
  ],
  administrador: [
    { id: 'inicio', icono: '🏠', texto: 'Inicio', titulo: 'Panel de administración' },
    { id: 'usuarios', icono: '⚙️', texto: 'Usuarios y roles', titulo: 'Usuarios y roles' },
    { id: 'agenda', icono: '📅', texto: 'Agendas', titulo: 'Agendas de la clínica' },
    { id: 'reportes', icono: '📊', texto: 'Reportes', titulo: 'Reportes y estadísticas' },
    { id: 'config', icono: '🛠️', texto: 'Configuración', titulo: 'Configuración de la clínica' },
  ],
};

const ETIQUETAS_ROL = {
  medico: 'Médico',
  recepcionista: 'Recepcionista',
  enfermeria: 'Enfermería',
  administrador: 'Administrador',
};

// Datos de ejemplo (modo demo, sin Supabase configurado)
const DEMO = {
  perfil: { nombre_completo: 'Usuario Demo', rol: 'administrador' },
  agenda: [
    { hora: '08:00', paciente: 'María González', motivo: 'Control general', estado: 'confirmado' },
    { hora: '08:30', paciente: 'Juan Pérez', motivo: 'Dolor lumbar', estado: 'sala_espera' },
    { hora: '09:00', paciente: 'Ana Rojas', motivo: 'Primera consulta', estado: 'pendiente' },
    { hora: '09:30', paciente: 'Carlos López', motivo: 'Certificado médico', estado: 'confirmado' },
    { hora: '10:00', paciente: 'Luisa Cáceres', motivo: 'Control de presión', estado: 'sala_espera' },
  ],
  pacientes: [
    { nombre: 'María González', cedula: '4.123.456', ultima: '12/10/2025', telefono: '0981 123 456' },
    { nombre: 'Juan Pérez', cedula: '3.987.654', ultima: '28/09/2025', telefono: '0972 555 333' },
    { nombre: 'Ana Rojas', cedula: '5.234.567', ultima: '—', telefono: '0983 444 222' },
    { nombre: 'Carlos López', cedula: '2.876.543', ultima: '05/11/2025', telefono: '0991 777 888' },
  ],
  usuarios: [
    { nombre: 'Dra. Sofía Méndez', rol: 'Médico', email: 'smendez@clinica.com.py', estado: 'Activo' },
    { nombre: 'Lic. Ramiro Ayala', rol: 'Recepcionista', email: 'rayala@clinica.com.py', estado: 'Activo' },
    { nombre: 'Enf. Carla Benítez', rol: 'Enfermería', email: 'cbenitez@clinica.com.py', estado: 'Activo' },
    { nombre: 'Admin. General', rol: 'Administrador', email: 'admin@clinica.com.py', estado: 'Activo' },
  ],
  notificaciones: [
    { paciente: 'María González', tipo: 'Recordatorio de turno', when: 'Hoy 07:30', estado: 'Enviada' },
    { paciente: 'Carlos López', tipo: 'Resultado disponible', when: 'Ayer 16:00', estado: 'Enviada' },
    { paciente: 'Ana Rojas', tipo: 'Información del médico', when: 'Ayer 11:20', estado: 'Pendiente' },
  ],
};

function badgeEstado(estado) {
  const clases = {
    confirmado: 'badge-verde',
    sala_espera: 'badge-azul',
    pendiente: 'badge-amarillo',
    enviada: 'badge-verde',
  };
  const textos = {
    confirmado: 'Confirmado',
    sala_espera: 'Sala de espera',
    pendiente: 'Pendiente',
    enviada: 'Enviada',
  };
  return `<span class="badge ${clases[estado] || 'badge-gris'}">${textos[estado] || estado}</span>`;
}

function tablaAgenda() {
  return `<div class="panel"><h2>Turnos de hoy</h2>
    <table><thead><tr><th>Hora</th><th>Paciente</th><th>Motivo</th><th>Estado</th></tr></thead><tbody>
    ${DEMO.agenda.map(t => `<tr><td><b>${t.hora}</b></td><td>${t.paciente}</td><td>${t.motivo}</td><td>${badgeEstado(t.estado)}</td></tr>`).join('')}
    </tbody></table></div>`;
}

function tablaPacientes() {
  return `<div class="panel"><h2>Pacientes</h2>
    <table><thead><tr><th>Nombre</th><th>Cédula</th><th>Última visita</th><th>Teléfono</th></tr></thead><tbody>
    ${DEMO.pacientes.map(p => `<tr><td><b>${p.nombre}</b></td><td>${p.cedula}</td><td>${p.ultima}</td><td>${p.telefono}</td></tr>`).join('')}
    </tbody></table></div>`;
}

function tablaUsuarios() {
  return `<div class="panel"><h2>Usuarios del sistema</h2>
    <table><thead><tr><th>Nombre</th><th>Rol</th><th>Correo</th><th>Estado</th></tr></thead><tbody>
    ${DEMO.usuarios.map(u => `<tr><td><b>${u.nombre}</b></td><td>${u.rol}</td><td>${u.email}</td><td><span class="badge badge-verde">${u.estado}</span></td></tr>`).join('')}
    </tbody></table></div>`;
}

function tablaNotificaciones() {
  return `<div class="panel"><h2>Notificaciones</h2>
    <table><thead><tr><th>Paciente</th><th>Tipo</th><th>Fecha</th><th>Estado</th></tr></thead><tbody>
    ${DEMO.notificaciones.map(n => `<tr><td><b>${n.paciente}</b></td><td>${n.tipo}</td><td>${n.when}</td><td>${badgeEstado(n.estado.toLowerCase())}</td></tr>`).join('')}
    </tbody></table></div>`;
}

const VISTAS = {
  inicio: () => `<div class="tarjetas">
      <div class="tarjeta-stat"><div class="valor">${DEMO.agenda.length}</div><div class="etiqueta">Turnos de hoy</div></div>
      <div class="tarjeta-stat"><div class="valor">2</div><div class="etiqueta">En sala de espera</div></div>
      <div class="tarjeta-stat"><div class="valor">3</div><div class="etiqueta">Notificaciones pendientes</div></div>
      <div class="tarjeta-stat"><div class="valor">4</div><div class="etiqueta">Pacientes registrados</div></div>
    </div>` + tablaAgenda(),
  agenda: tablaAgenda,
  pacientes: tablaPacientes,
  usuarios: tablaUsuarios,
  mensajes: tablaNotificaciones,
  recetas: () => `<div class="panel"><h2>Recetas emitidas</h2><div class="vacio">Todavía no hay recetas emitidas en esta sesión. (Se implementará con la base de datos.)</div></div>`,
  certificados: () => `<div class="panel"><h2>Certificados médicos</h2><div class="vacio">Todavía no hay certificados emitidos en esta sesión. (Se implementará con la base de datos.)</div></div>`,
  sala: () => `<div class="panel"><h2>Pacientes en sala de espera</h2>
    <table><thead><tr><th>Paciente</th><th>Hora de llegada</th><th>Estado</th></tr></thead><tbody>
    <tr><td><b>Juan Pérez</b></td><td>08:20</td><td>${badgeEstado('sala_espera')}</td></tr>
    <tr><td><b>Luisa Cáceres</b></td><td>08:35</td><td>${badgeEstado('sala_espera')}</td></tr>
    </tbody></table></div>`,
  signos: () => `<div class="panel"><h2>Registro de signos vitales</h2><div class="vacio">Seleccioná un paciente de la agenda del día para registrar sus signos vitales. (Se implementará con la base de datos.)</div></div>`,
  reportes: () => `<div class="tarjetas">
      <div class="tarjeta-stat"><div class="valor">124</div><div class="etiqueta">Consultas del mes</div></div>
      <div class="tarjeta-stat"><div class="valor">38</div><div class="etiqueta">Recetas emitidas</div></div>
      <div class="tarjeta-stat"><div class="valor">12</div><div class="etiqueta">Certificados emitidos</div></div>
      <div class="tarjeta-stat"><div class="valor">96%</div><div class="etiqueta">Turnos confirmados</div></div>
    </div>`,
  config: () => `<div class="panel"><h2>Configuración de la clínica</h2><div class="vacio">Aquí se configurarán los datos de la clínica, horarios de atención y plantillas de recetas. (Se implementará con la base de datos.)</div></div>`,
};

let rolActual = null;

function mostrarVista(id) {
  const item = MENUS_POR_ROL[rolActual].find(m => m.id === id);
  document.getElementById('titulo-vista').textContent = item ? item.titulo : 'Panel';
  document.getElementById('vista').innerHTML = (VISTAS[id] || VISTAS.inicio)();
  document.querySelectorAll('#menu button').forEach(b =>
    b.classList.toggle('activo', b.dataset.vista === id));
}

function construirMenu() {
  const menu = document.getElementById('menu');
  menu.innerHTML = MENUS_POR_ROL[rolActual]
    .map(m => `<button data-vista="${m.id}"><span>${m.icono}</span> ${m.texto}</button>`)
    .join('');
  menu.querySelectorAll('button').forEach(b =>
    b.addEventListener('click', () => mostrarVista(b.dataset.vista)));
}

async function obtenerPerfil() {
  if (window.sb) {
    const { data: { user } } = await window.sb.auth.getUser();
    if (!user) { window.location.href = 'login.html'; return null; }
    const { data: perfil } = await window.sb
      .from('profiles')
      .select('nombre_completo, rol')
      .eq('id', user.id)
      .single();
    return perfil || { nombre_completo: user.email, rol: ROLES.MEDICO };
  }
  const demoEmail = sessionStorage.getItem('demo_usuario');
  return { ...DEMO.perfil, nombre_completo: demoEmail || DEMO.perfil.nombre_completo };
}

async function iniciar() {
  const perfil = await obtenerPerfil();
  if (!perfil) return;

  rolActual = perfil.rol;
  if (!MENUS_POR_ROL[rolActual]) rolActual = ROLES.ADMINISTRADOR;

  document.getElementById('usuario-nombre').textContent = perfil.nombre_completo;
  document.getElementById('usuario-rol').textContent = ETIQUETAS_ROL[rolActual] || rolActual;
  document.getElementById('fecha-hoy').textContent = new Date()
    .toLocaleDateString('es-PY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  if (!window.sb) document.getElementById('aviso-demo').style.display = 'block';
  else document.getElementById('aviso-demo').style.display = 'none';

  construirMenu();
  mostrarVista('inicio');

  document.getElementById('btn-salir').addEventListener('click', async () => {
    if (window.sb) await window.sb.auth.signOut();
    sessionStorage.removeItem('demo_usuario');
    window.location.href = 'login.html';
  });
}

iniciar();
