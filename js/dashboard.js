const MENUS_POR_ROL = {
  medico: [
    { id: 'inicio', icono: '🏠', texto: 'Inicio', titulo: 'Panel del médico' },
    { id: 'agenda', icono: '📅', texto: 'Mi agenda', titulo: 'Mi agenda' },
    { id: 'pacientes', icono: '👥', texto: 'Pacientes', titulo: 'Pacientes' },
    { id: 'consultas', icono: '📋', texto: 'Historia clínica', titulo: 'Historia clínica' },
    { id: 'recetas', icono: '💊', texto: 'Recetas', titulo: 'Recetas' },
    { id: 'certificados', icono: '📄', texto: 'Certificados', titulo: 'Certificados médicos' },
    { id: 'tareas', icono: '✅', texto: 'Tareas', titulo: 'Tareas' },
    { id: 'avisos', icono: '📣', texto: 'Avisos internos', titulo: 'Avisos internos' },
    { id: 'mensajes', icono: '🔔', texto: 'Notificaciones', titulo: 'Notificaciones a pacientes' },
  ],
  recepcionista: [
    { id: 'inicio', icono: '🏠', texto: 'Inicio', titulo: 'Panel de recepción' },
    { id: 'agenda', icono: '📅', texto: 'Turnos', titulo: 'Gestión de turnos' },
    { id: 'pacientes', icono: '👥', texto: 'Pacientes', titulo: 'Registro de pacientes' },
    { id: 'facturas', icono: '💰', texto: 'Facturación', titulo: 'Facturación y cobros' },
    { id: 'sala', icono: '🪑', texto: 'Sala de espera', titulo: 'Sala de espera' },
    { id: 'tareas', icono: '✅', texto: 'Tareas', titulo: 'Tareas' },
    { id: 'avisos', icono: '📣', texto: 'Avisos internos', titulo: 'Avisos internos' },
    { id: 'mensajes', icono: '🔔', texto: 'Avisos a pacientes', titulo: 'Notificaciones a pacientes' },
  ],
  enfermeria: [
    { id: 'inicio', icono: '🏠', texto: 'Inicio', titulo: 'Panel de enfermería' },
    { id: 'agenda', icono: '📅', texto: 'Agenda del día', titulo: 'Agenda compartida' },
    { id: 'pacientes', icono: '👥', texto: 'Pacientes', titulo: 'Pacientes' },
    { id: 'signos', icono: '💉', texto: 'Signos vitales', titulo: 'Signos vitales' },
    { id: 'tareas', icono: '✅', texto: 'Tareas', titulo: 'Tareas' },
    { id: 'avisos', icono: '📣', texto: 'Avisos internos', titulo: 'Avisos internos' },
  ],
  administrador: [
    { id: 'inicio', icono: '🏠', texto: 'Inicio', titulo: 'Panel de administración' },
    { id: 'agenda', icono: '📅', texto: 'Agendas', titulo: 'Agendas de la clínica' },
    { id: 'pacientes', icono: '👥', texto: 'Pacientes', titulo: 'Pacientes' },
    { id: 'facturas', icono: '💰', texto: 'Facturación', titulo: 'Facturación y finanzas' },
    { id: 'reportes', icono: '📊', texto: 'Reportes', titulo: 'Reportes y estadísticas' },
    { id: 'usuarios', icono: '⚙️', texto: 'Usuarios y roles', titulo: 'Usuarios y roles' },
    { id: 'tareas', icono: '✅', texto: 'Tareas', titulo: 'Tareas' },
    { id: 'avisos', icono: '📣', texto: 'Avisos internos', titulo: 'Avisos internos' },
    { id: 'config', icono: '🛠️', texto: 'Configuración', titulo: 'Configuración de la clínica' },
  ],
};

const ETIQUETAS_ROL = {
  medico: 'Médico',
  recepcionista: 'Recepcionista',
  enfermeria: 'Enfermería',
  administrador: 'Administrador',
  paciente: 'Paciente',
};

const ETIQUETAS_TURNO = {
  pendiente: ['badge-amarillo', 'Pendiente'],
  confirmado: ['badge-verde', 'Confirmado'],
  sala_espera: ['badge-azul', 'Sala de espera'],
  atendido: ['badge-gris', 'Atendido'],
  cancelado: ['badge-rojo', 'Cancelado'],
  ausente: ['badge-gris', 'Ausente'],
};

const ETIQUETAS_FACTURA = {
  pendiente: ['badge-amarillo', 'Pendiente'],
  pagada: ['badge-verde', 'Pagada'],
  vencida: ['badge-rojo', 'Vencida'],
  anulada: ['badge-gris', 'Anulada'],
};

