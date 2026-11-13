const Store = {
  CLAVE: 'clinisalud_datos_v1',

  get modo() {
    return window.sb ? 'supabase' : 'demo';
  },

  async list(tabla) {
    if (window.sb) {
      const { data, error } = await window.sb.from(tabla).select('*');
      if (error) { console.error('Supabase:', error.message); return []; }
      return data || [];
    }
    return this._estado()[tabla] || [];
  },

  async insert(tabla, registro) {
    if (window.sb) {
      const { data, error } = await window.sb.from(tabla).insert(registro).select().single();
      if (error) throw error;
      return data;
    }
    const estado = this._estado();
    const nuevo = { id: this._id(), created_at: new Date().toISOString(), ...registro };
    estado[tabla] = [nuevo, ...(estado[tabla] || [])];
    this._guardar(estado);
    return nuevo;
  },

  async update(tabla, id, cambios) {
    if (window.sb) {
      const { data, error } = await window.sb.from(tabla).update(cambios).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }
    const estado = this._estado();
    estado[tabla] = (estado[tabla] || []).map(r => r.id === id ? { ...r, ...cambios } : r);
    this._guardar(estado);
    return estado[tabla].find(r => r.id === id);
  },

  async remove(tabla, id) {
    if (window.sb) {
      const { error } = await window.sb.from(tabla).delete().eq('id', id);
      if (error) throw error;
      return;
    }
    const estado = this._estado();
    estado[tabla] = (estado[tabla] || []).filter(r => r.id !== id);
    this._guardar(estado);
  },

  _id() {
    return (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2));
  },

  _estado() {
    let estado = null;
    try { estado = JSON.parse(localStorage.getItem(this.CLAVE) || 'null'); } catch (e) { estado = null; }
    if (!estado || !estado.datos) estado = { datos: this._semilla() };
    return estado.datos;
  },

  _guardar(datos) {
    localStorage.setItem(this.CLAVE, JSON.stringify({ datos }));
  },

  _hoy(offsetDias = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDias);
    return d.toISOString().slice(0, 10);
  },

  _semilla() {
    return {
      pacientes: [
        { id: 'p1', nombre_completo: 'María González', cedula_identidad: '4.123.456', fecha_nacimiento: '1985-03-12', telefono: '0981 123 456', email: 'maria.gonzalez@gmail.com', direccion: 'Asunción', sangre_tipo: 'O+', alergias: 'Penicilina', created_at: '2025-10-01T10:00:00Z' },
        { id: 'p2', nombre_completo: 'Juan Pérez', cedula_identidad: '3.987.654', fecha_nacimiento: '1978-11-25', telefono: '0972 555 333', email: 'juan.perez@gmail.com', direccion: 'San Lorenzo', sangre_tipo: 'A+', alergias: '', created_at: '2025-10-03T10:00:00Z' },
        { id: 'p3', nombre_completo: 'Ana Rojas', cedula_identidad: '5.234.567', fecha_nacimiento: '1992-07-08', telefono: '0983 444 222', email: 'ana.rojas@gmail.com', direccion: 'Luque', sangre_tipo: 'B+', alergias: 'Polen', created_at: '2025-10-05T10:00:00Z' },
        { id: 'p4', nombre_completo: 'Carlos López', cedula_identidad: '2.876.543', fecha_nacimiento: '1969-01-30', telefono: '0991 777 888', email: 'carlos.lopez@gmail.com', direccion: 'Capiatá', sangre_tipo: 'O-', alergias: '', created_at: '2025-10-08T10:00:00Z' },
      ],
      medicos: [
        { id: 'm1', nombre: 'Dra. Valeria González', especialidad: 'Medicina Interna', consultorio: 'Consultorio 4', precio_consulta: 150000, estado: 'activo', created_at: '2025-10-01T08:00:00Z' },
        { id: 'm2', nombre: 'Dr. Rodrigo Benítez', especialidad: 'Cardiología', consultorio: 'Consultorio 2', precio_consulta: 200000, estado: 'activo', created_at: '2025-10-01T08:00:00Z' },
        { id: 'm3', nombre: 'Dra. Camila Ortiz', especialidad: 'Pediatría', consultorio: 'Consultorio 6', precio_consulta: 180000, estado: 'activo', created_at: '2025-10-01T08:00:00Z' },
        { id: 'm4', nombre: 'Dr. Marcelo Duarte', especialidad: 'Nutrición', consultorio: 'Consultorio 1', precio_consulta: 120000, estado: 'activo', created_at: '2025-10-01T08:00:00Z' },
      ],
      horarios: [
        { id: 'h1', medico_id: 'm1', dia_semana: 1, desde: '08:00', hasta: '12:00', consultorio: 'Consultorio 4' },
        { id: 'h2', medico_id: 'm1', dia_semana: 2, desde: '08:00', hasta: '12:00', consultorio: 'Consultorio 4' },
        { id: 'h3', medico_id: 'm1', dia_semana: 3, desde: '08:00', hasta: '12:00', consultorio: 'Consultorio 4' },
        { id: 'h4', medico_id: 'm1', dia_semana: 4, desde: '08:00', hasta: '12:00', consultorio: 'Consultorio 4' },
        { id: 'h5', medico_id: 'm1', dia_semana: 5, desde: '08:00', hasta: '12:00', consultorio: 'Consultorio 4' },
        { id: 'h6', medico_id: 'm2', dia_semana: 1, desde: '08:00', hasta: '12:00', consultorio: 'Consultorio 2' },
        { id: 'h7', medico_id: 'm2', dia_semana: 3, desde: '15:00', hasta: '18:00', consultorio: 'Consultorio 2' },
        { id: 'h8', medico_id: 'm2', dia_semana: 5, desde: '08:00', hasta: '12:00', consultorio: 'Consultorio 2' },
        { id: 'h9', medico_id: 'm3', dia_semana: 1, desde: '08:00', hasta: '12:00', consultorio: 'Consultorio 6' },
        { id: 'h10', medico_id: 'm3', dia_semana: 2, desde: '15:00', hasta: '18:00', consultorio: 'Consultorio 6' },
        { id: 'h11', medico_id: 'm3', dia_semana: 4, desde: '08:00', hasta: '12:00', consultorio: 'Consultorio 6' },
        { id: 'h12', medico_id: 'm4', dia_semana: 2, desde: '08:00', hasta: '12:00', consultorio: 'Consultorio 1' },
        { id: 'h13', medico_id: 'm4', dia_semana: 4, desde: '15:00', hasta: '18:00', consultorio: 'Consultorio 1' },
        { id: 'h14', medico_id: 'm4', dia_semana: 5, desde: '08:00', hasta: '12:00', consultorio: 'Consultorio 1' },
      ],
      feriados: [
        { id: 'fe1', fecha: '2025-01-01', descripcion: 'Año Nuevo', ley: '' },
        { id: 'fe2', fecha: '2025-03-03', descripcion: 'Día de los Héroes', ley: 'Ley 7544' },
        { id: 'fe3', fecha: '2025-04-17', descripcion: 'Jueves Santo', ley: '' },
        { id: 'fe4', fecha: '2025-04-18', descripcion: 'Viernes Santo', ley: '' },
        { id: 'fe5', fecha: '2025-05-01', descripcion: 'Día del Trabajador', ley: '' },
        { id: 'fe6', fecha: '2025-05-14', descripcion: 'Independencia de Paraguay', ley: '' },
        { id: 'fe7', fecha: '2025-05-15', descripcion: 'Independencia de Paraguay', ley: '' },
        { id: 'fe8', fecha: '2025-06-12', descripcion: 'Chaco Armístico', ley: 'Ley 7544' },
        { id: 'fe9', fecha: '2025-08-15', descripcion: 'Fundación de Asunción', ley: '' },
        { id: 'fe10', fecha: '2025-09-29', descripcion: 'Batalla de Boquerón', ley: 'Ley 7544' },
        { id: 'fe11', fecha: '2025-12-08', descripcion: 'Virgen de Caacupé', ley: '' },
        { id: 'fe12', fecha: '2025-12-25', descripcion: 'Navidad', ley: '' },
      ],
      turnos: [
        { id: 't1', paciente_id: 'p1', medico_id: 'm1', fecha: this._hoy(0), hora: '08:00', motivo: 'Control general', estado: 'confirmado', sobreturno: false, especialidad: 'Medicina Interna', consultorio: 'Consultorio 4', modalidad: 'Presencial', cobertura: 'Santa Clara', precio: 0, created_at: '2025-11-10T10:00:00Z' },
        { id: 't2', paciente_id: 'p2', medico_id: 'm1', fecha: this._hoy(0), hora: '08:30', motivo: 'Dolor lumbar', estado: 'sala_espera', sobreturno: false, especialidad: 'Medicina Interna', consultorio: 'Consultorio 4', modalidad: 'Presencial', cobertura: 'Particular', precio: 150000, created_at: '2025-11-10T10:05:00Z' },
        { id: 't3', paciente_id: 'p3', medico_id: 'm3', fecha: this._hoy(0), hora: '09:00', motivo: 'Primera consulta', estado: 'pendiente', sobreturno: false, especialidad: 'Pediatría', consultorio: 'Consultorio 6', modalidad: 'Presencial', cobertura: 'Asismed', precio: 0, created_at: '2025-11-10T10:10:00Z' },
        { id: 't4', paciente_id: 'p4', medico_id: 'm4', fecha: this._hoy(0), hora: '09:30', motivo: 'Certificado médico', estado: 'confirmado', sobreturno: true, especialidad: 'Nutrición', consultorio: 'Consultorio 1', modalidad: 'Telemedicina', cobertura: 'Particular', precio: 120000, created_at: '2025-11-10T10:15:00Z' },
        { id: 't5', paciente_id: 'p1', medico_id: 'm2', fecha: this._hoy(1), hora: '10:00', motivo: 'Control de presión', estado: 'pendiente', sobreturno: false, especialidad: 'Cardiología', consultorio: 'Consultorio 2', modalidad: 'Presencial', cobertura: 'SPS', precio: 0, created_at: '2025-11-10T10:20:00Z' },
      ],
      estudios: [
        { id: 'e1', paciente_id: 'p2', tipo: 'laboratorio', nombre: 'Hemograma completo', estado: 'listo', fecha_solicitud: this._hoy(-7), fecha_resultado: this._hoy(-5), resultado: 'Valores dentro de parámetros normales.', created_at: '2025-11-03T09:00:00Z' },
        { id: 'e2', paciente_id: 'p2', tipo: 'cardiologia', nombre: 'Electrocardiograma (ECG)', estado: 'pendiente', fecha_solicitud: this._hoy(-1), fecha_resultado: null, resultado: '', created_at: '2025-11-09T09:00:00Z' },
        { id: 'e3', paciente_id: 'p1', tipo: 'laboratorio', nombre: 'Perfil lipídico', estado: 'pendiente', fecha_solicitud: this._hoy(0), fecha_resultado: null, resultado: '', created_at: '2025-11-10T09:00:00Z' },
        { id: 'e4', paciente_id: 'p4', tipo: 'laboratorio', nombre: 'Glucemia en ayunas', estado: 'listo', fecha_solicitud: this._hoy(-10), fecha_resultado: this._hoy(-8), resultado: '95 mg/dL — dentro del rango normal.', created_at: '2025-10-31T09:00:00Z' },
      ],
      auditoria: [
        { id: 'au1', usuario: 'Admin. General', accion: 'inicio_sesion', detalle: 'Acceso al sistema', fecha: this._hoy(0) + 'T07:45:00Z', created_at: this._hoy(0) + 'T07:45:00Z' },
        { id: 'au2', usuario: 'Lic. Ramiro Ayala', accion: 'crear_turno', detalle: 'Turno creado para Juan Pérez', fecha: this._hoy(0) + 'T08:10:00Z', created_at: this._hoy(0) + 'T08:10:00Z' },
        { id: 'au3', usuario: 'Admin. General', accion: 'registrar_pago', detalle: 'Factura 001-001-0000124 cobrada', fecha: this._hoy(-10) + 'T15:30:00Z', created_at: this._hoy(-10) + 'T15:30:00Z' },
      ],
      consultas: [
        { id: 'c1', paciente_id: 'p2', fecha: '2025-10-28T09:00:00Z', motivo_consulta: 'Dolor lumbar', diagnostico: 'Lumbalgia mecánica', tratamiento: 'Reposo relativo y analgésicos', observaciones: 'Control en 2 semanas', created_at: '2025-10-28T09:00:00Z' },
      ],
      recetas: [
        { id: 'r1', paciente_id: 'p2', fecha: '2025-10-28', contenido: 'Ibuprofeno 400 mg — 1 comprimido cada 8 horas durante 5 días.', created_at: '2025-10-28T09:10:00Z' },
      ],
      certificados: [
        { id: 'ce1', paciente_id: 'p2', tipo: 'reposo', fecha: '2025-10-28', dias_reposo: 3, contenido: 'Se otorga reposo médico por 3 días.', created_at: '2025-10-28T09:15:00Z' },
      ],
      facturas: [
        { id: 'f1', paciente_id: 'p1', numero: '001-001-0000123', concepto: 'Consulta general', monto: 150000, fecha: this._hoy(-20), vencimiento: this._hoy(-5), estado: 'pagada', metodo_pago: 'Efectivo', created_at: '2025-10-20T10:00:00Z' },
        { id: 'f2', paciente_id: 'p2', numero: '001-001-0000124', concepto: 'Consulta + certificado', monto: 200000, fecha: this._hoy(-10), vencimiento: this._hoy(5), estado: 'pagada', metodo_pago: 'Transferencia', created_at: '2025-10-28T10:00:00Z' },
        { id: 'f3', paciente_id: 'p3', numero: '001-001-0000125', concepto: 'Primera consulta', monto: 180000, fecha: this._hoy(-3), vencimiento: this._hoy(12), estado: 'pendiente', created_at: '2025-11-09T10:00:00Z' },
        { id: 'f4', paciente_id: 'p4', numero: '001-001-0000126', concepto: 'Consulta general', monto: 150000, fecha: this._hoy(-25), vencimiento: this._hoy(-10), estado: 'pendiente', created_at: '2025-10-18T10:00:00Z' },
      ],
      tareas: [
        { id: 'ta1', titulo: 'Confirmar turnos del día', descripcion: 'Llamar a los pacientes pendientes', responsable: 'Recepción', fecha_vencimiento: this._hoy(0), estado: 'en_progreso', created_at: '2025-11-10T07:00:00Z' },
        { id: 'ta2', titulo: 'Pedir insumos médicos', descripcion: 'Guantes, jeringas y alcohol', responsable: 'Enfermería', fecha_vencimiento: this._hoy(2), estado: 'pendiente', created_at: '2025-11-09T07:00:00Z' },
        { id: 'ta3', titulo: 'Actualizar horarios de la Dra. Méndez', descripcion: '', responsable: 'Administración', fecha_vencimiento: this._hoy(5), estado: 'pendiente', created_at: '2025-11-08T07:00:00Z' },
      ],
      avisos: [
        { id: 'a1', titulo: 'Reunión de equipo', mensaje: 'Reunión el viernes a las 17:00 en la sala de estar.', para_rol: null, created_at: '2025-11-09T08:00:00Z' },
        { id: 'a2', titulo: 'Nuevo protocolo de limpieza', mensaje: 'Recordar desinfección de camillas entre pacientes.', para_rol: 'enfermeria', created_at: '2025-11-08T08:00:00Z' },
      ],
      notificaciones: [
        { id: 'n1', paciente_id: 'p1', tipo: 'recordatorio_turno', titulo: 'Recordatorio de turno', mensaje: 'No olvide su turno hoy a las 08:00.', estado: 'enviada', enviada_en: '2025-11-11T07:30:00Z', created_at: '2025-11-11T07:30:00Z' },
        { id: 'n2', paciente_id: 'p4', tipo: 'resultado', titulo: 'Resultado disponible', mensaje: 'Sus análisis ya están disponibles.', estado: 'enviada', enviada_en: '2025-11-10T16:00:00Z', created_at: '2025-11-10T16:00:00Z' },
        { id: 'n3', paciente_id: 'p3', tipo: 'informacion_medico', titulo: 'Información del médico', mensaje: 'Llegue 10 minutos antes para completar su ficha.', estado: 'pendiente', created_at: '2025-11-10T11:20:00Z' },
      ],
      usuarios: [
        { id: 'u1', nombre: 'Dra. Valeria González', rol: 'Médico', email: 'vgonzalez@sanatorioserena.com.py', estado: 'Activo' },
        { id: 'u2', nombre: 'Dr. Rodrigo Benítez', rol: 'Médico', email: 'rbenitez@sanatorioserena.com.py', estado: 'Activo' },
        { id: 'u3', nombre: 'Lic. Ramiro Ayala', rol: 'Recepcionista', email: 'rayala@sanatorioserena.com.py', estado: 'Activo' },
        { id: 'u4', nombre: 'Enf. Carla Benítez', rol: 'Enfermería', email: 'cbenitez@sanatorioserena.com.py', estado: 'Activo' },
        { id: 'u5', nombre: 'Admin. General', rol: 'Administrador', email: 'admin@sanatorioserena.com.py', estado: 'Activo' },
      ],
    };
  },
};

function formatearMonto(monto) {
  return new Intl.NumberFormat('es-PY').format(Number(monto) || 0) + ' ₲';
}

function formatearFecha(fecha) {
  if (!fecha) return '—';
  const d = new Date(fecha.length <= 10 ? fecha + 'T12:00:00' : fecha);
  return d.toLocaleDateString('es-PY', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
