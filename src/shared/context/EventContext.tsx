import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../../infrastructure/utils/apiHelper';
import { getTheme, type ThemeConfig } from '../theme/themeConfig';

export type TipoRegistro = 'VEHICULO' | 'CEDULA';

export interface ActiveEventData {
  id: number;
  nombre: string;
  descripcion: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  categorias: string[];
  tema: string;
  tipoRegistro: TipoRegistro;
  mostrarRanking?: boolean;
  activo: boolean;
}

interface EventContextProps {
  activeEvent: ActiveEventData | null;
  theme: ThemeConfig;
  isLoadingEvent: boolean;
  refreshActiveEvent: () => Promise<void>;
}

const defaultEvent: ActiveEventData = {
  id: 1,
  nombre: 'CiberTrivia Macarena',
  descripcion: 'Campaña de aprendizaje interactivo',
  fechaInicio: null,
  fechaFin: null,
  categorias: [],
  tema: 'macarena',
  tipoRegistro: 'VEHICULO',
  mostrarRanking: true,
  activo: true
};

const EventContext = createContext<EventContextProps>({
  activeEvent: defaultEvent,
  theme: getTheme('macarena'),
  isLoadingEvent: true,
  refreshActiveEvent: async () => {}
});

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeEvent, setActiveEvent] = useState<ActiveEventData | null>(defaultEvent);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);

  const fetchActiveEvent = async () => {
    try {
      const res = await fetch(getApiUrl('/api/events/active'));
      if (res.ok) {
        const data = await res.json();
        setActiveEvent(data);
      }
    } catch (err) {
      console.warn('No se pudo cargar el evento activo del servidor, usando tema por defecto:', err);
    } finally {
      setIsLoadingEvent(false);
    }
  };

  useEffect(() => {
    fetchActiveEvent();
  }, []);

  const theme = getTheme(activeEvent?.tema);

  useEffect(() => {
    if (theme?.bodyStyle) {
      document.body.style.backgroundColor = theme.bodyStyle.backgroundColor;
      document.body.style.backgroundImage = theme.bodyStyle.backgroundImage;
      document.body.style.backgroundAttachment = theme.bodyStyle.backgroundAttachment || 'fixed';
      document.body.style.backgroundSize = theme.bodyStyle.backgroundSize || 'cover';
      document.body.style.backgroundPosition = theme.bodyStyle.backgroundPosition || 'center';
      document.body.style.backgroundRepeat = theme.bodyStyle.backgroundRepeat || 'no-repeat';
    }
  }, [theme]);

  return (
    <EventContext.Provider
      value={{
        activeEvent,
        theme,
        isLoadingEvent,
        refreshActiveEvent: fetchActiveEvent
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useActiveEvent = () => useContext(EventContext);
