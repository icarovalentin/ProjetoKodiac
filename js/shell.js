const ROL_NOMBRES = {
  medico: 'Médico',
  recepcionista: 'Recepcionista',
  enfermeria: 'Enfermería',
  administrador: 'Administrador',
  paciente: 'Paciente',
};

const NAV_ITEMS = [
  { id: 'agenda', nombre: 'Agenda', icono: 'calendar_month', pag: 'agenda.html', roles: ['medico', 'recepcionista', 'enfermeria', 'administrador'] },
  { id: 'pacientes', nombre: 'Pacientes', icono: 'group', pag: 'pacientes.html', roles: ['medico', 'recepcionista', 'enfermeria', 'administrador'] },
  { id: 'preconsulta', nombre: 'Pre-consulta', icono: 'monitor_heart', pag: 'preconsulta.html', roles: ['medico', 'recepcionista', 'enfermeria', 'administrador'] },
  { id: 'consultas', nombre: 'Consultas', icono: 'stethoscope', pag: 'consultas.html', roles: ['medico', 'administrador'] },
  { id: 'recetas', nombre: 'Recetas y Certificados', icono: 'prescriptions', pag: 'recetas.html', roles: ['medico', 'administrador'] },
  { id: 'facturacion', nombre: 'Facturación', icono: 'receipt_long', pag: 'facturacion.html', roles: ['recepcionista', 'administrador'] },
  { id: 'reportes', nombre: 'Reportes', icono: 'bar_chart', pag: 'reportes.html', roles: ['administrador'] },
  { id: 'administracion', nombre: 'Administración', icono: 'admin_panel_settings', pag: 'administracion.html', roles: ['administrador'] },
];

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function hoyISO(offsetDias = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDias);
  return d.toISOString().slice(0, 10);
}

