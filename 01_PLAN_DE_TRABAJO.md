# Plan de Trabajo Maestro: Aplicación Interactiva de Aprendizaje por Escenarios

Este documento sirve como la **Directiva Principal de Desarrollo** para la inteligencia artificial o el equipo de ingeniería encargado de construir la aplicación. La plataforma está concebida como una solución web móvil-first, altamente interactiva, escalable y modular, diseñada para campañas de aprendizaje rápido basadas en situaciones reales.

---

## 📋 Información General del Proyecto
- **Enfoque de Diseño:** Mobile-First, Responsivo, Interactivo.
- **Stack Tecnológico Base:** Node.js, TypeScript, React.js (Inicializado con Vite).
- **Paradigma de Arquitectura:** Arquitectura Limpia (Clean Architecture) / Diseño Guiado por el Dominio (DDD).
- **Objetivo:** Permitir a los usuarios escanear un código QR, registrarse rápidamente (o ingresar directamente si ya poseen una sesión activa vía cookies), evaluar una serie de escenarios tácticos ("Buena Práctica" vs. "Mala Práctica") y recibir retroalimentación pedagógica inmediata con métricas de rendimiento.

---

## 🚀 Fase 1: Diseño de Interfaces Atractivas (UI/UX)
El éxito de esta aplicación radica en una fricción mínima de usuario, legibilidad óptima en pantallas móviles y una respuesta visual instantánea.

### 1.1 Estructura Visual Básica (Layout Dinámico)
- **Pantallas Pequeñas (Mobile):** División vertical limpia.
  - **Bloque Superior (60% de la pantalla):** Indicador de progreso (Ej: *"Pregunta 1 de 5"*), barra de progreso visual y el contenedor de texto de la situación/escenario.
  - **Bloque Inferior (40% de la pantalla):** Contenedor exclusivo para los botones de interacción de acción masiva: `[Buena Práctica]` y `[Mala Práctica]`.
- **Pantallas Grandes (Desktop/Tablet):** División horizontal equilibrada (Lado izquierdo para contexto/progreso, lado derecho para botones de decisión).

### 1.2 Mecánica de Temporizador (Gamificación)
- **Especificación:** Temporizador visual regresivo parametrizable (Recomendado: 10 segundos por escenario).
- **Comportamiento:** Animación fluida (barra que se reduce o color que cambia de verde a rojo). Si el contador llega a `0`:
  - Se deshabilitan inmediatamente los botones de respuesta.
  - Se registra el escenario como "No Respondido" / "Incorrecto".
  - Se muestra la pantalla/modal de retroalimentación indicando "¡Tiempo Agotado!".

### 1.3 Retroalimentación Inmediata (Feedback Háptico/Visual)
- Al hacer clic en una opción, el botón seleccionado debe cambiar de estado visual instantáneamente mediante clases CSS/Tailwind dedicadas:
  - **Respuesta Correcta:** Botón cambia a verde (`bg-green-600 text-white`) con un icono de verificación (✓).
  - **Respuesta Incorrecta:** Botón cambia a rojo (`bg-red-600 text-white`) con un icono de error (✗).
- Los botones contrarios se deshabilitan para evitar dobles pulsaciones.

### 1.4 Pantalla de Resultados y Cierre Pedagógico
Al finalizar el bloque de escenarios, se debe renderizar una vista de cierre de alto impacto visual:
- **Resumen Cuantitativo:** Puntuación destacada (Ej: *"¡Excelente! Obtuviste 4 de 5 puntos"*).
- **Acciones Principales:**
  - Botón `[Volver a Jugar]`: Reinicia el estado del juego generando un nuevo set aleatorio de preguntas.
  - Botón `[Ver Respuestas]`: Despliega un desglose histórico de cada escenario evaluado, mostrando la situación original, la opción del usuario, y la justificación técnica detallada (Riesgo/Beneficio y Recomendación).

---

## 🛠️ Fase 2: Arquitectura del Proyecto (Clean Architecture)
Para asegurar que la aplicación sea multi-campaña y altamente mantenible, se prohíbe el acoplamiento de lógica de negocio en las vistas. El proyecto implementará una estructura de capas estrictamente tipada en **TypeScript**.

