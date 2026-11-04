# Especificaciones Técnicas, Flujos de Datos y Arquitectura

Este archivo documenta detalladamente la arquitectura del sistema, diagramas de flujo, estructura de directorios, modelo de datos relacional y contratos de bajo nivel para **QuizzTIC**, utilizando Node.js, Express, TypeScript, TypeORM, MySQL y React/Vite.

---

## 🗺️ Mapa de Flujo del Sistema (Workflow de Usuario y Administrador)

```plaintext
                              [ Código QR / Enlace Web HTTPS ]
                                              │
                                              ▼ Carga inicial
                                   [ GET /api/events/active ]
                                   (Obtiene Tema, Modo Registro,
                                    Filtro de Categorías y Ranking)
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
             [ Ruta: /admin ]                                  [ Ruta: / (Trivia) ]
                     │                                                 │
          ┌──────────┴──────────┐                             ┌────────┴────────┐
          │ ¿PIN Admin Válido?  │                             │ ¿Existe Sesión? │
          └──────────┬──────────┘                             └────────┬────────┘
                     │                                                 │
            ┌────────┴────────┐                               ┌────────┴────────┐
            ▼ NO              ▼ SÍ                            ▼ NO              ▼ SÍ
     [ Error / PIN ]   [ Panel Admin ]                 [ Bienvenida ]     [ Cargar Trivia ]
                       • Crear/Editar Eventos                 │                 │
                       • Modalidad (Vehículo/Cédula)          ▼ Comenzar        │
                       • Categorías y Temas            [ Form Registro ]        │
                       • Mostrar/Ocultar Ranking              │                 │
                       • Monitoreo Top 10 en Vivo             ▼ Validar         │
                                                       (Vehículo o Cédula       │
                                                        en permisos.personas)   │
                                                              │                 │
                                                              ▼ SÍ              │
                                                       [ Iniciar Sesión ] ◄─────┘
                                                              │
                                                              ▼
                                                [ Carga de Escenarios Aleatorios ]
                                                (GET /api/scenarios?evento=ID)
                                                              │
                                                              ▼
                                                [ Escenario y Temporizador (180s) ]
                                                (Evalúa: ¿Buena o Mala Práctica?)
                                                              │
                                                              ▼
                                                [ POST /api/answers ]
                                                • Guarda respuesta en registro_respuestas
                                                • Incrementa puntos en puntos_acumulados
                                                              │
                                                              ▼
                                                [ Pausa Pedagógica (Feedback Visual) ]
                                                • Riesgo / Beneficio
                                                • Recomendación Práctica
                                                              │
                                                              ▼
                                                   ¿Quedan más escenarios?
                                                    ┌─────────┴─────────┐
                                                    ▼ SÍ                ▼ NO
                                             Siguiente Escenario  [ Pantalla de Resumen ]
                                                                  (Resumen ronda + histórico)
                                                                        │
                                                   ┌────────────────────┴────────────────────┐
                                                   ▼ Si mostrar_ranking = TRUE               ▼ Si mostrar_ranking = FALSE
                                            [ Botón "Ver Ranking" ]                   [ Botón oculto para participantes ]
                                                   │                                         │
                                                   ▼                                         ▼
                                            [ GET /api/leaderboard ]                  [ Pantalla de Suspenso ]
                                            (Top 10 Oficial en Vivo)                  (🔒 Podio en modo secreto)
```

---

## 🗂️ Arquitectura Detallada de Carpetas (Clean Architecture)

El proyecto implementa el principio de Puertos y Adaptadores (Arquitectura Hexagonal) tanto en el servidor como en el cliente:

