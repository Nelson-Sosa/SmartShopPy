import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Loader2, User, Phone, Mail, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import PageContainer from "../../components/layout/PageContainer";
import { getTechnicalServiceById, updateTechnicalService } from "../../services/technicalService";
import { TECH_STATUS_OPTIONS, DEVICE_CONFIG, QUOTE_STATUS } from "../../constants/technicalService";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/formatCurrency";

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
        {title}
      </h3>
      <div className="rounded-xl border border-border bg-gray-50/50 p-4">
        {children}
      </div>
    </div>
  );
}

function DataRow({ label, value, icon: Icon }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />}
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function TechnicalServiceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    status: "",
    diagnostic: "",
    technicalNotes: "",
    quote: "",
    assignedTechnician: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getTechnicalServiceById(id);
        if (!data) {
          setError("Servicio no encontrado");
          return;
        }
        setService(data);
        setFormData({
          status: data.status || "",
          diagnostic: data.diagnostic || "",
          technicalNotes: data.technicalNotes || "",
          quote: data.quote || "",
          assignedTechnician: data.assignedTechnician || "",
        });
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleSave = async () => {
    if (!service) return;
    setSaving(true);
    
    // Si cambia de estado y es presupuesto, actualizamos quoteStatus
    const updates = {
      status: formData.status,
      diagnostic: formData.diagnostic.trim(),
      technicalNotes: formData.technicalNotes.trim(),
      assignedTechnician: formData.assignedTechnician.trim(),
    };

    if (formData.quote !== "") {
      updates.quote = Number(formData.quote);
      // Si se asignó un precio y el estado cambió a QUOTED, marcamos como pending
      if (formData.status === "quoted" && service.quoteStatus !== QUOTE_STATUS.APPROVED) {
         updates.quoteStatus = QUOTE_STATUS.PENDING;
      }
    } else {
      updates.quote = null;
    }

    try {
      await updateTechnicalService(id, updates, user.uid, "Actualización administrativa");
      toast.success("Cambios guardados");
      
      // Refetch locally
      const updated = await getTechnicalServiceById(id);
      setService(updated);
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageContainer>
    );
  }

  if (error || !service) {
    return (
      <PageContainer>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-danger">
          {error}
        </div>
      </PageContainer>
    );
  }

  const deviceCfg = DEVICE_CONFIG[service.deviceType];

  return (
    <PageContainer
      title={`Solicitud ${service.trackingCode}`}
      description={`Creada el ${new Date(service.createdAt?.toDate()).toLocaleDateString("es-PY")}`}
    >
      <div className="mb-6">
        <Link
          to="/admin/servicio-tecnico"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Columna Izquierda: Lectura (Cliente/Equipo) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-gray-800">Cliente</h2>
            <div className="divide-y divide-border">
              <DataRow label="Nombre" value={service.customerName} icon={User} />
              <DataRow label="WhatsApp" value={service.customerPhone} icon={Phone} />
              <DataRow label="Email" value={service.customerEmail} icon={Mail} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-gray-800">Equipo</h2>
            <div className="divide-y divide-border">
              <DataRow 
                label="Tipo" 
                value={`${deviceCfg?.icon} ${deviceCfg?.label}`} 
              />
              <DataRow label="Marca" value={service.brand} />
              <DataRow label="Modelo" value={service.model || "No especificado"} />
              <DataRow label="Servicio Solicitado" value={service.serviceLabel} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-sm font-bold text-gray-800">Problema Informado</h2>
            <p className="text-sm text-gray-600 leading-relaxed italic">
              "{service.customerProblem}"
            </p>

            {service.images?.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold text-gray-500 flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" /> Fotos adjuntas
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.images.map((img, i) => (
                    <a key={i} href={img.url} target="_blank" rel="noreferrer">
                      <img
                        src={img.url}
                        alt="Adjunto"
                        className="h-16 w-16 rounded-lg object-cover border border-border hover:opacity-80 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Gestión (Técnico/Admin) */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-bold text-gray-800">Gestión Técnica</h2>
              
              <div className="flex items-center gap-2">
                {service.quoteStatus === QUOTE_STATUS.APPROVED && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                    Presupuesto Aprobado
                  </span>
                )}
                {service.quoteStatus === QUOTE_STATUS.REJECTED && (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-danger ring-1 ring-red-200">
                    Presupuesto Rechazado
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Estado de la reparación
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {TECH_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Diagnóstico Técnico <span className="text-xs font-normal text-gray-400">(Visible para el cliente en el presupuesto)</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.diagnostic}
                  onChange={(e) => setFormData({ ...formData, diagnostic: e.target.value })}
                  placeholder="Detalles del diagnóstico, trabajos a realizar..."
                  className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Presupuesto (Gs.)
                </label>
                <input
                  type="number"
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Ej: 250000"
                  className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Técnico asignado
                </label>
                <input
                  type="text"
                  value={formData.assignedTechnician}
                  onChange={(e) => setFormData({ ...formData, assignedTechnician: e.target.value })}
                  placeholder="Nombre del técnico"
                  className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Notas Internas <span className="text-xs font-normal text-danger">(Oculto al cliente)</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.technicalNotes}
                  onChange={(e) => setFormData({ ...formData, technicalNotes: e.target.value })}
                  placeholder="Anotaciones privadas, repuestos comprados..."
                  className="w-full resize-none rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-border pt-5">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Guardar cambios
              </button>
            </div>
          </div>

          {/* Historial Timeline */}
          {service.history && service.history.length > 0 && (
            <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-bold text-gray-800">Historial de la solicitud</h2>
              <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                {service.history.map((entry, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-white" />
                    <p className="text-sm font-medium text-gray-800">{entry.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(entry.timestamp).toLocaleString("es-PY")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
