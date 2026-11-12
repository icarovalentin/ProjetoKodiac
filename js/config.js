// ─── Configuración de Supabase ────────────────────────────────────────────────
// Reemplazá estos valores con los de tu proyecto: https://supabase.com/dashboard
// Project Settings → API → URL y anon public key.
//
// Mientras SUPABASE_URL esté vacío, la app funciona en "modo demo" con datos
// de ejemplo y sin conexión real.

const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
  window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Roles del sistema (coinciden con el enum rol_usuario en la base de datos)
const ROLES = {
  MEDICO: 'medico',
  RECEPCIONISTA: 'recepcionista',
  ENFERMERIA: 'enfermeria',
  ADMINISTRADOR: 'administrador',
};