```plaintext
QuizzTIC/
├── server/                                  # BACKEND NODE.JS + EXPRESS + TYPEORM
│   └── src/
│       ├── domain/                          # CAPA DE DOMINIO (Entidades y Puertos)
│       │   ├── entities/
│       │   │   ├── Evento.ts                # Entidad de Evento (Nombre, Tema, Registro, Visibilidad)
│       │   │   ├── Pregunta.ts              # Escenario táctico de aprendizaje
│       │   │   ├── Vehiculo.ts              # Registro de vehículo o participante
│       │   │   ├── RegistroRespuesta.ts     # Bitácora de respuestas
│       │   │   └── PuntosAcumulados.ts      # Tabla agregada de puntajes
│       │   └── ports/                       # Interfaces abstractas de repositorios
│       │       ├── IEventoRepository.ts
│       │       ├── IPreguntaRepository.ts
│       │       ├── IVehiculoRepository.ts
│       │       ├── IRegistroRespuestaRepository.ts
│       │       ├── IPuntosAcumuladosRepository.ts
│       │       └── IPersonaRepository.ts
│       │
│       ├── application/                     # CAPA DE APLICACIÓN (Casos de Uso)
│       │   └── use-cases/
│       │       ├── GestionarEventos.ts      # CRUD y activación de eventos
│       │       ├── ObtenerEscenarios.ts     # Filtro y selección aleatoria por categoría
│       │       ├── RegistrarVehiculo.ts     # Alta o validación de participante
│       │       ├── ValidarPersona.ts        # Consulta contra permisos.personas
│       │       ├── ProcesarRespuesta.ts     # Calificación y actualización de saldo de puntos
│       │       ├── ObtenerResultados.ts     # Acumulados históricos del participante
│       │       └── ObtenerLeaderboard.ts    # Consulta del Top 10 con control de visibilidad
│       │
│       └── infrastructure/                  # CAPA DE INFRAESTRUCTURA (Adaptadores)
│           └── adapters/
│               ├── db/                      # Adaptadores Secundarios (Persistencia TypeORM)
│               │   ├── DataSource.ts        # Pool de conexión MySQL
│               │   ├── initDb.ts            # Migración y verificación automática de esquema
│               │   └── entities/            # Schemas TypeORM mapeados a tablas MySQL
│               │       ├── EventoSchema.ts
│               │       ├── PreguntaSchema.ts
│               │       ├── VehiculoSchema.ts
│               │       ├── RegistroRespuestaSchema.ts
│               │       └── PuntosAcumuladosSchema.ts
│               ├── repositories/            # Implementaciones concretas de TypeORM
│               │   ├── TypeORMEventoRepository.ts
│               │   ├── TypeORMPreguntaRepository.ts
│               │   ├── TypeORMVehiculoRepository.ts
│               │   ├── TypeORMRegistroRespuestaRepository.ts
│               │   ├── TypeORMPuntosAcumuladosRepository.ts
│               │   └── TypeORMPersonaRepository.ts
│               └── http/                    # Adaptadores Primarios (Controladores HTTP)
│                   ├── routes.ts            # Enrutador Express centralizado
│                   └── controllers/
│                       ├── EventController.ts
│                       ├── ScenarioController.ts
│                       ├── ParticipantController.ts
│                       ├── ResultsController.ts
│                       └── LeaderboardController.ts
│
└── src/                                     # FRONTEND REACT 19 + VITE + TAILWIND
    ├── domain/                              # Modelos de datos del cliente
    │   └── entities/
    │       ├── Scenario.ts
    │       ├── Participant.ts
    │       └── GameSession.ts
    ├── presentation/                        # Vistas y Controladores React
    │   ├── controllers/
    │   │   └── useGameController.ts         # Hook principal de estado de la partida
    │   ├── views/
    │   │   ├── WelcomeView.tsx              # Portada con selector de inicio y ranking
    │   │   ├── RegistrationView.tsx         # Formulario dual (Vehículo / Cédula)
    │   │   ├── GameplayView.tsx             # Pantalla de juego y temporizador
    │   │   ├── SummaryView.tsx              # Resultados y desglose educativo
    │   │   ├── LeaderboardView.tsx          # Tabla de posiciones y pantalla de suspenso
    │   │   └── AdminView.tsx                # Panel de control de eventos y temas
    │   └── components/                      # Componentes atómicos de interfaz
    └── shared/                              # Contextos transversales y temas
        ├── context/
        │   └── EventContext.tsx             # Estado global del evento y tema activo
        └── theme/
            └── themeConfig.ts               # Paletas visuales y configuración de fondos
```

