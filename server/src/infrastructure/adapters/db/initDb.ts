import { DataSource } from 'typeorm';

export async function initializeDatabaseSchema(dataSource: DataSource): Promise<void> {
  try {
    // 1. Crear tabla eventos si no existe
    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS eventos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        descripcion TEXT NULL,
        fecha_inicio DATETIME NULL,
        fecha_fin DATETIME NULL,
        categorias TEXT NOT NULL,
        tema VARCHAR(50) NOT NULL DEFAULT 'cyber',
        tipo_registro VARCHAR(20) NOT NULL DEFAULT 'VEHICULO',
        mostrar_ranking BOOLEAN NOT NULL DEFAULT TRUE,
        activo BOOLEAN NOT NULL DEFAULT FALSE,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 1.1 Verificar y agregar tipo_registro y mostrar_ranking a eventos si la tabla ya existía
    const colTipoReg = await dataSource.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'eventos' 
        AND COLUMN_NAME = 'tipo_registro';
    `);

    if (colTipoReg.length === 0) {
      await dataSource.query(`
        ALTER TABLE eventos ADD COLUMN tipo_registro VARCHAR(20) NOT NULL DEFAULT 'VEHICULO';
      `);
      console.log('Columna "tipo_registro" agregada a la tabla "eventos".');
    }

    const colMostrarRanking = await dataSource.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'eventos' 
        AND COLUMN_NAME = 'mostrar_ranking';
    `);

    if (colMostrarRanking.length === 0) {
      await dataSource.query(`
        ALTER TABLE eventos ADD COLUMN mostrar_ranking BOOLEAN NOT NULL DEFAULT TRUE;
      `);
      console.log('Columna "mostrar_ranking" agregada a la tabla "eventos".');
    }

    // 2. Verificar y agregar columnas a registro_respuestas
    const colResp = await dataSource.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'registro_respuestas' 
        AND COLUMN_NAME IN ('id_evento', 'documento', 'nombre_participante');
    `);

    const colRespNames = colResp.map((c: any) => c.COLUMN_NAME);
    if (!colRespNames.includes('id_evento')) {
      await dataSource.query(`ALTER TABLE registro_respuestas ADD COLUMN id_evento INT NOT NULL DEFAULT 1;`);
    }
    if (!colRespNames.includes('documento')) {
      await dataSource.query(`ALTER TABLE registro_respuestas ADD COLUMN documento VARCHAR(50) NULL;`);
    }
    if (!colRespNames.includes('nombre_participante')) {
      await dataSource.query(`ALTER TABLE registro_respuestas ADD COLUMN nombre_participante VARCHAR(150) NULL;`);
    }

    // 3. Verificar y agregar columnas a puntos_acumulados
    const colPuntos = await dataSource.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'puntos_acumulados' 
        AND COLUMN_NAME IN ('id_evento', 'documento', 'nombre_participante');
    `);

    const colPuntosNames = colPuntos.map((c: any) => c.COLUMN_NAME);
    if (!colPuntosNames.includes('id_evento')) {
      try {
        await dataSource.query(`
          ALTER TABLE puntos_acumulados 
          ADD COLUMN id_evento INT NOT NULL DEFAULT 1,
          DROP PRIMARY KEY,
          ADD PRIMARY KEY (numero_vehiculo, rol, id_evento);
        `);
      } catch (err) {
        console.warn('Advertencia al actualizar clave primaria de puntos_acumulados:', err);
      }
    }
    if (!colPuntosNames.includes('documento')) {
      await dataSource.query(`ALTER TABLE puntos_acumulados ADD COLUMN documento VARCHAR(50) NULL;`);
    }
    if (!colPuntosNames.includes('nombre_participante')) {
      await dataSource.query(`ALTER TABLE puntos_acumulados ADD COLUMN nombre_participante VARCHAR(150) NULL;`);
    }

    // 3.1 Eliminar FK hacia vehiculos si aún existen para admitir colaboradores por cédula
    try {
      const fkPuntos = await dataSource.query(`
        SELECT CONSTRAINT_NAME 
        FROM information_schema.TABLE_CONSTRAINTS 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'puntos_acumulados' 
          AND CONSTRAINT_TYPE = 'FOREIGN KEY' 
          AND CONSTRAINT_NAME = 'fk_puntos_vehiculo';
      `);
      if (fkPuntos.length > 0) {
        await dataSource.query(`ALTER TABLE puntos_acumulados DROP FOREIGN KEY fk_puntos_vehiculo;`);
        console.log('Clave foránea "fk_puntos_vehiculo" eliminada para admitir participantes por cédula.');
      }

      const fkResp = await dataSource.query(`
        SELECT CONSTRAINT_NAME 
        FROM information_schema.TABLE_CONSTRAINTS 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'registro_respuestas' 
          AND CONSTRAINT_TYPE = 'FOREIGN KEY' 
          AND CONSTRAINT_NAME = 'fk_registro_vehiculo';
      `);
      if (fkResp.length > 0) {
        await dataSource.query(`ALTER TABLE registro_respuestas DROP FOREIGN KEY fk_registro_vehiculo;`);
        console.log('Clave foránea "fk_registro_vehiculo" eliminada para admitir participantes por cédula.');
      }
    } catch (fkErr) {
      console.warn('Nota al verificar claves foráneas de participantes:', fkErr);
    }

    // 3.2 Crear índices de rendimiento si no existen
    try {
      const idxRanking = await dataSource.query(`
        SELECT INDEX_NAME FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'puntos_acumulados' 
          AND INDEX_NAME = 'idx_puntos_evento_ranking';
      `);
      if (idxRanking.length === 0) {
        await dataSource.query(`CREATE INDEX idx_puntos_evento_ranking ON puntos_acumulados (id_evento, total_puntos_acumulados DESC);`);
        console.log('Índice idx_puntos_evento_ranking creado con éxito.');
      }

      const idxRespEvento = await dataSource.query(`
        SELECT INDEX_NAME FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'registro_respuestas' 
          AND INDEX_NAME = 'idx_resp_evento_participante';
      `);
      if (idxRespEvento.length === 0) {
        await dataSource.query(`CREATE INDEX idx_resp_evento_participante ON registro_respuestas (id_evento, numero_vehiculo, rol);`);
        console.log('Índice idx_resp_evento_participante creado con éxito.');
      }
    } catch (idxErr) {
      console.warn('Nota al verificar índices de rendimiento:', idxErr);
    }

    // 4. Asegurar que exista al menos un evento activo por defecto
    const activeEvents = await dataSource.query(`SELECT id FROM eventos WHERE activo = 1 LIMIT 1;`);
    if (activeEvents.length === 0) {
      const anyEvent = await dataSource.query(`SELECT id FROM eventos LIMIT 1;`);
      if (anyEvent.length === 0) {
        await dataSource.query(`
          INSERT INTO eventos (id, nombre, descripcion, categorias, tema, tipo_registro, activo)
          VALUES (1, 'CiberTrivia Macarena', 'Campaña corporativa de concientización', '', 'macarena', 'VEHICULO', 1);
        `);
        console.log('Evento por defecto "CiberTrivia Macarena" creado y activado.');
      } else {
        await dataSource.query(`UPDATE eventos SET activo = 1 WHERE id = ?`, [anyEvent[0].id]);
        console.log(`Evento ID ${anyEvent[0].id} activado como evento por defecto.`);
      }
    }
  } catch (error) {
    console.error('Error durante la verificación/migración automática del esquema:', error);
  }
}
