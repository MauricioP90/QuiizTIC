# Especificaciones Técnicas, Flujos de Datos y Arquitectura

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
