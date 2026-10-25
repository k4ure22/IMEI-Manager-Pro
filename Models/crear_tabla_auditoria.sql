-- ====================================================================
-- TABLA DE AUDITORÍA Y REGISTRO DE ACTIVIDADES (IMEI MANAGER PRO v2.0)
-- Ejecutar en el SQL Editor de Supabase
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.auditoria (
    id BIGSERIAL PRIMARY KEY,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    usuario TEXT NOT NULL,
    nombre_usuario TEXT,
    rol TEXT DEFAULT 'user',
    accion TEXT NOT NULL,
    modulo TEXT NOT NULL,
    registro_id TEXT DEFAULT '',
    detalles TEXT,
    datos_previos JSONB,
    datos_nuevos JSONB
);

-- Índices de alto rendimiento para búsquedas y filtros rápidos
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON public.auditoria(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON public.auditoria(usuario);
CREATE INDEX IF NOT EXISTS idx_auditoria_modulo ON public.auditoria(modulo);
CREATE INDEX IF NOT EXISTS idx_auditoria_accion ON public.auditoria(accion);

-- Acceso compatible para cliente anónimo/backend
ALTER TABLE public.auditoria DISABLE ROW LEVEL SECURITY;
