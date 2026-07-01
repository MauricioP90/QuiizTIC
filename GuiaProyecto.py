import os

# Define the content for File 1: Plan de Trabajo Maestro
plan_trabajo_content = """# Plan de Trabajo Maestro: Aplicación Interactiva de Aprendizaje por Escenarios

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
"""

# Define the content for File 2: Especificaciones Técnicas y Flujo
arquitectura_flujo_content = """# Especificaciones Técnicas, Flujos de Datos y Arquitectura

Este archivo complementa el Plan de Trabajo Maestro, proporcionando diagramas detallados, especificaciones del flujo lógico e instrucciones de bajo nivel para codificar la aplicación interactiva utilizando Node.js, TypeScript y React/Vite.

🗺️ Mapa de Flujo del Sistema (Workflow de Usuario)
A continuación se detalla el ciclo de vida completo de un usuario desde el punto de acceso físico/digital hasta la finalización de la actividad pedagógica:

```plaintext
       [ Código QR Físico / Digital ]
                     │
                     ▼ Escaneo con Smartphone
       [ URL de la Aplicación Web (HTTPS) ]
                     │
                     ▼ Carga inicial
            ┌────────┴────────┐
            │ ¿Existe Cookie? │
            └────────┬────────┘
                     │
            ┌────────┴────────────────┐
            ▼ NO                      ▼ SÍ (Sesión Activa)
   [ Pantalla de Bienvenida ]    [ Obtener Situación Aleatoria ]
            │                                 │
            ▼ Acción: Comenzar                │
   [ Registro de Usuario ]                    │
   (Nombre, ID, Área, etc.)                  │
            │                                 │
            ▼ Acción: Enviar Formulario       │
   [ Guardar Participante ]                   │
   (Escribe Cookie + DB/API)                  │
            │                                 │
            └────────────────────────┬────────┘
                                     │
                                     ▼
                       [ Mostrar Escenario / Situación ]
                       (Renderiza Texto + Temporizador 10s)
                                     │
                                     ▼ Interacción del Usuario
                       [ Usuario Responde Opción ]
                       (Selecciona: ¿Buena o Mala Práctica?)
                                     │
                                     ▼
                             [ Validar Respuesta ]
                     Compara Selección vs. Tipo de Práctica
                                     │
                                     ▼
                            [ Actualizar Puntaje ]
                         (Suma +1 si es Correcta)
                                     │
                                     ▼
                           [ Mostrar Resultado ]
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
             [ Feedback Visual ]             [ Pausa Pedagógica ]
           (Color Verde o Rojo)            Despliega Explicación:
                                           • Riesgo / Beneficio
                                           • Recomendación
                                                     │
                                                     ▼ Transcurre setTimeout (1.5s - 3s)
                                           ¿Quedan más escenarios?
                                           ┌─────────┴─────────┐
                                           ▼ SÍ                ▼ NO
                                    Siguiente Escenario  [ Pantalla de Resultados ]
                                                               │
                                                               ▼
                                                     [ Gracias por Participar ]
                                                     (Opciones: Reiniciar / Ver historial)
```

🗂️ Arquitectura Detallada de Carpetas (Estructura de Código)
Para garantizar el desacoplamiento de código sugerido en el enfoque de Arquitectura Limpia, la estructura en TypeScript se implementará bajo las siguientes directrices rigurosas:

```plaintext
src/
│
├── domain/
│   ├── entities/
│   │   ├── Scenario.ts       # Contrato e interfaz del modelo de escenarios.
│   │   ├── Participant.ts    # Estructura de datos del usuario registrado.
│   │   └── GameSession.ts    # Estado de la partida actual (puntaje, aciertos).
│   ├── repositories/
│   │   ├── IScenarioRepository.ts    # Definición de interfaz para recuperar preguntas.
│   │   └── IParticipantRepository.ts  # Definición de interfaz para persistir usuarios.
│   └── services/
│       └── GameLogicService.ts        # Algoritmia pura para verificar respuestas y calcular notas.
│
├── application/
│   ├── use-cases/
│   │   ├── GetRandomScenarios.ts      # Caso de uso: Selecciona 'N' escenarios aleatorios del pool.
│   │   ├── RegisterNewParticipant.ts  # Caso de uso: Valida datos y gatilla guardado de participante.
│   │   └── ProcessAnswer.ts           # Caso de uso: Procesa la opción elegida y actualiza la sesión.
│
├── infrastructure/
│   ├── database/
│   │   ├── CookieManager.ts           # Utilidad nativa de lectura/escritura de Cookies seguras.
│   │   └── LocalStorageDb.ts          # Respaldo local de datos en formato Clave-Valor.
│   ├── repositories/
│   │   ├── MockScenarioRepository.ts  # Implementación concreta que lee desde JSON estático.
│   │   └── ApiParticipantRepository.ts # Implementación concreta que envía datos al backend mediante Fetch/Axios.
│   └── api/
│       └── ApiClient.ts               # Configuración base de llamadas HTTP (Node.js/Axios client).
│
├── presentation/
│   ├── controllers/
│   │   └── useGameController.ts       # React Hook personalizado. Maneja la máquina de estados del juego.
│   ├── components/
│   │   ├── ScenarioCard.tsx           # Renderiza la situación actual.
│   │   ├── GameTimer.tsx              # Componente lógico del reloj de 10 segundos.
│   │   └── FeedbackModal.tsx          # Componente modal de la Pausa Pedagógica.
│   └── views/
│       ├── WelcomeView.tsx            # Vista de la Landing Page.
│       ├── RegistrationView.tsx       # Vista del Formulario.
│       ├── GameplayView.tsx           # Contenedor principal de la experiencia de juego.
│       └── SummaryView.tsx            # Pantalla final de resultados pedagógicos.
│
└── shared/
    ├── components/
    │   ├── BaseButton.tsx             # Botón genérico estilizado con variantes (primario, peligro).
    │   └── ProgressBar.tsx            # Barra de progreso genérica.
    └── utils/
        └── Environment.ts             # Variables de entorno fuertemente tipadas.
```

💻 Especificaciones de Código e Interfaces Base (TypeScript)
Para guiar de manera inequívoca a la IA de generación de código, se proveen los contratos principales de TypeScript que gobernarán las capas del dominio y aplicación:

1. Entidad de Escenario (src/domain/entities/Scenario.ts)
```TypeScript
export type PracticeType = 'BUENA' | 'MALA';

export interface Scenario {
  id: string;
  contexto: string;
  tipoPractica: PracticeType;
  riesgoBeneficio: string;
  recomendacion: string;
}
```

2. Entidad de Participante (src/domain/entities/Participant.ts)
```TypeScript
export interface Participant {
  uuid: string;
  nombre: string;
  correo: string;
  areaTrabajo?: string;
  registradoEn: Date;
}
```

3. Interfaz de Repositorio de Escenarios (src/domain/repositories/IScenarioRepository.ts)
```TypeScript
import { Scenario } from '../entities/Scenario';

export interface IScenarioRepository {
  getAllScenarios(): Promise<Scenario[]>;
  getScenariosByCampaign(campaignId: string): Promise<Scenario[]>;
}
```

🤖 Directivas de Implementación para el Generador Automático (Prompt Engine)
Al pasar estos archivos a la IA encargada de la codificación, instrúyase lo siguiente:

- Estricto TypeScript: No se permite el uso de any. Todos los componentes de React deben tiparse usando React.FC o retornos explícitos de JSX.
- Estilos Aislados: Utilizar Tailwind CSS para el manejo del diseño mobile-first. Asegurar que las clases de feedback (bg-green-600, bg-red-600) se inyecten dinámicamente según el estado evaluado por el controlador.
- Manejo de Efectos: El componente GameTimer.tsx debe limpiar sus intervalos (clearInterval) en el retorno de su useEffect para mitigar fugas de memoria (memory leaks).
- Cumplimiento de Clean Architecture: Los componentes de la vista en presentation/ nunca deben invocar directamente a CookieManager o APIs externas; siempre deben hacerlo a través de las funciones expuestas por el Hook Controlador (useGameController), el cual a su vez invoca a los Casos de Uso (application/use-cases/).
"""

# Directory where the files will be saved
output_dir = os.path.dirname(os.path.abspath(__file__))
os.makedirs(output_dir, exist_ok=True)

# Write files to the directory
file1_path = os.path.join(output_dir, "01_PLAN_DE_TRABAJO.md")
file2_path = os.path.join(output_dir, "02_ARQUITECTURA_Y_LOGICA.md")

with open(file1_path, "w", encoding="utf-8") as f1:
    f1.write(plan_trabajo_content.strip())

with open(file2_path, "w", encoding="utf-8") as f2:
    f2.write(arquitectura_flujo_content.strip())

print(f"Archivos creados de forma exitosa en: {output_dir}")