---

## 🗄️ Esquema Relacional de Base de Datos (MySQL)

```sql
-- 1. Tabla de Eventos / Campañas
CREATE TABLE IF NOT EXISTS eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT NULL,
  fecha_inicio DATETIME NULL,
  fecha_fin DATETIME NULL,
  categorias TEXT NOT NULL,                     -- Lista de categorías separadas por coma
  tema VARCHAR(50) NOT NULL DEFAULT 'cyber',    -- 'macarena' | 'cyber' | 'halloween' | 'navidad'
  tipo_registro VARCHAR(20) NOT NULL DEFAULT 'VEHICULO', -- 'VEHICULO' | 'CEDULA'
  mostrar_ranking BOOLEAN NOT NULL DEFAULT TRUE,-- Control de visibilidad del ranking
  activo BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Preguntas / Escenarios
CREATE TABLE IF NOT EXISTS preguntas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoria VARCHAR(100) NOT NULL,
  contexto TEXT NOT NULL,
  tipo_practica ENUM('BUENA', 'MALA') NOT NULL,
  riesgo_beneficio TEXT NOT NULL,
  recomendacion TEXT NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bitácora de Respuestas
CREATE TABLE IF NOT EXISTS registro_respuestas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_evento INT NOT NULL DEFAULT 1,
  numero_vehiculo VARCHAR(20) NOT NULL,
  documento VARCHAR(50) NULL,
  nombre_participante VARCHAR(150) NULL,
  rol ENUM('PROPIETARIO', 'OPERADOR') NOT NULL,
  id_pregunta INT NOT NULL,
  respuesta_seleccionada ENUM('BUENA', 'MALA') NOT NULL,
  es_correcta BOOLEAN NOT NULL,
  puntos_ganados INT NOT NULL DEFAULT 0,
  fecha_respuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_resp_evento_participante (id_evento, numero_vehiculo, rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Puntos Acumulados (Consolidado de Ranking)
CREATE TABLE IF NOT EXISTS puntos_acumulados (
  numero_vehiculo VARCHAR(20) NOT NULL,
  rol ENUM('PROPIETARIO', 'OPERADOR') NOT NULL,
  id_evento INT NOT NULL DEFAULT 1,
  documento VARCHAR(50) NULL,
  nombre_participante VARCHAR(150) NULL,
  preguntas_acertadas INT NOT NULL DEFAULT 0,
  preguntas_erradas INT NOT NULL DEFAULT 0,
  total_preguntas INT NOT NULL DEFAULT 0,
  total_puntos_acumulados INT NOT NULL DEFAULT 0,
  ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (numero_vehiculo, rol, id_evento),
  INDEX idx_puntos_evento_ranking (id_evento, total_puntos_acumulados DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🔒 Mecanismos de Seguridad y Rendimiento

1. **Protección del Leaderboard y Modo Suspenso:**
   - La API `/api/leaderboard` evalúa la visibilidad configurada para el evento.
   - Si `mostrar_ranking === false` y la petición no incluye el header de autorización `x-admin-pin`, el backend bloquea la respuesta con código `403` y bandera `rankingOculto: true`.
   - El panel `/admin` permite supervisión del ranking en vivo ininterrumpida.
2. **Rate Limiting por IP:**
   - Para prevenir escaneos y ataques de fuerza bruta al consultar cédulas en `/api/participants/validate/:documento`, se aplica un limitador de memoria que restringe el tráfico a 30 peticiones por minuto por dirección IP.
3. **Credenciales y Tokens Seguros:**
   - Cero credenciales o PINs de administración expuestos en bundles estáticos de React. La autenticación se verifica exclusivamente en el servidor Express vía variables de entorno (`ADMIN_PIN`).
4. **Optimización de Activos Web:**
   - Fondos fotográficos optimizados para transferencia ultra-ligera (<130 KB), evitando fallos de carga en redes móviles lentas o límites de tamaño de carga HTTP 413 en el proxy Nginx de GitLab.