### Estructura de Directorios del Código Fuente (`src/`)
La raíz del código de la aplicación se estructurará de la manera detallada en el documento de especificaciones técnicas y flujos.

---

## 📊 Fase 3: Estructuración de los Datos (Contratos de Escenarios)
Los datos de los escenarios no deben estar quemados (hardcoded) en el HTML. Se definen dinámicamente mediante estructuras estructuradas. Cada escenario debe responder rigurosamente a la siguiente interfaz de TypeScript:

### Modelo de Datos de un Escenario (Ejemplo conceptual)
```TypeScript
export interface IScenario {
  id: string;
  contexto: string;         // La situación o dilema planteado al usuario
  tipoPractica: 'BUENA' | 'MALA'; // La clasificación real de la acción
  riesgoBeneficio: string;  // Justificación del impacto inmediato de la acción
  recomendacion: string;    // Consejo práctico y accionable para mitigar el riesgo o potenciar el beneficio
}
```

**Nota para la IA de construcción:** Los textos de los escenarios deben cargarse desde un archivo JSON local en la capa de infraestructura, o consumirse desde una API REST, permitiendo cambiar de campaña con solo sustituir el origen de datos.

---

## 🧠 Fase 4: Desarrollo de la Lógica Interactiva
La aplicación es una máquina de estados finitos gestionada en React a través de un controlador centralizado (`useGameController` dentro de `presentation/controllers/`).

### 4.1 Variables de Estado Requeridas
- **currentScenarioIndex:** Índice numérico del escenario actual.
- **score:** Entero acumulador de respuestas correctas.
- **isGameOver:** Booleano que conmuta a la pantalla de resultados.
- **selectedAnswer:** Almacena temporalmente la opción elegida por el usuario en el escenario actual (`'BUENA' | 'MALA' | null`).
- **showFeedback:** Controla la visibilidad de la pausa pedagógica.

### 4.2 Algoritmo de Validación y Pausa Pedagógica
Cuando el usuario presiona un botón de opción:
1. Se evalúa de inmediato: ¿`selectedAnswer === escenarioActual.tipoPractica`?
2. Si es verdadero, se incrementa el estado `score` en `+1`.
3. Se activa `showFeedback = true` para pintar el botón con la clase CSS correspondiente.
4. **Pausa Pedagógica Bloqueante (1.5 a 3 segundos):** Se ejecuta un `setTimeout`. Durante este tiempo, se muestra un modal intermedio o un panel inferior con los campos `riesgoBeneficio` y `recomendacion`. Esto asegura que el usuario consuma el contenido educativo antes de avanzar.
5. Al finalizar el tiempo, se limpia el temporizador, se avanza el `currentScenarioIndex` y se restablecen los estados para el próximo escenario. Si era el último escenario, se cambia `isGameOver = true`.

---

## 🌐 Fase 5: Registro, Despliegue y Acceso por QR

### 5.1 Flujo de Onboarding e Identificación
Antes de iniciar los escenarios, la aplicación valida la identidad del participante.
- Se implementará un sistema de persistencia liviano basado en cookies de navegador o LocalStorage.
- Al cargar la app, se verifica la existencia del identificador del participante. Si existe, se salta el formulario directamente hacia la carga de escenarios. Si no existe, se le obliga a pasar por el componente de Registro.

### 5.2 Estrategia de Despliegue (PWA / Web App)
La aplicación se compilará de forma estática utilizando el comando de producción de Vite (`npm run build`).
- **Alojamiento:** Servidores de despliegue rápido con soporte SSL/HTTPS obligatorio (esencial para la lectura de cookies seguras y funcionamiento de PWA).
- **Acceso mediante QR:** El despliegue generará un enlace único absoluto (Ej: `https://aprende-escenarios.campana.com`). Este enlace se codificará en un código QR de alta densidad con un nivel de corrección de errores de nivel 'M' o 'H', permitiendo su escaneo rápido en materiales impresos de campañas de comunicación interna, pósters, o presentaciones digitales.
