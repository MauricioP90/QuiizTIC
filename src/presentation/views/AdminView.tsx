import React, { useState, useEffect } from 'react';
import { BaseButton } from '../../shared/components/BaseButton';
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Calendar,
  Layers,
  Palette,
  CheckCircle2,
  Play,
  PlusCircle,
  ArrowLeft,
  RefreshCw,
  Trophy,
  Loader2,
  Sparkles,
  Car,
  IdCard,
  UserCheck,
  Users,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { getApiUrl } from '../../infrastructure/utils/apiHelper';
import { THEMES, type ThemeId } from '../../shared/theme/themeConfig';
import { useActiveEvent, type ActiveEventData, type TipoRegistro } from '../../shared/context/EventContext';

interface LeaderboardEntry {
  numeroVehiculo: string;
  rol: 'PROPIETARIO' | 'OPERADOR';
  documento?: string | null;
  nombreParticipante?: string | null;
  preguntasAcertadas: number;
  preguntasErradas: number;
  totalPreguntas: number;
  totalPuntosAcumulados: number;
}

export const AdminView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { activeEvent, refreshActiveEvent } = useActiveEvent();

  // Autenticación de Admin
  const [pinInput, setPinInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Datos del Panel
  const [events, setEvents] = useState<ActiveEventData[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estado del Formulario de Evento
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formNombre, setFormNombre] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formFechaInicio, setFormFechaInicio] = useState('');
  const [formFechaFin, setFormFechaFin] = useState('');
  const [formCategorias, setFormCategorias] = useState<string[]>([]);
  const [formTema, setFormTema] = useState<ThemeId>('macarena');
  const [formTipoRegistro, setFormTipoRegistro] = useState<TipoRegistro>('VEHICULO');
  const [formMostrarRanking, setFormMostrarRanking] = useState(true);
  const [formActivo, setFormActivo] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado del Leaderboard en Admin
  const [selectedEventForLeaderboard, setSelectedEventForLeaderboard] = useState<number | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [adminPin, setAdminPin] = useState<string>('');

  // Validar PIN contra el backend
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const pinToTest = pinInput.trim();
    if (!pinToTest) {
      setAuthError('Por favor ingresa el PIN.');
      return;
    }

    try {
      const res = await fetch(getApiUrl('/api/events'), {
        headers: { 'x-admin-pin': pinToTest }
      });

      if (res.ok) {
        setAdminPin(pinToTest);
        setIsAuthorized(true);
      } else {
        setAuthError('PIN de administrador incorrecto. Acceso denegado.');
        setPinInput('');
      }
    } catch {
      setAuthError('Error de conexión al validar el PIN.');
    }
  };

  // Cargar eventos y categorías
  const loadAdminData = async () => {
    if (!adminPin) return;
    setIsLoadingData(true);
    try {
      const [eventsRes, catsRes] = await Promise.all([
        fetch(getApiUrl('/api/events'), { headers: { 'x-admin-pin': adminPin } }),
        fetch(getApiUrl('/api/events/categories'), { headers: { 'x-admin-pin': adminPin } })
      ]);

      if (catsRes.ok) {
        const catsData: string[] = await catsRes.json();
        setAvailableCategories(catsData);
      } else {
        console.warn('No se pudieron obtener las categorías:', catsRes.status);
      }

      if (eventsRes.ok) {
        const eventsData: ActiveEventData[] = await eventsRes.json();
        setEvents(eventsData);

        // Si hay un evento activo, seleccionarlo para el leaderboard
        const active = eventsData.find((e) => e.activo) || eventsData[0];
        if (active) {
          setSelectedEventForLeaderboard(active.id);
        }
      } else {
        console.warn('No se pudieron obtener los eventos:', eventsRes.status);
      }
    } catch (err) {
      console.error('Error al cargar datos de administración:', err);
      setStatusMessage({ type: 'error', text: 'Error al conectar con el servidor.' });
    } finally {
      setIsLoadingData(false);
    }
  };

  // Cargar ranking por evento (con autorización admin para ver en tiempo real)
  const loadLeaderboard = async (eventId: number) => {
    setIsLoadingLeaderboard(true);
    try {
      const res = await fetch(getApiUrl(`/api/leaderboard?evento=${eventId}`), {
        headers: adminPin ? { 'x-admin-pin': adminPin } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setLeaderboardEntries(data);
      }
    } catch (err) {
      console.error('Error al cargar ranking:', err);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    if (isAuthorized && adminPin) {
      loadAdminData();
    }
  }, [isAuthorized, adminPin]);

  useEffect(() => {
    if (selectedEventForLeaderboard) {
      loadLeaderboard(selectedEventForLeaderboard);
    }
  }, [selectedEventForLeaderboard]);

  // Activar un evento
  const handleActivateEvent = async (id: number) => {
    setStatusMessage(null);
    try {
      const res = await fetch(getApiUrl(`/api/events/${id}/activate`), {
        method: 'POST',
        headers: { 'x-admin-pin': adminPin }
      });
      if (res.ok) {
        setStatusMessage({ type: 'success', text: `¡Evento #${id} activado con éxito!` });
        await loadAdminData();
        await refreshActiveEvent();
      } else {
        throw new Error('No se pudo activar el evento.');
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  // Abrir formulario para nuevo evento
  const handleOpenCreateForm = () => {
    setEditingId(null);
    setFormNombre('');
    setFormDescripcion('');
    setFormFechaInicio('');
    setFormFechaFin('');
    setFormCategorias([]);
    setFormTema('macarena');
    setFormTipoRegistro('VEHICULO');
    setFormMostrarRanking(true);
    setFormActivo(true);
    setShowForm(true);
  };

  // Abrir formulario para editar evento existente
  const handleOpenEditForm = (ev: ActiveEventData) => {
    setEditingId(ev.id);
    setFormNombre(ev.nombre);
    setFormDescripcion(ev.descripcion || '');
    setFormFechaInicio(ev.fechaInicio ? new Date(ev.fechaInicio).toISOString().slice(0, 16) : '');
    setFormFechaFin(ev.fechaFin ? new Date(ev.fechaFin).toISOString().slice(0, 16) : '');
    setFormCategorias(ev.categorias || []);
    setFormTema((ev.tema as ThemeId) || 'macarena');
    setFormTipoRegistro(ev.tipoRegistro || 'VEHICULO');
    setFormMostrarRanking(ev.mostrarRanking !== false);
    setFormActivo(ev.activo);
    setShowForm(true);
  };

  // Guardar evento (crear o editar)
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim()) {
      setStatusMessage({ type: 'error', text: 'El nombre del evento es requerido.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const payload = {
      nombre: formNombre.trim(),
      descripcion: formDescripcion.trim() || null,
      fechaInicio: formFechaInicio ? new Date(formFechaInicio).toISOString() : null,
      fechaFin: formFechaFin ? new Date(formFechaFin).toISOString() : null,
      categorias: formCategorias,
      tema: formTema,
      tipoRegistro: formTipoRegistro,
      mostrarRanking: formMostrarRanking,
      activo: formActivo
    };

    try {
      const url = editingId ? getApiUrl(`/api/events/${editingId}`) : getApiUrl('/api/events');
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': adminPin
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: editingId ? '¡Evento actualizado con éxito!' : '¡Evento creado con éxito!'
        });
        setShowForm(false);
        await loadAdminData();
        await refreshActiveEvent();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Error al guardar el evento.');
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle de categoría en el formulario
  const toggleCategory = (cat: string) => {
    if (formCategorias.includes(cat)) {
      setFormCategorias(formCategorias.filter((c) => c !== cat));
    } else {
      setFormCategorias([...formCategorias, cat]);
    }
  };

  // 1. Pantalla de Acceso con PIN
  if (!isAuthorized) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in-up">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl relative overflow-hidden text-center shadow-2xl">
          <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
            <KeyRound className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-black text-slate-100 mb-2">Panel de Administración</h2>
          <p className="text-xs text-slate-400 mb-6">
            Ingresa el PIN de seguridad para gestionar eventos, categorías y temas visuales.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Ingresa el PIN"
                className="w-full text-center text-2xl tracking-widest px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 bg-rose-950/40 border border-rose-900/50 rounded-xl text-rose-400 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <BaseButton variant="primary" fullWidth type="submit">
              Acceder al Panel
            </BaseButton>
          </form>

          <button
            onClick={onBack}
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a la Trivia
          </button>
        </div>
      </div>
    );
  }

  // 2. Pantalla Principal del Administrador
  return (
    <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col p-4 md:p-8 animate-fade-in text-slate-200">
      {/* Barra Superior */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-100">Panel de Administración</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configuración dinámica de eventos, selección de categorías y personalización visual.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-all"
            title="Recargar datos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
            Actualizar
          </button>

          <BaseButton variant="secondary" onClick={onBack} className="text-xs py-2 px-4 flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al Juego
          </BaseButton>
        </div>
      </header>

      {/* Alertas / Mensajes de estado */}
      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 animate-fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <ShieldAlert className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Tarjeta de Resumen: Evento Activo Actual */}
      {activeEvent && (
        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-indigo-950/15 relative overflow-hidden mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider animate-pulse">
                  ● Evento en Vivo
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  Tema: {THEMES[activeEvent.tema as ThemeId]?.name || activeEvent.tema}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  {activeEvent.tipoRegistro === 'CEDULA' ? (
                    <>
                      <IdCard className="w-3 h-3" /> Por Cédula
                    </>
                  ) : (
                    <>
                      <Car className="w-3 h-3" /> Por Vehículo
                    </>
                  )}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
                    activeEvent.mostrarRanking !== false
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {activeEvent.mostrarRanking !== false ? (
                    <>
                      <Trophy className="w-3 h-3 text-amber-400" /> Ranking Visible
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-amber-400" /> Ranking en Suspenso
                    </>
                  )}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">{activeEvent.nombre}</h2>
              {activeEvent.descripcion && (
                <p className="text-xs text-slate-300 mt-1 max-w-xl">{activeEvent.descripcion}</p>
              )}

              {/* Categorías que juegan */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" /> Categorías activas:
                </span>
                {activeEvent.categorias && activeEvent.categorias.length > 0 ? (
                  activeEvent.categorias.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                    >
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                    Todas las categorías habilitadas
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => handleOpenEditForm(activeEvent)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                Editar Evento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Principal: Lista de Eventos y Modal/Formulario */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Columna Izquierda (2/3): Gestión de Eventos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Eventos Registrados
            </h3>
            <button
              onClick={handleOpenCreateForm}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/25"
            >
              <PlusCircle className="w-4 h-4" />
              Crear Nuevo Evento
            </button>
          </div>

          {/* Formulario Crear / Editar (se despliega si showForm es true) */}
          {showForm && (
            <div className="glass-panel p-6 rounded-3xl border border-indigo-500/40 bg-slate-900/70 animate-fade-in shadow-2xl">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  {editingId ? `Editar Evento #${editingId}` : 'Configurar Nuevo Evento'}
                </h4>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 font-semibold"
                >
                  ✕ Cerrar
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre del Evento *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Trivia Navideña 2026, Semana de la Seguridad Vial"
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción</label>
                  <textarea
                    rows={2}
                    placeholder="Objetivo pedagógico o detalles de la campaña..."
                    value={formDescripcion}
                    onChange={(e) => setFormDescripcion(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Fechas de vigencia */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha de Inicio</label>
                    <input
                      type="datetime-local"
                      value={formFechaInicio}
                      onChange={(e) => setFormFechaInicio(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950/60 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha de Fin</label>
                    <input
                      type="datetime-local"
                      value={formFechaFin}
                      onChange={(e) => setFormFechaFin(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950/60 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Selector de Tipo de Registro */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-400" />
                    Tipo de Ingreso / Participante *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setFormTipoRegistro('VEHICULO')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        formTipoRegistro === 'VEHICULO'
                          ? 'bg-amber-500/15 border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Car className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <h5 className="text-xs font-bold text-white">Por Vehículo</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">Número de 4 dígitos y Rol (Propietario / Operador)</p>
                      </div>
                    </div>

                    <div
                      onClick={() => setFormTipoRegistro('CEDULA')}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        formTipoRegistro === 'CEDULA'
                          ? 'bg-amber-500/15 border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <IdCard className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <h5 className="text-xs font-bold text-white">Por Cédula / Documento</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">Valida automáticamente en BD permisos.personas (estado ACTIVO)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selector de Categorías de Preguntas */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Categorías de Preguntas a Incluir</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      (Si no seleccionas ninguna, se usarán todas)
                    </span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-950/60 border border-slate-800 rounded-xl max-h-44 overflow-y-auto">
                    {availableCategories.length === 0 ? (
                      <p className="text-xs text-slate-500 p-2 col-span-2">
                        No se detectaron categorías automáticas. Puedes escribir una abajo y agregarla.
                      </p>
                    ) : (
                      availableCategories.map((cat) => {
                        const isChecked = formCategorias.includes(cat);
                        return (
                          <label
                            key={cat}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-xs font-medium border ${
                              isChecked
                                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-200'
                                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleCategory(cat)}
                              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>{cat}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Selector de Tema Visual */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-indigo-400" />
                    Tema Visual de la Aplicación
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.values(THEMES).map((th) => {
                      const isSelected = formTema === th.id;
                      return (
                        <div
                          key={th.id}
                          onClick={() => setFormTema(th.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                            isSelected
                              ? 'bg-slate-800/90 border-indigo-400 shadow-md ring-2 ring-indigo-500/30'
                              : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex gap-1.5">
                            <span
                              className="w-4 h-4 rounded-full shadow-inner"
                              style={{ backgroundColor: th.previewColor }}
                            />
                            <span
                              className="w-4 h-4 rounded-full shadow-inner"
                              style={{ backgroundColor: th.previewSecondary }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-200">{th.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Control de Visibilidad de la Tabla de Posiciones / Ranking */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    Visibilidad del Podio / Ranking a Participantes
                  </label>
                  <div
                    onClick={() => setFormMostrarRanking(!formMostrarRanking)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      formMostrarRanking
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                          formMostrarRanking
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                            : 'bg-slate-900 border-slate-850 text-slate-500'
                        }`}
                      >
                        {formMostrarRanking ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                          {formMostrarRanking ? (
                            <>
                              <span>🏆 Ranking Público Activado</span>
                            </>
                          ) : (
                            <>
                              <span>🔒 Modo Suspenso (Ranking Oculto)</span>
                            </>
                          )}
                        </h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {formMostrarRanking
                            ? 'Los participantes ven el botón en cabecera y pueden consultar la tabla de posiciones en tiempo real.'
                            : 'Oculta el botón y protege la tabla para mantener la emoción y revelar a los ganadores al final.'}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        formMostrarRanking ? 'bg-amber-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          formMostrarRanking ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Checkbox Activar de inmediato */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                    <input
                      type="checkbox"
                      checked={formActivo}
                      onChange={(e) => setFormActivo(e.target.checked)}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Activar este evento de inmediato (los participantes jugarán este evento)</span>
                  </label>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end gap-3 pt-3">
                  <BaseButton
                    variant="ghost"
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-xs py-2"
                  >
                    Cancelar
                  </BaseButton>
                  <BaseButton
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    className="text-xs py-2 px-6 flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    {editingId ? 'Guardar Cambios' : 'Crear Evento'}
                  </BaseButton>
                </div>
              </form>
            </div>
          )}

          {/* Tabla / Lista de Eventos */}
          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-xs">
                No hay eventos registrados.
              </div>
            ) : (
              events.map((ev) => (
                <div
                  key={ev.id}
                  className={`glass-panel p-4 md:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                    ev.activo
                      ? 'border-indigo-500/40 bg-indigo-950/20 shadow-md'
                      : 'border-slate-800/80 bg-slate-900/30 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">#{ev.id}</span>
                      <h4 className="text-sm font-extrabold text-white">{ev.nombre}</h4>
                      {ev.activo && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          ACTIVO
                        </span>
                      )}
                      {ev.mostrarRanking === false ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Suspenso
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                          <Trophy className="w-2.5 h-2.5 text-amber-400" /> Ranking
                        </span>
                      )}
                    </div>
                    {ev.descripcion && (
                      <p className="text-xs text-slate-400 line-clamp-1">{ev.descripcion}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Palette className="w-3 h-3 text-slate-500" />
                        {THEMES[ev.tema as ThemeId]?.name || ev.tema}
                      </span>
                      <span className="text-[11px] text-slate-500">•</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-slate-500" />
                        {ev.categorias?.length ? `${ev.categorias.length} categorías` : 'Todas'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditForm(ev)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    >
                      Editar
                    </button>

                    {!ev.activo && (
                      <button
                        onClick={() => handleActivateEvent(ev.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Activar
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Columna Derecha (1/3): Tabla de Posiciones por Evento */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Ranking del Evento
            </h3>

            {/* Selector de evento para leaderboard */}
            <select
              value={selectedEventForLeaderboard || ''}
              onChange={(e) => setSelectedEventForLeaderboard(Number(e.target.value))}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.nombre} {ev.activo ? '(Activo)' : ''} {ev.mostrarRanking === false ? '🔒 (Oculto)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 bg-slate-950/40">
            {isLoadingLeaderboard ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                <span className="text-xs text-slate-400">Cargando ranking...</span>
              </div>
            ) : leaderboardEntries.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                No hay puntuaciones registradas para este evento aún.
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboardEntries.map((entry, index) => {
                  const isTop3 = index < 3;
                  return (
                    <div
                      key={`${entry.numeroVehiculo}-${entry.rol}`}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                        index === 0
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                          : index === 1
                          ? 'bg-slate-300/10 border-slate-400/30 text-slate-200'
                          : index === 2
                          ? 'bg-amber-700/10 border-amber-700/30 text-amber-300'
                          : 'bg-slate-900/40 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isTop3 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div>
                          {entry.nombreParticipante ? (
                            <>
                              <p className="font-bold text-slate-100 flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                                {entry.nombreParticipante}
                              </p>
                              <span className="text-[10px] text-slate-400 font-mono">
                                C.C. {entry.documento || entry.numeroVehiculo}
                              </span>
                            </>
                          ) : (
                            <>
                              <p className="font-bold text-slate-100 flex items-center gap-1">
                                <Car className="w-3.5 h-3.5 text-slate-400" />
                                Vehículo {entry.numeroVehiculo}
                              </p>
                              <span className="text-[10px] text-slate-400 uppercase">{entry.rol}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-extrabold text-sm text-indigo-300">
                          {entry.totalPuntosAcumulados} pts
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {entry.preguntasAcertadas}/{entry.totalPreguntas} aciertos
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
