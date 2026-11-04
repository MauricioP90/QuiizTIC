# Plan de Trabajo Maestro: QuizzTIC - Aplicación Interactiva de Aprendizaje por Escenarios

Este documento sirve como la **Directiva Principal de Desarrollo y Registro de Evolución** para el equipo de ingeniería e inteligencia artificial. QuizzTIC es una solución web móvil-first, altamente interactiva, modular y multi-campaña, diseñada para programas de concientización, seguridad vial, ciberseguridad y cultura corporativa basadas en situaciones reales.

---

## 📋 Información General del Proyecto
- **Enfoque de Diseño:** Mobile-First, Responsivo, Gamificado, Multi-Tema.
- **Stack Tecnológico:**
  - **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas-Confetti.
  - **Backend:** Node.js, Express, TypeORM 0.3+, MySQL 8 (mysql2).
- **Paradigma de Arquitectura:** Arquitectura Limpia (Clean Architecture) / Puertos y Adaptadores (Arquitectura Hexagonal).
- **Objetivo:** Permitir a los colaboradores o transportadores escanear un código QR o acceder vía web, autenticarse (por vehículo o cédula validada), responder escenarios tácticos con retroalimentación inmediata, acumular puntos y competir sanamente en un ranking oficial administrado.

---

## 🚀 Fase 1: Diseño de Interfaces y Experiencia de Usuario (UI/UX)
- **1.1 Layout Dinámico y Responsive:**
  - Diseño optimizado para smartphones y pantallas táctiles de vehículos o tablets.
  - Vistas divididas con foco en legibilidad, micro-animaciones (`animate-fade-in-up`, `animate-float`) y tarjetas translúcidas de cristal (*glassmorphism*).
- **1.2 Gamificación y Temporizador:**
  - Temporizador visual regresivo por escenario (180 segundos por decisión).
  - Si el temporizador expira, se califica automáticamente como no respondida / incorrecta y se abre la pausa formativa.
- **1.3 Retroalimentación Inmediata con Refuerzo:**
  - Botones interactivos con colores tácticos (verde para aciertos, rojo para fallos).
  - Explicación inmediata estructurada en: **Riesgo / Beneficio** y **Recomendación Práctica**.
- **1.4 Pantalla de Resultados y Resumen Comparativo:**
  - Métricas de la ronda actual frente a los acumulados históricos del participante en MySQL.
  - Personaje ilustrado reactivo según el rendimiento (desempeño impecable, buen trabajo o refuerzo necesario).

---

## 🎨 Fase 2: Motor de Tematización Visual Dinámica (Multi-Campaña)
Para adaptar la plataforma a distintas campañas del año sin tocar código fuente:
- **Temas Implementados:**
  - `macarena`: Identidad corporativa de Flota La Macarena (azul cobalto y verde esmeralda con fondo de verano optimizado).
  - `cyber`: Campaña de Ciberseguridad y TI (violeta, cian y fondo tecnológico).
  - `halloween`: Semana de la Seguridad Vial y Halloween (naranja calabaza y púrpura oscuro).
  - `navidad`: Campaña navideña y fin de año (rojo carmesí y verde esmeralda).
- **Optimización de Assets:** Fondos fotográficos comprimidos y redimensionados para web (< 130 KB) con capas de opacidad equilibrada que garantizan legibilidad perfecta y evitan errores de tamaño en Git.

---

## 👥 Fase 3: Doble Modalidad de Registro y Validación
La plataforma admite dos modalidades de acceso según el tipo de evento configurado por la organización:
1. **Modalidad Vehículo (`VEHICULO`):**
   - Número de vehículo (máx. 4 dígitos numéricos).
   - Rol del participante: `PROPIETARIO` u `OPERADOR`.
2. **Modalidad Cédula / Colaborador (`CEDULA`):**
   - Validación en tiempo real contra la tabla corporativa `permisos.personas`.
   - Consulta el estado laboral del colaborador; únicamente los usuarios con estado `ACTIVO` pueden ingresar a la trivia.
   - Autocompleta automáticamente el nombre del participante y previene suplantaciones.
   - Protección con límite de peticiones (Rate Limiting de 30 consultas/minuto por IP).

---

## 🏆 Fase 4: Tablero de Posiciones (Leaderboard) y Modo Suspenso
- **Top 10 en Tiempo Real:** Ranking filtrado por evento activo, calculando puntos acumulados, aciertos y total de preguntas resueltas.
- **Control de Visibilidad para Administradores (`mostrar_ranking`):**
  - **Ranking Visible:** Habilita el botón en la cabecera principal y en la pantalla de resumen para que los participantes consulten las posiciones.
  - **Modo Suspenso (Ranking Oculto):** Oculta los botones a los participantes y bloquea el acceso directo a `/leaderboard` mostrando una pantalla de intriga. Esto permite mantener la expectativa hasta el cierre del evento o la premiación.
  - **Monitoreo en Vivo para Administradores:** Desde `/admin`, los organizadores pueden auditar el ranking en tiempo real en todo momento mediante su PIN seguro, aun cuando esté oculto al público.

---

## ⚙️ Fase 5: Panel de Administración Dinámico (`/admin`)
- Protegido por PIN de seguridad verificado en el backend (sin claves expuestas en bundles cliente).
- Creación y edición de eventos en tiempo real:
  - Nombre y descripción de la campaña.
  - Rango de fechas de vigencia (inicio y fin).
  - Modalidad de registro (`Por Vehículo` o `Por Cédula`).
  - Filtro granular de categorías de preguntas (selección múltiple o todas).
  - Tema visual activo.
  - Conmutador de visibilidad del ranking (Modo público vs. Modo suspenso).
  - Activación inmediata de evento.

---

## 🗄️ Fase 6: Arquitectura Backend y Persistencia Relacional
- Migración desde mocks estáticos a **MySQL 8** mediante **TypeORM**:
  - `eventos`: Catálogo de campañas, configuraciones, tema y visibilidad de ranking.
  - `preguntas`: Pool de preguntas categorizadas con escenarios de buena/mala práctica.
  - `registro_respuestas`: Bitácora histórica auditable de cada respuesta emitida por participante y evento.
  - `puntos_acumulados`: Tabla consolidada de puntajes acumulados para consultas de alto rendimiento indexadas (`idx_puntos_evento_ranking`).
  - `permisos.personas`: Integración de lectura para validación de nómina/colaboradores.
- Migraciones automáticas idempotentes al inicializar el servidor (`initDb.ts`).

---

## 📈 Estado del Proyecto y Próximos Pasos Recomendados
- [x] Arquitectura Hexagonal desacoplada en cliente y servidor.
- [x] Motor multi-tema visual con fondos optimizados.
- [x] Sistema multi-evento con selector de categorías.
- [x] Doble flujo de autenticación (Cédula y Vehículo).
- [x] Leaderboard con control de visibilidad y modo suspenso.
- [x] Despliegue listo para producción y repositorio corporativo GitLab sincronizado.
- [ ] Exportación de reportes de participación en Excel / CSV desde el panel de administración.
- [ ] Soporte para preguntas con imágenes o infografías contextuales.
