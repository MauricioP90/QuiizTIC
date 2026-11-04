-- ====================================================================
-- Migración de Base de Datos: Sistema Multi-Evento, Tipos de Registro y Cédula
-- ====================================================================

-- 1. Crear tabla de eventos con tipo de registro
CREATE TABLE IF NOT EXISTS eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT NULL,
  fecha_inicio DATETIME NULL,
  fecha_fin DATETIME NULL,
  categorias TEXT NOT NULL COMMENT 'Categorías permitidas separadas por comas (o vacío para todas)',
  tema VARCHAR(50) NOT NULL DEFAULT 'cyber' COMMENT 'cyber | navidad | halloween | macarena',
  tipo_registro VARCHAR(20) NOT NULL DEFAULT 'VEHICULO' COMMENT 'VEHICULO | CEDULA',
  activo BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar columna tipo_registro si eventos ya existía
SET @col_exist_tipo_reg := (
  SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'eventos' 
    AND COLUMN_NAME = 'tipo_registro'
);
SET @sql_tipo_reg := IF(@col_exist_tipo_reg = 0, 
  'ALTER TABLE eventos ADD COLUMN tipo_registro VARCHAR(20) NOT NULL DEFAULT "VEHICULO";', 
  'SELECT "Columna tipo_registro ya existe en eventos";'
);
PREPARE stmt_tipo_reg FROM @sql_tipo_reg;
EXECUTE stmt_tipo_reg;
DEALLOCATE PREPARE stmt_tipo_reg;

-- 2. Insertar evento inicial por defecto
INSERT INTO eventos (id, nombre, descripcion, categorias, tema, tipo_registro, activo)
VALUES (1, 'CiberTrivia Macarena', 'Campaña general de concientización y ciberseguridad', '', 'macarena', 'VEHICULO', TRUE)
ON DUPLICATE KEY UPDATE activo = activo;

-- 3. Modificar tabla registro_respuestas para asociar id_evento, documento y nombre_participante
ALTER TABLE registro_respuestas ADD COLUMN IF NOT EXISTS id_evento INT NOT NULL DEFAULT 1;
ALTER TABLE registro_respuestas ADD COLUMN IF NOT EXISTS documento VARCHAR(50) NULL;
ALTER TABLE registro_respuestas ADD COLUMN IF NOT EXISTS nombre_participante VARCHAR(150) NULL;

-- 4. Modificar tabla puntos_acumulados para incluir id_evento, documento y nombre_participante
ALTER TABLE puntos_acumulados ADD COLUMN IF NOT EXISTS id_evento INT NOT NULL DEFAULT 1;
ALTER TABLE puntos_acumulados ADD COLUMN IF NOT EXISTS documento VARCHAR(50) NULL;
ALTER TABLE puntos_acumulados ADD COLUMN IF NOT EXISTS nombre_participante VARCHAR(150) NULL;

-- 5. Eliminar restricciones FK hacia vehiculos para admitir registros tanto de vehículos como de colaboradores (cédula)
SET @fk_puntos := (
  SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS 
  WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'puntos_acumulados' 
    AND CONSTRAINT_TYPE = 'FOREIGN KEY' 
    AND CONSTRAINT_NAME = 'fk_puntos_vehiculo'
);
SET @sql_drop_fk_puntos := IF(@fk_puntos IS NOT NULL, 
  'ALTER TABLE puntos_acumulados DROP FOREIGN KEY fk_puntos_vehiculo;', 
  'SELECT "FK fk_puntos_vehiculo ya no existe en puntos_acumulados";'
);
PREPARE stmt_drop_puntos FROM @sql_drop_fk_puntos;
EXECUTE stmt_drop_puntos;
DEALLOCATE PREPARE stmt_drop_puntos;

SET @fk_respuestas := (
  SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS 
  WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'registro_respuestas' 
    AND CONSTRAINT_TYPE = 'FOREIGN KEY' 
    AND CONSTRAINT_NAME = 'fk_registro_vehiculo'
);
SET @sql_drop_fk_resp := IF(@fk_respuestas IS NOT NULL, 
  'ALTER TABLE registro_respuestas DROP FOREIGN KEY fk_registro_vehiculo;', 
  'SELECT "FK fk_registro_vehiculo ya no existe en registro_respuestas";'
);
PREPARE stmt_drop_resp FROM @sql_drop_fk_resp;
EXECUTE stmt_drop_resp;
DEALLOCATE PREPARE stmt_drop_resp;