function fechaLarga(fecha) {
  const d = new Date((fecha || hoyISO()) + 'T12:00:00');
  return d.toLocaleDateString('es-PY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

const ESTILOS_ESTADO = {
  pendiente: 'bg-amber-container text-amber',
  confirmado: 'bg-secondary-container text-on-secondary-container',
  sala_espera: 'bg-primary-fixed text-primary',
  listo_consulta: 'bg-tertiary-container text-on-tertiary-container',
  atendido: 'bg-surface-container-high text-on-surface-variant',
  cancelado: 'bg-error-container text-on-error-container',
  pagada: 'bg-secondary-container text-on-secondary-container',
  enviado: 'bg-secondary-container text-on-secondary-container',
  listo: 'bg-secondary-container text-on-secondary-container',
  activo: 'bg-secondary-container text-on-secondary-container',
  inactivo: 'bg-surface-container-high text-on-surface-variant',
};

function badgeEstado(estado) {
  const clase = ESTILOS_ESTADO[estado] || 'bg-surface-container-high text-on-surface-variant';
  const texto = String(estado || '—').replaceAll('_', ' ');
  return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${clase}">${esc(texto)}</span>`;
}

const Shell = {
  usuario: null,

  async _resolverUsuario() {
    if (window.sb) {
      const { data } = await window.sb.auth.getUser();
      if (!data || !data.user) { window.location.href = 'login.html'; return null; }
      let perfil = null;
      try {
        const res = await window.sb.from('profiles').select('nombre_completo, rol').eq('id', data.user.id).single();
        perfil = res.data;
      } catch (e) { perfil = null; }
      return {
        nombre: (perfil && perfil.nombre_completo) || data.user.email,
        rol: (perfil && perfil.rol) || 'administrador',
        email: data.user.email,
      };
    }
    const email = sessionStorage.getItem('demo_usuario');
    if (!email) { window.location.href = 'login.html'; return null; }
    return {
      nombre: email.split('@')[0],
      rol: sessionStorage.getItem('demo_rol') || 'administrador',
      email,
    };
  },

  async iniciar(paginaActiva) {
    this.usuario = await this._resolverUsuario();
    if (!this.usuario) return null;
    if (this.usuario.rol === 'paciente') { window.location.href = 'portal.html'; return null; }
    this._renderSidebar(paginaActiva);
    this._renderTopbar();
    return this.usuario;
  },

  _iniciales(nombre) {
    return String(nombre || '?').split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
  },

  _renderSidebar(activa) {
    const u = this.usuario;
    const items = NAV_ITEMS.filter(i => i.roles.includes(u.rol));
    const enlaces = items.map(i => {
      const activo = i.id === activa;
      return `<a href="${i.pag}" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${activo ? 'bg-surface-container-low text-primary font-bold' : 'text-on-surface-variant font-medium hover:bg-surface-container-low hover:text-on-surface'}">
        <span class="material-symbols-outlined text-[20px]">${i.icono}</span>${i.nombre}</a>`;
    }).join('');
    const selectorRol = window.sb ? '' : `
      <div class="mt-3">
        <label class="block text-[10px] font-bold uppercase tracking-wide text-on-surface-variant mb-1">Ver como (demo)</label>
        <select id="shell-cambiar-rol" class="w-full text-xs border border-outline-variant rounded-lg px-2 py-1.5 bg-white">
          ${Object.keys(ROL_NOMBRES).filter(r => r !== 'paciente').map(r => `<option value="${r}" ${r === u.rol ? 'selected' : ''}>${ROL_NOMBRES[r]}</option>`).join('')}
        </select>
      </div>`;
    document.getElementById('shell-sidebar').innerHTML = `
      <div class="flex flex-col h-full">
        <div class="flex items-center gap-3 px-5 py-5 border-b border-outline-variant">
          <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-white">local_hospital</span>
          </div>
          <div>
            <p class="font-extrabold text-on-surface leading-tight">Sanatorio Serena</p>
            <p class="text-xs text-on-surface-variant">Gestión Clínica</p>
          </div>
        </div>
        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">${enlaces}</nav>
        <div class="px-4 pb-4">
          <div class="rounded-xl bg-surface-container-low p-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary text-[20px]">wifi</span>
              <div>
                <p class="text-xs font-bold text-on-surface">IPS / Prepagas</p>
                <p class="text-[10px] text-secondary font-semibold flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span>Conectado
                </p>
              </div>
            </div>
            <span class="text-[10px] font-bold text-on-surface-variant bg-surface-container-high rounded px-1.5 py-0.5">PY</span>
          </div>
          ${selectorRol}
        </div>
      </div>`;
    const sel = document.getElementById('shell-cambiar-rol');
    if (sel) {
      sel.addEventListener('change', () => {
        sessionStorage.setItem('demo_rol', sel.value);
        window.location.reload();
      });
    }
  },

  async _renderTopbar() {
    const u = this.usuario;
    const cont = document.getElementById('shell-topbar');
    if (!cont) return;
    let notificaciones = [];
    try { notificaciones = (await Store.list('notificaciones')).filter(n => n.estado === 'pendiente'); } catch (e) { notificaciones = []; }
    cont.innerHTML = `
      <div class="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center gap-4 px-6">
        <div>
          <p class="text-sm font-bold text-on-surface leading-tight">Sucursal Central</p>
          <p class="text-[11px] text-on-surface-variant">Asunción, Paraguay</p>
        </div>
        <span class="hidden md:inline-flex items-center px-2.5 py-1 rounded-full bg-primary-fixed text-primary text-[11px] font-bold">${esc(ROL_NOMBRES[u.rol] || u.rol)}</span>
        <span class="hidden lg:inline text-xs text-on-surface-variant capitalize">${fechaLarga(hoyISO())}</span>
        <div class="flex-1"></div>
        <div class="relative hidden md:block">
          <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input id="shell-buscar-global" type="text" placeholder="Buscar paciente por C.I. o nombre…" class="w-64 bg-surface-container-low rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40">
        </div>
        <button id="shell-campana" class="relative p-2 rounded-full hover:bg-surface-container-low" title="Notificaciones">
          <span class="material-symbols-outlined text-on-surface-variant">notifications</span>
          ${notificaciones.length ? '<span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-alerta"></span>' : ''}
        </button>
        <div class="flex items-center gap-2 pl-2 border-l border-outline-variant">
          <div class="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">${esc(this._iniciales(u.nombre))}</div>
          <div class="hidden md:block leading-tight">
            <p class="text-xs font-bold text-on-surface">${esc(u.nombre)}</p>
            <p class="text-[10px] text-on-surface-variant">${esc(ROL_NOMBRES[u.rol] || u.rol)}</p>
          </div>
          <button id="shell-salir" class="p-2 rounded-full hover:bg-error-container text-on-surface-variant hover:text-error ml-1" title="Cerrar sesión">
            <span class="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>`;
    document.getElementById('shell-salir').addEventListener('click', async () => {
      if (window.sb) await window.sb.auth.signOut();
      sessionStorage.removeItem('demo_usuario');
      sessionStorage.removeItem('demo_rol');
      window.location.href = 'index.html';
    });
    document.getElementById('shell-campana').addEventListener('click', () => this.mostrarNotificaciones(notificaciones));
    const buscar = document.getElementById('shell-buscar-global');
    if (buscar) {
      buscar.addEventListener('keydown', async (ev) => {
        if (ev.key !== 'Enter') return;
        const q = buscar.value.trim();
        if (!q) return;
        const pacientes = await Store.list('pacientes');
        const encontrado = pacientes.find(p => p.cedula_identidad === q || p.nombre_completo.toLowerCase().includes(q.toLowerCase()));
        if (encontrado) window.location.href = 'pacientes.html?paciente=' + encodeURIComponent(encontrado.id);
        else alert('No se encontró ningún paciente con "' + q + '".');
      });
    }
  },

  async mostrarNotificaciones(notificaciones) {
    if (!notificaciones) notificaciones = (await Store.list('notificaciones')).filter(n => n.estado === 'pendiente');
    const items = notificaciones.length
      ? notificaciones.map(n => `<li class="py-2 border-b border-outline-variant last:border-0">
          <p class="text-sm font-bold text-on-surface">${esc(n.titulo)}</p>
          <p class="text-xs text-on-surface-variant">${esc(n.mensaje)}</p>
        </li>`).join('')
      : '<li class="py-3 text-sm text-on-surface-variant">No hay notificaciones pendientes.</li>';
    this.modal({
      titulo: 'Notificaciones',
      contenido: `<ul class="divide-none">${items}</ul>`,
      acciones: `<button data-cerrar-modal class="px-4 py-2 rounded-lg text-sm font-semibold border border-outline-variant hover:bg-surface-container-low">Cerrar</button>`,
    });
  },

  modal({ titulo, contenido, acciones, ancho = 'max-w-lg' }) {
    this.cerrarModal();
    const overlay = document.createElement('div');
    overlay.id = 'shell-modal-overlay';
    overlay.className = 'fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4';
    overlay.innerHTML = `
      <div class="bg-surface-container-lowest rounded-3xl ${ancho} w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="flex items-center justify-between px-6 pt-5">
          <h3 class="text-lg font-extrabold text-on-surface">${titulo}</h3>
          <button data-cerrar-modal class="p-1.5 rounded-full hover:bg-surface-container-low">
            <span class="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <div class="px-6 py-4">${contenido}</div>
        ${acciones ? `<div class="flex justify-end gap-2 px-6 pb-5">${acciones}</div>` : ''}
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelectorAll('[data-cerrar-modal]').forEach(b => b.addEventListener('click', () => this.cerrarModal()));
    overlay.addEventListener('click', ev => { if (ev.target === overlay) this.cerrarModal(); });
  },

  cerrarModal() {
    const existente = document.getElementById('shell-modal-overlay');
    if (existente) existente.remove();
  },

  aviso(mensaje, tipo = 'exito') {
    const previo = document.getElementById('shell-toast');
    if (previo) previo.remove();
    const toast = document.createElement('div');
    toast.id = 'shell-toast';
    toast.className = `fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold ${tipo === 'error' ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`;
    toast.innerHTML = `<span class="material-symbols-outlined text-[20px]">${tipo === 'error' ? 'error' : 'check_circle'}</span>${esc(mensaje)}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  },

  async registrarAuditoria(accion, detalle) {
    if (!this.usuario) return;
    try {
      await Store.insert('auditoria', {
        usuario: this.usuario.nombre,
        accion,
        detalle: detalle || '',
        fecha: new Date().toISOString(),
      });
    } catch (e) { console.error('Auditoría:', e); }
  },

  cargando(mensaje = 'Cargando…') {
    return `<div class="flex flex-col items-center justify-center py-20 text-on-surface-variant">
      <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      <p class="mt-3 text-sm">${esc(mensaje)}</p>
    </div>`;
  },

  vacio(mensaje, icono = 'inbox') {
    return `<div class="flex flex-col items-center justify-center py-14 text-on-surface-variant">
      <span class="material-symbols-outlined text-4xl">${icono}</span>
      <p class="mt-2 text-sm">${esc(mensaje)}</p>
    </div>`;
  },
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Shell.iniciar(window.PAGINA_ACTIVA || '');
    if (Shell.usuario && typeof window.PaginaIniciar === 'function') {
      await window.PaginaIniciar();
    }
  } catch (error) {
    console.error(error);
    const main = document.getElementById('shell-main');
    if (main) {
      main.innerHTML = `<div class="rounded-2xl bg-error-container text-on-error-container p-6">
        <p class="font-bold mb-1">Ocurrió un error al cargar la página.</p>
        <p class="text-sm">${esc(error.message || error)}</p>
      </div>`;
    }
  }
});