function esc(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function badge(mapa, estado) {
  const [clase, texto] = mapa[estado] || ['badge-gris', estado];
  return `<span class="badge ${clase}">${esc(texto)}</span>`;
}

function nombrePaciente(pacientes, id) {
  const p = pacientes.find(x => x.id === id);
  return p ? p.nombre_completo : '—';
}

function opcionesPacientes(pacientes, seleccionado) {
  return pacientes.map(p =>
    `<option value="${esc(p.id)}" ${p.id === seleccionado ? 'selected' : ''}>${esc(p.nombre_completo)}</option>`
  ).join('');
}

function formGroup(label, input) {
  return `<div class="campo"><label>${label}</label>${input}</div>`;
}

function inputTexto(id, placeholder, requerido = false, tipo = 'text', valor = '') {
  return `<input type="${tipo}" id="${id}" placeholder="${esc(placeholder)}" value="${esc(valor)}" ${requerido ? 'required' : ''} />`;
}

function selectEstado(id, opciones, valorActual) {
  return `<select id="${id}">${opciones.map(([v, t]) =>
    `<option value="${v}" ${v === valorActual ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
}

let cache = {};

async function cargar(tabla) {
  if (!cache[tabla]) cache[tabla] = await Store.list(tabla);
  return cache[tabla];
}

function invalidar(...tablas) {
  tablas.forEach(t => { delete cache[t]; });
}

const VISTAS = {
  async inicio() {
    const [turnos, pacientes, facturas, tareas] = await Promise.all([
      cargar('turnos'), cargar('pacientes'), cargar('facturas'), cargar('tareas'),
    ]);
    const hoy = new Date().toISOString().slice(0, 10);
    const turnosHoy = turnos.filter(t => t.fecha === hoy);
    const enSala = turnosHoy.filter(t => t.estado === 'sala_espera').length;
    const pendientesCobro = facturas.filter(f => f.estado === 'pendiente');
    const totalPendiente = pendientesCobro.reduce((s, f) => s + Number(f.monto), 0);
    const tareasPendientes = tareas.filter(t => t.estado !== 'completada').length;

    return `<div class="tarjetas">
      <div class="tarjeta-stat"><div class="valor">${turnosHoy.length}</div><div class="etiqueta">Turnos de hoy</div></div>
      <div class="tarjeta-stat"><div class="valor">${enSala}</div><div class="etiqueta">En sala de espera</div></div>
      <div class="tarjeta-stat"><div class="valor">${pacientes.length}</div><div class="etiqueta">Pacientes registrados</div></div>
      <div class="tarjeta-stat"><div class="valor">${formatearMonto(totalPendiente)}</div><div class="etiqueta">${pendientesCobro.length} facturas por cobrar</div></div>
      <div class="tarjeta-stat"><div class="valor">${tareasPendientes}</div><div class="etiqueta">Tareas pendientes</div></div>
    </div>
    ${await VISTAS.agendaTabla(turnosHoy)}`;
  },

  async agendaTabla(turnos) {
    const pacientes = await cargar('pacientes');
    const orden = [...turnos].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
    return `<div class="panel"><h2>Turnos</h2>${orden.length ? `
    <table><thead><tr><th>Fecha</th><th>Hora</th><th>Paciente</th><th>Motivo</th><th>Estado</th><th>Cambiar estado</th></tr></thead><tbody>
    ${orden.map(t => `<tr>
      <td>${formatearFecha(t.fecha)}</td>
      <td><b>${esc(t.hora)}</b></td>
      <td>${esc(nombrePaciente(pacientes, t.paciente_id))}</td>
      <td>${esc(t.motivo || '—')}</td>
      <td>${badge(ETIQUETAS_TURNO, t.estado)}</td>
      <td><select class="cambio-estado" data-id="${esc(t.id)}">
        ${Object.entries(ETIQUETAS_TURNO).map(([v, [, txt]]) =>
          `<option value="${v}" ${v === t.estado ? 'selected' : ''}>${txt}</option>`).join('')}
      </select></td>
    </tr>`).join('')}
    </tbody></table>` : '<div class="vacio">No hay turnos registrados.</div>'}</div>`;
  },

  async agenda() {
    const turnos = await cargar('turnos');
    const pacientes = await cargar('pacientes');
    return `<div class="panel"><h2>Nuevo turno</h2>
      <form id="form-turno" class="form-fila">
        ${formGroup('Paciente', `<select id="t-paciente" required>${opcionesPacientes(pacientes)}</select>`)}
        ${formGroup('Fecha', inputTexto('t-fecha', '', true, 'date', new Date().toISOString().slice(0, 10)))}
        ${formGroup('Hora', inputTexto('t-hora', '', true, 'time'))}
        ${formGroup('Motivo', inputTexto('t-motivo', 'Motivo de la consulta'))}
        <button type="submit" class="btn-panel">Agendar</button>
      </form>
    </div>
    ${await VISTAS.agendaTabla(turnos)}`;
  },

  async pacientes() {
    const pacientes = await cargar('pacientes');
    return `<div class="panel"><h2>Nuevo paciente</h2>
      <form id="form-paciente" class="form-fila">
        ${formGroup('Nombre completo', inputTexto('p-nombre', 'Nombre y apellido', true))}
        ${formGroup('Cédula', inputTexto('p-cedula', 'N.º de cédula'))}
        ${formGroup('Fecha de nacimiento', inputTexto('p-nac', '', false, 'date'))}
        ${formGroup('Teléfono', inputTexto('p-telefono', '0981 000 000'))}
        ${formGroup('Correo', inputTexto('p-email', 'correo@ejemplo.com', false, 'email'))}
        ${formGroup('Alergias', inputTexto('p-alergias', 'Alergias conocidas'))}
        <button type="submit" class="btn-panel">Registrar</button>
      </form>
    </div>
    <div class="panel"><h2>Pacientes registrados</h2>${pacientes.length ? `
    <table><thead><tr><th>Nombre</th><th>Cédula</th><th>Teléfono</th><th>Correo</th><th>Alergias</th><th></th></tr></thead><tbody>
    ${pacientes.map(p => `<tr>
      <td><b>${esc(p.nombre_completo)}</b></td>
      <td>${esc(p.cedula_identidad || '—')}</td>
      <td>${esc(p.telefono || '—')}</td>
      <td>${esc(p.email || '—')}</td>
      <td>${esc(p.alergias || '—')}</td>
      <td><button class="btn-mini btn-ficha" data-id="${esc(p.id)}">Ver ficha</button></td>
    </tr>`).join('')}
    </tbody></table>` : '<div class="vacio">Todavía no hay pacientes registrados.</div>'}</div>
    <div id="ficha-paciente"></div>`;
  },

  async fichaPaciente(id) {
    const [pacientes, consultas, turnos, facturas] = await Promise.all([
      cargar('pacientes'), cargar('consultas'), cargar('turnos'), cargar('facturas'),
    ]);
    const p = pacientes.find(x => x.id === id);
    if (!p) return;
    const susConsultas = consultas.filter(c => c.paciente_id === id);
    const susTurnos = turnos.filter(t => t.paciente_id === id);
    const susFacturas = facturas.filter(f => f.paciente_id === id);

    document.getElementById('ficha-paciente').innerHTML = `
    <div class="panel"><h2>Prontuario: ${esc(p.nombre_completo)}</h2>
      <div class="ficha-datos">
        <div><b>Cédula:</b> ${esc(p.cedula_identidad || '—')}</div>
        <div><b>Nacimiento:</b> ${formatearFecha(p.fecha_nacimiento)}</div>
        <div><b>Teléfono:</b> ${esc(p.telefono || '—')}</div>
        <div><b>Correo:</b> ${esc(p.email || '—')}</div>
        <div><b>Dirección:</b> ${esc(p.direccion || '—')}</div>
        <div><b>Sangre:</b> ${esc(p.sangre_tipo || '—')}</div>
        <div><b>Alergias:</b> ${esc(p.alergias || '—')}</div>
      </div>
      <h2 class="sub-panel">Consultas anteriores</h2>
      ${susConsultas.length ? `<table><thead><tr><th>Fecha</th><th>Motivo</th><th>Diagnóstico</th><th>Tratamiento</th></tr></thead><tbody>
        ${susConsultas.map(c => `<tr><td>${formatearFecha(c.fecha)}</td><td>${esc(c.motivo_consulta || '—')}</td><td>${esc(c.diagnostico || '—')}</td><td>${esc(c.tratamiento || '—')}</td></tr>`).join('')}
      </tbody></table>` : '<div class="vacio">Sin consultas registradas.</div>'}
      <h2 class="sub-panel">Turnos</h2>
      ${susTurnos.length ? `<table><thead><tr><th>Fecha</th><th>Hora</th><th>Motivo</th><th>Estado</th></tr></thead><tbody>
        ${susTurnos.map(t => `<tr><td>${formatearFecha(t.fecha)}</td><td>${esc(t.hora)}</td><td>${esc(t.motivo || '—')}</td><td>${badge(ETIQUETAS_TURNO, t.estado)}</td></tr>`).join('')}
      </tbody></table>` : '<div class="vacio">Sin turnos.</div>'}
      <h2 class="sub-panel">Facturas</h2>
      ${susFacturas.length ? `<table><thead><tr><th>Número</th><th>Concepto</th><th>Monto</th><th>Estado</th></tr></thead><tbody>
        ${susFacturas.map(f => `<tr><td>${esc(f.numero || '—')}</td><td>${esc(f.concepto)}</td><td>${formatearMonto(f.monto)}</td><td>${badge(ETIQUETAS_FACTURA, f.estado)}</td></tr>`).join('')}
      </tbody></table>` : '<div class="vacio">Sin facturas.</div>'}
    </div>`;
    document.getElementById('ficha-paciente').scrollIntoView({ behavior: 'smooth' });
  },

  async consultas() {
    const [consultas, pacientes] = await Promise.all([cargar('consultas'), cargar('pacientes')]);
    return `<div class="panel"><h2>Nueva consulta</h2>
      <form id="form-consulta" class="form-fila">
        ${formGroup('Paciente', `<select id="c-paciente" required>${opcionesPacientes(pacientes)}</select>`)}
        ${formGroup('Motivo', inputTexto('c-motivo', 'Motivo de la consulta'))}
        ${formGroup('Diagnóstico', inputTexto('c-diagnostico', 'Diagnóstico'))}
        ${formGroup('Tratamiento', inputTexto('c-tratamiento', 'Tratamiento indicado'))}
        ${formGroup('Presión arterial', inputTexto('c-presion', '120/80'))}
        ${formGroup('Temperatura (°C)', inputTexto('c-temp', '36.5', false, 'number', '', 'step="0.1"'))}
        ${formGroup('Peso (kg)', inputTexto('c-peso', '70', false, 'number'))}
        ${formGroup('Observaciones', inputTexto('c-obs', 'Observaciones'))}
        <button type="submit" class="btn-panel">Guardar consulta</button>
      </form>
    </div>
    <div class="panel"><h2>Consultas registradas</h2>${consultas.length ? `
    <table><thead><tr><th>Fecha</th><th>Paciente</th><th>Motivo</th><th>Diagnóstico</th><th>Tratamiento</th></tr></thead><tbody>
    ${consultas.map(c => `<tr>
      <td>${formatearFecha(c.fecha)}</td>
      <td><b>${esc(nombrePaciente(pacientes, c.paciente_id))}</b></td>
      <td>${esc(c.motivo_consulta || '—')}</td>
      <td>${esc(c.diagnostico || '—')}</td>
      <td>${esc(c.tratamiento || '—')}</td>
    </tr>`).join('')}
    </tbody></table>` : '<div class="vacio">Sin consultas registradas.</div>'}</div>`;
  },

  async recetas() {
    const [recetas, pacientes] = await Promise.all([cargar('recetas'), cargar('pacientes')]);
    return `<div class="panel"><h2>Emitir receta</h2>
      <form id="form-receta" class="form-fila">
        ${formGroup('Paciente', `<select id="r-paciente" required>${opcionesPacientes(pacientes)}</select>`)}
        ${formGroup('Medicamentos e indicaciones', `<textarea id="r-contenido" rows="3" required placeholder="Ej: Ibuprofeno 400 mg — 1 comprimido cada 8 horas durante 5 días."></textarea>`)}
        <button type="submit" class="btn-panel">Emitir receta</button>
      </form>
    </div>
    <div class="panel"><h2>Recetas emitidas</h2>${recetas.length ? `
    <table><thead><tr><th>Fecha</th><th>Paciente</th><th>Contenido</th><th></th></tr></thead><tbody>
    ${recetas.map(r => `<tr>
      <td>${formatearFecha(r.fecha)}</td>
      <td><b>${esc(nombrePaciente(pacientes, r.paciente_id))}</b></td>
      <td>${esc(r.contenido)}</td>
      <td><button class="btn-mini btn-imprimir" data-id="${esc(r.id)}" data-tipo="recetas">Imprimir</button></td>
    </tr>`).join('')}
    </tbody></table>` : '<div class="vacio">Sin recetas emitidas.</div>'}</div>`;
  },

  async certificados() {
    const [certificados, pacientes] = await Promise.all([cargar('certificados'), cargar('pacientes')]);
    return `<div class="panel"><h2>Emitir certificado médico</h2>
      <form id="form-certificado" class="form-fila">
        ${formGroup('Paciente', `<select id="ce-paciente" required>${opcionesPacientes(pacientes)}</select>`)}
        ${formGroup('Tipo', `<select id="ce-tipo">
          <option value="reposo">Certificado de reposo</option>
          <option value="salud">Certificado de salud</option>
          <option value="otro">Otro</option>
        </select>`)}
        ${formGroup('Días de reposo', inputTexto('ce-dias', '0', false, 'number'))}
        ${formGroup('Contenido', `<textarea id="ce-contenido" rows="3" required placeholder="Texto del certificado"></textarea>`)}
        <button type="submit" class="btn-panel">Emitir certificado</button>
      </form>
    </div>
    <div class="panel"><h2>Certificados emitidos</h2>${certificados.length ? `
    <table><thead><tr><th>Fecha</th><th>Paciente</th><th>Tipo</th><th>Días</th><th>Contenido</th><th></th></tr></thead><tbody>
    ${certificados.map(c => `<tr>
      <td>${formatearFecha(c.fecha)}</td>
      <td><b>${esc(nombrePaciente(pacientes, c.paciente_id))}</b></td>
      <td>${esc(c.tipo)}</td>
      <td>${c.dias_reposo || '—'}</td>
      <td>${esc(c.contenido)}</td>
      <td><button class="btn-mini btn-imprimir" data-id="${esc(c.id)}" data-tipo="certificados">Imprimir</button></td>
    </tr>`).join('')}
    </tbody></table>` : '<div class="vacio">Sin certificados emitidos.</div>'}</div>`;
  },

  async facturas() {
    const [facturas, pacientes] = await Promise.all([cargar('facturas'), cargar('pacientes')]);
    const pendientes = facturas.filter(f => f.estado === 'pendiente');
    const cobradas = facturas.filter(f => f.estado === 'pagada');
    const mesActual = new Date().toISOString().slice(0, 7);
    const ingresosMes = cobradas
      .filter(f => (f.pagada_en || f.fecha || '').slice(0, 7) === mesActual)
      .reduce((s, f) => s + Number(f.monto), 0);

    return `<div class="tarjetas">
      <div class="tarjeta-stat"><div class="valor">${formatearMonto(ingresosMes)}</div><div class="etiqueta">Ingresos del mes</div></div>
      <div class="tarjeta-stat"><div class="valor">${formatearMonto(pendientes.reduce((s, f) => s + Number(f.monto), 0))}</div><div class="etiqueta">Por cobrar (${pendientes.length} facturas)</div></div>
      <div class="tarjeta-stat"><div class="valor">${formatearMonto(cobradas.reduce((s, f) => s + Number(f.monto), 0))}</div><div class="etiqueta">Total cobrado</div></div>
    </div>
    <div class="panel"><h2>Nueva factura</h2>
      <form id="form-factura" class="form-fila">
        ${formGroup('Paciente', `<select id="f-paciente" required>${opcionesPacientes(pacientes)}</select>`)}
        ${formGroup('Concepto', inputTexto('f-concepto', 'Ej: Consulta general', true))}
        ${formGroup('Monto (₲)', inputTexto('f-monto', '150000', true, 'number'))}
        ${formGroup('Vencimiento', inputTexto('f-vencimiento', '', false, 'date'))}
        <button type="submit" class="btn-panel">Emitir factura</button>
      </form>
    </div>
    <div class="panel"><h2>Facturas</h2>${facturas.length ? `
    <table><thead><tr><th>Número</th><th>Paciente</th><th>Concepto</th><th>Monto</th><th>Fecha</th><th>Vencimiento</th><th>Estado</th><th></th></tr></thead><tbody>
    ${facturas.map(f => `<tr>
      <td>${esc(f.numero || '—')}</td>
      <td><b>${esc(nombrePaciente(pacientes, f.paciente_id))}</b></td>
      <td>${esc(f.concepto)}</td>
      <td>${formatearMonto(f.monto)}</td>
      <td>${formatearFecha(f.fecha)}</td>
      <td>${formatearFecha(f.vencimiento)}</td>
      <td>${badge(ETIQUETAS_FACTURA, f.estado)}</td>
      <td>${f.estado === 'pendiente' ? `<button class="btn-mini btn-cobrar" data-id="${esc(f.id)}">Registrar pago</button>` : ''}</td>
    </tr>`).join('')}
    </tbody></table>` : '<div class="vacio">Sin facturas emitidas.</div>'}</div>`;
  },

  async reportes() {
    const [turnos, pacientes, facturas, consultas] = await Promise.all([
      cargar('turnos'), cargar('pacientes'), cargar('facturas'), cargar('consultas'),
    ]);
    const mesActual = new Date().toISOString().slice(0, 7);
    const turnosMes = turnos.filter(t => (t.fecha || '').slice(0, 7) === mesActual);
    const atendidos = turnos.filter(t => t.estado === 'atendido').length;
    const confirmados = turnos.filter(t => t.estado === 'confirmado').length;
    const cancelados = turnos.filter(t => t.estado === 'cancelado').length;
    const total = turnos.length || 1;
    const ingresosMes = facturas
      .filter(f => f.estado === 'pagada' && (f.pagada_en || f.fecha || '').slice(0, 7) === mesActual)
      .reduce((s, f) => s + Number(f.monto), 0);

    return `<div class="tarjetas">
      <div class="tarjeta-stat"><div class="valor">${turnosMes.length}</div><div class="etiqueta">Turnos del mes</div></div>
      <div class="tarjeta-stat"><div class="valor">${Math.round(((confirmados + atendidos) / total) * 100)}%</div><div class="etiqueta">Turnos confirmados o atendidos</div></div>
      <div class="tarjeta-stat"><div class="valor">${consultas.length}</div><div class="etiqueta">Consultas registradas</div></div>
      <div class="tarjeta-stat"><div class="valor">${pacientes.length}</div><div class="etiqueta">Pacientes registrados</div></div>
      <div class="tarjeta-stat"><div class="valor">${formatearMonto(ingresosMes)}</div><div class="etiqueta">Ingresos del mes</div></div>
      <div class="tarjeta-stat"><div class="valor">${cancelados}</div><div class="etiqueta">Turnos cancelados</div></div>
    </div>
    <div class="panel"><h2>Resumen por estado de turno</h2>
      <table><thead><tr><th>Estado</th><th>Cantidad</th><th>Porcentaje</th></tr></thead><tbody>
      ${Object.entries(ETIQUETAS_TURNO).map(([v, [, txt]]) => {
        const cant = turnos.filter(t => t.estado === v).length;
        return `<tr><td>${txt}</td><td>${cant}</td><td>${Math.round((cant / total) * 100)}%</td></tr>`;
      }).join('')}
      </tbody></table>
    </div>`;
  },

  async usuarios() {
    const usuarios = await cargar('usuarios');
    return `<div class="panel"><h2>Usuarios del sistema</h2>
    <table><thead><tr><th>Nombre</th><th>Rol</th><th>Correo</th><th>Estado</th></tr></thead><tbody>
    ${usuarios.map(u => `<tr><td><b>${esc(u.nombre)}</b></td><td>${esc(u.rol)}</td><td>${esc(u.email)}</td><td><span class="badge badge-verde">${esc(u.estado)}</span></td></tr>`).join('')}
    </tbody></table>
    <p class="nota">Los usuarios se crean desde el panel de Supabase → Authentication. El rol de cada uno se asigna en la tabla <code>profiles</code>.</p></div>`;
  },

  async tareas() {
    const tareas = await cargar('tareas');
    const orden = [...tareas].sort((a, b) => (a.fecha_vencimiento || '').localeCompare(b.fecha_vencimiento || ''));
    return `<div class="panel"><h2>Nueva tarea</h2>
      <form id="form-tarea" class="form-fila">
        ${formGroup('Título', inputTexto('ta-titulo', 'Qué hay que hacer', true))}
        ${formGroup('Responsable', `<select id="ta-responsable">
          <option>Recepción</option><option>Enfermería</option><option>Administración</option><option>Médico</option>
        </select>`)}
        ${formGroup('Vencimiento', inputTexto('ta-vencimiento', '', false, 'date'))}
        <button type="submit" class="btn-panel">Crear tarea</button>
      </form>
    </div>
    <div class="panel"><h2>Tareas del equipo</h2>${orden.length ? `
    <table><thead><tr><th></th><th>Tarea</th><th>Responsable</th><th>Vencimiento</th><th>Estado</th></tr></thead><tbody>
    ${orden.map(t => `<tr>
      <td><input type="checkbox" class="chk-tarea" data-id="${esc(t.id)}" ${t.estado === 'completada' ? 'checked' : ''} /></td>
      <td class="${t.estado === 'completada' ? 'tachado' : ''}"><b>${esc(t.titulo)}</b>${t.descripcion ? `<br /><small>${esc(t.descripcion)}</small>` : ''}</td>
      <td>${esc(t.responsable || '—')}</td>
      <td>${formatearFecha(t.fecha_vencimiento)}</td>
      <td>${badge({ pendiente: ['badge-amarillo', 'Pendiente'], en_progreso: ['badge-azul', 'En progreso'], completada: ['badge-verde', 'Completada'] }, t.estado)}</td>
    </tr>`).join('')}
    </tbody></table>` : '<div class="vacio">Sin tareas pendientes.</div>'}</div>`;
  },

  async avisos() {
    const avisos = await cargar('avisos');
    return `<div class="panel"><h2>Nuevo aviso interno</h2>
      <form id="form-aviso" class="form-fila">
        ${formGroup('Título', inputTexto('a-titulo', 'Título del aviso', true))}
        ${formGroup('Mensaje', `<textarea id="a-mensaje" rows="2" required placeholder="Detalle del aviso"></textarea>`)}
        ${formGroup('Dirigido a', `<select id="a-rol">
          <option value="">Todo el equipo</option>
          <option value="medico">Médicos</option>
          <option value="recepcionista">Recepción</option>
          <option value="enfermeria">Enfermería</option>
          <option value="administrador">Administración</option>
        </select>`)}
        <button type="submit" class="btn-panel">Publicar aviso</button>
      </form>
    </div>
    <div class="panel"><h2>Avisos publicados</h2>${avisos.length ? `
    <table><thead><tr><th>Título</th><th>Mensaje</th><th>Dirigido a</th><th>Fecha</th></tr></thead><tbody>
    ${avisos.map(a => `<tr>
      <td><b>${esc(a.titulo)}</b></td>
      <td>${esc(a.mensaje)}</td>
      <td>${a.para_rol ? esc(ETIQUETAS_ROL[a.para_rol] || a.para_rol) : 'Todo el equipo'}</td>
      <td>${formatearFecha(a.created_at)}</td>
    </tr>`).join('')}
    </tbody></table>` : '<div class="vacio">Sin avisos publicados.</div>'}</div>`;
  },

  async mensajes() {
    const [notificaciones, pacientes] = await Promise.all([cargar('notificaciones'), cargar('pacientes')]);
    return `<div class="panel"><h2>Nueva notificación al paciente</h2>
      <form id="form-notificacion" class="form-fila">
        ${formGroup('Paciente', `<select id="n-paciente" required>${opcionesPacientes(pacientes)}</select>`)}
        ${formGroup('Tipo', `<select id="n-tipo">
          <option value="recordatorio_turno">Recordatorio de turno</option>
          <option value="resultado">Resultado disponible</option>
          <option value="informacion_medico">Información del médico</option>
          <option value="general">General</option>
        </select>`)}
        ${formGroup('Título', inputTexto('n-titulo', 'Título del mensaje', true))}
        ${formGroup('Mensaje', `<textarea id="n-mensaje" rows="2" required placeholder="Texto del mensaje"></textarea>`)}
        <button type="submit" class="btn-panel">Enviar notificación</button>
      </form>
    </div>
    <div class="panel"><h2>Notificaciones enviadas</h2>${notificaciones.length ? `
    <table><thead><tr><th>Paciente</th><th>Tipo</th><th>Título</th><th>Mensaje</th><th>Estado</th></tr></thead><tbody>
    ${notificaciones.map(n => `<tr>
      <td><b>${esc(nombrePaciente(pacientes, n.paciente_id))}</b></td>
      <td>${{ recordatorio_turno: 'Recordatorio', resultado: 'Resultado', informacion_medico: 'Info. del médico', general: 'General' }[n.tipo] || esc(n.tipo)}</td>
      <td>${esc(n.titulo)}</td>
      <td>${esc(n.mensaje)}</td>
      <td>${badge({ pendiente: ['badge-amarillo', 'Pendiente'], enviada: ['badge-verde', 'Enviada'], leida: ['badge-azul', 'Leída'] }, n.estado)}</td>
    </tr>`).join('')}
    </tbody></table>` : '<div class="vacio">Sin notificaciones.</div>'}</div>`;
  },

  async sala() {
    const [turnos, pacientes] = await Promise.all([cargar('turnos'), cargar('pacientes')]);
    const hoy = new Date().toISOString().slice(0, 10);
    const enSala = turnos.filter(t => t.fecha === hoy && (t.estado === 'sala_espera' || t.estado === 'confirmado'));
    return `<div class="panel"><h2>Pacientes en sala de espera (hoy)</h2>${enSala.length ? `
    <table><thead><tr><th>Hora</th><th>Paciente</th><th>Motivo</th><th>Estado</th><th></th></tr></thead><tbody>
    ${enSala.map(t => `<tr>
      <td><b>${esc(t.hora)}</b></td>
      <td>${esc(nombrePaciente(pacientes, t.paciente_id))}</td>
      <td>${esc(t.motivo || '—')}</td>
      <td>${badge(ETIQUETAS_TURNO, t.estado)}</td>
      <td>${t.estado === 'confirmado' ? `<button class="btn-mini btn-llamar" data-id="${esc(t.id)}">Pasar a sala</button>` : ''}</td>
    </tr>`).join('')}
    </tbody></table>` : '<div class="vacio">Nadie en sala de espera.</div>'}</div>`;
  },

  async signos() {
    const [turnos, pacientes] = await Promise.all([cargar('turnos'), cargar('pacientes')]);
    const hoy = new Date().toISOString().slice(0, 10);
    const delDia = turnos.filter(t => t.fecha === hoy && t.estado !== 'cancelado');
    return `<div class="panel"><h2>Registrar signos vitales</h2>
      <form id="form-signos" class="form-fila">
        ${formGroup('Paciente de hoy', `<select id="s-paciente">${delDia.map(t =>
          `<option value="${esc(t.paciente_id)}">${esc(nombrePaciente(pacientes, t.paciente_id))} — ${esc(t.hora)}</option>`).join('')}</select>`)}
        ${formGroup('Presión arterial', inputTexto('s-presion', '120/80'))}
        ${formGroup('Temperatura (°C)', inputTexto('s-temp', '36.5', false, 'number', '', 'step="0.1"'))}
        ${formGroup('Peso (kg)', inputTexto('s-peso', '', false, 'number'))}
        ${formGroup('Altura (cm)', inputTexto('s-altura', '', false, 'number'))}
        <button type="submit" class="btn-panel">Guardar</button>
      </form>
      <p class="nota">Los signos vitales se guardan en la historia clínica del paciente.</p>
    </div>`;
  },

  async config() {
    return `<div class="panel"><h2>Configuración de la clínica</h2>
      <form id="form-config" class="form-fila">
        ${formGroup('Nombre de la clínica', inputTexto('cfg-nombre', 'Clínica', false, 'text', localStorage.getItem('cfg_nombre') || 'CliniSalud'))}
        ${formGroup('Teléfono', inputTexto('cfg-telefono', '021 000 000', false, 'text', localStorage.getItem('cfg_telefono') || ''))}
        ${formGroup('Dirección', inputTexto('cfg-direccion', 'Asunción, Paraguay', false, 'text', localStorage.getItem('cfg_direccion') || ''))}
        ${formGroup('Timbre de facturación', inputTexto('cfg-timbrado', '001-001', false, 'text', localStorage.getItem('cfg_timbrado') || '001-001'))}
        <button type="submit" class="btn-panel">Guardar configuración</button>
      </form>
      <p class="nota">En modo demo la configuración se guarda en este navegador. Con Supabase se guardará en la base de datos.</p>
    </div>`;
  },
};

let rolActual = null;

function mostrarVista(id) {
  const item = MENUS_POR_ROL[rolActual].find(m => m.id === id);
  document.getElementById('titulo-vista').textContent = item ? item.titulo : 'Panel';
  const vista = document.getElementById('vista');
  vista.innerHTML = '<div class="vacio">Cargando…</div>';
  (VISTAS[id] || VISTAS.inicio)().then(html => {
    vista.innerHTML = html;
    conectarAcciones();
  });
}

function conectarAcciones() {
  const $ = sel => document.querySelector(sel);
  const form = (id, handler) => {
    const f = document.getElementById(id);
    if (f) f.addEventListener('submit', async e => {
      e.preventDefault();
      try { await handler(); } catch (err) { alert('Error: ' + err.message); }
    });
  };
  const valor = id => document.getElementById(id)?.value.trim();

  form('form-turno', async () => {
    await Store.insert('turnos', {
      paciente_id: valor('t-paciente'), fecha: valor('t-fecha'), hora: valor('t-hora'),
      motivo: valor('t-motivo'), estado: 'pendiente', sobreturno: false,
    });
    invalidar('turnos'); mostrarVista('agenda');
  });

  form('form-paciente', async () => {
    await Store.insert('pacientes', {
      nombre_completo: valor('p-nombre'), cedula_identidad: valor('p-cedula') || null,
      fecha_nacimiento: valor('p-nac') || null, telefono: valor('p-telefono'),
      email: valor('p-email') || null, alergias: valor('p-alergias'),
    });
    invalidar('pacientes'); mostrarVista('pacientes');
  });

  form('form-consulta', async () => {
    await Store.insert('consultas', {
      paciente_id: valor('c-paciente'), motivo_consulta: valor('c-motivo'),
      diagnostico: valor('c-diagnostico'), tratamiento: valor('c-tratamiento'),
      presion_arterial: valor('c-presion'), temperatura: valor('c-temp') || null,
      peso_kg: valor('c-peso') || null, observaciones: valor('c-obs'),
    });
    invalidar('consultas'); mostrarVista('consultas');
  });

  form('form-receta', async () => {
    await Store.insert('recetas', {
      paciente_id: valor('r-paciente'), fecha: new Date().toISOString().slice(0, 10),
      contenido: valor('r-contenido'),
    });
    invalidar('recetas'); mostrarVista('recetas');
  });

  form('form-certificado', async () => {
    await Store.insert('certificados', {
      paciente_id: valor('ce-paciente'), tipo: valor('ce-tipo'),
      dias_reposo: Number(valor('ce-dias')) || null, fecha: new Date().toISOString().slice(0, 10),
      contenido: valor('ce-contenido'),
    });
    invalidar('certificados'); mostrarVista('certificados');
  });

  form('form-factura', async () => {
    const numero = '001-001-' + String(Date.now()).slice(-7);
    await Store.insert('facturas', {
      paciente_id: valor('f-paciente'), numero, concepto: valor('f-concepto'),
      monto: Number(valor('f-monto')), fecha: new Date().toISOString().slice(0, 10),
      vencimiento: valor('f-vencimiento') || null, estado: 'pendiente',
    });
    invalidar('facturas'); mostrarVista('facturas');
  });

  form('form-tarea', async () => {
    await Store.insert('tareas', {
      titulo: valor('ta-titulo'), responsable: valor('ta-responsable'),
      fecha_vencimiento: valor('ta-vencimiento') || null, estado: 'pendiente',
    });
    invalidar('tareas'); mostrarVista('tareas');
  });

  form('form-aviso', async () => {
    await Store.insert('avisos', {
      titulo: valor('a-titulo'), mensaje: valor('a-mensaje'),
      para_rol: valor('a-rol') || null, created_at: new Date().toISOString(),
    });
    invalidar('avisos'); mostrarVista('avisos');
  });

  form('form-notificacion', async () => {
    await Store.insert('notificaciones', {
      paciente_id: valor('n-paciente'), tipo: valor('n-tipo'),
      titulo: valor('n-titulo'), mensaje: valor('n-mensaje'), estado: 'pendiente',
    });
    invalidar('notificaciones'); mostrarVista('mensajes');
  });

  form('form-signos', async () => {
    await Store.insert('consultas', {
      paciente_id: valor('s-paciente'), presion_arterial: valor('s-presion'),
      temperatura: valor('s-temp') || null, peso_kg: valor('s-peso') || null,
      altura_cm: valor('s-altura') || null, motivo_consulta: 'Control de signos vitales',
    });
    invalidar('consultas');
    alert('Signos vitales guardados en la historia clínica.');
  });

  form('form-config', async () => {
    localStorage.setItem('cfg_nombre', valor('cfg-nombre'));
    localStorage.setItem('cfg_telefono', valor('cfg-telefono'));
    localStorage.setItem('cfg_direccion', valor('cfg-direccion'));
    localStorage.setItem('cfg_timbrado', valor('cfg-timbrado'));
    alert('Configuración guardada.');
  });

  document.querySelectorAll('.cambio-estado').forEach(sel =>
    sel.addEventListener('change', async () => {
      await Store.update('turnos', sel.dataset.id, { estado: sel.value });
      invalidar('turnos');
    }));

  document.querySelectorAll('.btn-ficha').forEach(b =>
    b.addEventListener('click', () => VISTAS.fichaPaciente(b.dataset.id)));

  document.querySelectorAll('.btn-cobrar').forEach(b =>
    b.addEventListener('click', async () => {
      await Store.update('facturas', b.dataset.id, {
        estado: 'pagada', pagada_en: new Date().toISOString(), metodo_pago: 'Efectivo',
      });
      invalidar('facturas'); mostrarVista('facturas');
    }));

  document.querySelectorAll('.chk-tarea').forEach(chk =>
    chk.addEventListener('change', async () => {
      await Store.update('tareas', chk.dataset.id, { estado: chk.checked ? 'completada' : 'pendiente' });
      invalidar('tareas'); mostrarVista('tareas');
    }));

  document.querySelectorAll('.btn-llamar').forEach(b =>
    b.addEventListener('click', async () => {
      await Store.update('turnos', b.dataset.id, { estado: 'sala_espera' });
      invalidar('turnos'); mostrarVista('sala');
    }));

  document.querySelectorAll('.btn-imprimir').forEach(b =>
    b.addEventListener('click', async () => {
      const lista = await Store.list(b.dataset.tipo);
      const doc = lista.find(x => x.id === b.dataset.id);
      if (!doc) return;
      const pacientes = await cargar('pacientes');
      const clinica = localStorage.getItem('cfg_nombre') || 'CliniSalud';
      const esReceta = b.dataset.tipo === 'recetas';
      const win = window.open('', '_blank', 'width=800,height=900');
      win.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>${esReceta ? 'Receta' : 'Certificado'} médica</title>
        <style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;padding:0 20px;color:#111}
        h1{border-bottom:2px solid #0e5aa7;color:#0e5aa7;padding-bottom:8px}
        .dato{margin:4px 0}.cuerpo{margin-top:24px;line-height:1.8}.firma{margin-top:80px;border-top:1px solid #333;width:280px;padding-top:8px}</style>
        </head><body>
        <h1>${esc(clinica)}</h1>
        <div class="dato"><b>Fecha:</b> ${formatearFecha(doc.fecha)}</div>
        <div class="dato"><b>Paciente:</b> ${esc(nombrePaciente(pacientes, doc.paciente_id))}</div>
        ${!esReceta ? `<div class="dato"><b>Tipo:</b> ${esc(doc.tipo)}${doc.dias_reposo ? ` — ${doc.dias_reposo} día(s) de reposo` : ''}</div>` : ''}
        <div class="cuerpo">${esc(doc.contenido).replace(/\n/g, '<br>')}</div>
        <div class="firma">Dra. Sofía Méndez — Médica Clínica<br>Reg. Prof. N.º 12345</div>
        <script>window.print()<\/script></body></html>`);
      win.document.close();
    }));
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
  return { nombre_completo: demoEmail || 'Usuario Demo', rol: ROLES.ADMINISTRADOR };
}

async function iniciar() {
  const perfil = await obtenerPerfil();
  if (!perfil) return;

  rolActual = perfil.rol;
  if (rolActual === ROLES.PACIENTE) { window.location.href = 'portal.html'; return; }
  if (!MENUS_POR_ROL[rolActual]) rolActual = ROLES.ADMINISTRADOR;

  document.getElementById('usuario-nombre').textContent = perfil.nombre_completo;
  document.getElementById('usuario-rol').textContent = ETIQUETAS_ROL[rolActual] || rolActual;
  document.getElementById('fecha-hoy').textContent = new Date()
    .toLocaleDateString('es-PY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  document.getElementById('aviso-demo').style.display = window.sb ? 'none' : 'block';

  construirMenu();
  mostrarVista('inicio');

  document.getElementById('btn-salir').addEventListener('click', async () => {
    if (window.sb) await window.sb.auth.signOut();
    sessionStorage.removeItem('demo_usuario');
    window.location.href = 'login.html';
  });
}

iniciar();
