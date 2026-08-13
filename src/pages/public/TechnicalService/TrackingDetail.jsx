import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { getTechnicalServiceByCode, respondToQuote } from "../../../services/technicalService";
import { TECH_STATUS_CONFIG, TECH_TIMELINE_STEPS, QUOTE_STATUS, DEVICE_CONFIG, TECH_STATUS } from "../../../constants/technicalService";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function TrackingDetail() {
  const { code } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [respondingQuote, setRespondingQuote] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getTechnicalServiceByCode(code);
        if (!data) {
          setError("No encontramos esta solicitud.");
        } else {
          setService(data);
        }
      } catch (err) {
        console.error(err);
        setError("Ocurrió un error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [code]);

  const handleQuoteResponse = async (accepted) => {
    if (!service) return;
    setRespondingQuote(true);
    try {
      await respondToQuote(service.id, accepted);
      toast.success(accepted ? "Presupuesto aprobado" : "Presupuesto rechazado");
      // Refetch locally
      const updated = await getTechnicalServiceByCode(code);
      setService(updated);
    } catch (err) {
      toast.error("Ocurrió un error. Intentá de nuevo.");
    } finally {
      setRespondingQuote(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-lg mx-auto py-10 text-center">
        <p className="text-danger font-medium mb-4">{error}</p>
        <Link
          to="/servicio-tecnico/seguimiento"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a buscar
        </Link>
      </div>
    );
  }

  const deviceCfg = DEVICE_CONFIG[service.deviceType];
  const currentStatusCfg = TECH_STATUS_CONFIG[service.status];

  // Identificar índice del estado actual en el timeline (si es un estado lineal)
  const currentIndex = TECH_TIMELINE_STEPS.indexOf(service.status);
  
  const isRejected = service.status === TECH_STATUS.REJECTED;
  const isCancelled = service.status === TECH_STATUS.CANCELLED;
  
  // Si fue rechazado/cancelado, cortamos el timeline en QUOTED (o donde estuviera)
  // Para mostrar un diseño un poco diferente, usaremos el currentIndex o un estado de error.

  return (
    <div className="max-w-xl mx-auto py-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/servicio-tecnico/seguimiento"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-border hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <span className="rounded-full bg-primary-light px-4 py-1.5 text-sm font-bold tracking-widest text-primary">
          {service.trackingCode}
        </span>
      </div>

      {/* Info básica */}
      <div className="mb-8 text-center">
        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
          {deviceCfg?.icon} {service.brand} {service.model}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Servicio: <span className="font-medium text-gray-700">{service.serviceLabel}</span>
        </p>
      </div>

      {/* Estado Actual Destacado */}
      <div className={`mb-10 rounded-2xl border-2 p-6 text-center ${
        isRejected || isCancelled 
          ? "border-danger/20 bg-red-50" 
          : "border-primary/20 bg-primary-light"
      }`}>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
          isRejected || isCancelled ? "text-danger" : "text-primary"
        }`}>
          Estado Actual
        </p>
        <p className={`text-xl sm:text-2xl font-extrabold ${
          isRejected || isCancelled ? "text-danger" : "text-primary"
        }`}>
          {currentStatusCfg?.label || "Desconocido"}
        </p>
        
        {/* Mensajes contextuales según estado */}
        {service.status === TECH_STATUS.RECEIVED && (
          <p className="mt-2 text-sm text-primary/70">
            Estamos aguardando para revisar tu equipo.
          </p>
        )}
        {service.status === TECH_STATUS.READY && (
          <p className="mt-2 text-sm text-primary/70">
            ¡Tu equipo ya está listo! Podés pasar a retirarlo.
          </p>
        )}
      </div>

      {/* Panel de Presupuesto (Si está pendiente) */}
      {service.quoteStatus === QUOTE_STATUS.PENDING && (
        <div className="mb-10 overflow-hidden rounded-2xl border-2 border-amber-200 bg-white shadow-sm">
          <div className="bg-amber-50 px-5 py-4 border-b border-amber-100">
            <h3 className="text-base font-bold text-amber-800">💰 Presupuesto disponible</h3>
            <p className="text-xs text-amber-700 mt-1">
              Necesitamos tu aprobación para realizar el trabajo.
            </p>
          </div>
          <div className="p-5">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Diagnóstico técnico
              </p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {service.diagnostic || "Sin detalles adicionales."}
              </p>
            </div>
            <div className="mb-6 flex items-baseline justify-between border-t border-border pt-4">
              <span className="font-semibold text-gray-800">Costo total:</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(service.quote)}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleQuoteResponse(false)}
                disabled={respondingQuote}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition-all hover:border-danger hover:text-danger hover:bg-red-50 disabled:opacity-50"
              >
                ✕ Rechazar
              </button>
              <button
                onClick={() => handleQuoteResponse(true)}
                disabled={respondingQuote}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover disabled:opacity-50"
              >
                {respondingQuote ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Aceptar presupuesto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Visual */}
      {!isRejected && !isCancelled && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-800 mb-6 px-2">Progreso de tu reparación</h3>
          
          <div className="relative pl-6">
            {/* Línea vertical base */}
            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gray-100 rounded-full" />
            
            <div className="space-y-6">
              {TECH_TIMELINE_STEPS.map((step, idx) => {
                const stepCfg = TECH_STATUS_CONFIG[step];
                const isCompleted = currentIndex >= idx;
                const isCurrent = currentIndex === idx;
                
                return (
                  <div key={step} className="relative flex items-center gap-4">
                    {/* Dot */}
                    <div className="absolute -left-6 flex h-6 w-6 items-center justify-center bg-white">
                      <div className={`h-4 w-4 rounded-full border-2 transition-colors ${
                        isCompleted 
                          ? isCurrent 
                            ? "border-primary bg-primary" // Actual
                            : "border-success bg-success" // Pasado
                          : "border-gray-300 bg-white" // Futuro
                      }`}>
                        {isCompleted && !isCurrent && (
                          <svg className="h-3 w-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    {/* Texto */}
                    <div className="flex-1">
                      <p className={`text-sm font-semibold transition-colors ${
                        isCurrent 
                          ? "text-primary" 
                          : isCompleted 
                            ? "text-gray-800" 
                            : "text-gray-400"
                      }`}>
                        {stepCfg.shortLabel || stepCfg.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
