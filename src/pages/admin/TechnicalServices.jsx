import { useState, useEffect } from "react";
import { 
  Wrench, 
  Search, 
  Filter, 
  Eye, 
  Plus, 
  Loader2 
} from "lucide-react";
import { Link } from "react-router-dom";
import PageContainer from "../../../components/layout/PageContainer";
import EmptyState from "../../../components/ui/EmptyState";
import { getTechnicalServices } from "../../../services/technicalService";
import { TECH_STATUS_CONFIG, DEVICE_CONFIG, TECH_STATUS_OPTIONS, DEVICE_TYPE } from "../../../constants/technicalService";

const PAGE_SIZE = 20;

function StatusBadge({ status }) {
  const cfg = TECH_STATUS_CONFIG[status];
  if (!cfg) return <span className="text-gray-400">-</span>;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${cfg.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotColor}`} />
      {cfg.shortLabel}
    </span>
  );
}

function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("es-PY", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function TechnicalServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Paginación (simple)
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchServices = async (isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await getTechnicalServices({
        statusFilter,
        deviceFilter,
        pageSize: PAGE_SIZE,
        lastDoc: isLoadMore ? lastDoc : null
      });

      if (isLoadMore) {
        setServices((prev) => [...prev, ...res.services]);
      } else {
        setServices(res.services);
      }
      setLastDoc(res.lastDoc);
      setHasMore(res.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, deviceFilter]);

  // Filtrado local por código (búsqueda rápida)
  const filteredServices = services.filter((s) => {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return s.trackingCode.toLowerCase().includes(lowerSearch) ||
           s.customerName.toLowerCase().includes(lowerSearch);
  });

  return (
    <PageContainer
      title="Servicio Técnico"
      description="Gestiona las solicitudes de reparación y mantenimiento"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por código o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-border bg-white py-2 pl-9 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border bg-white py-2 pl-9 pr-10 text-sm text-gray-800 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-auto"
              >
                <option value="all">Todos los estados</option>
                {TECH_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-white px-4 py-2 text-sm text-gray-800 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-auto"
            >
              <option value="all">Todos los equipos</option>
              <option value={DEVICE_TYPE.PHONE}>📱 Celulares</option>
              <option value={DEVICE_TYPE.COMPUTER}>💻 PCs / Notebooks</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white">
          <EmptyState
            icon={Wrench}
            title="No hay solicitudes"
            description="No se encontraron servicios técnicos con los filtros actuales."
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b border-border bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Equipo</th>
                  <th className="px-6 py-4">Servicio</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredServices.map((svc) => (
                  <tr key={svc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">{svc.trackingCode}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {svc.customerName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span>{DEVICE_CONFIG[svc.deviceType]?.icon}</span>
                        <span>{svc.brand} {svc.model}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {svc.serviceLabel}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={svc.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {formatDate(svc.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/servicio-tecnico/${svc.id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-primary-light hover:text-primary"
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {hasMore && (
            <div className="border-t border-border p-4 text-center">
              <button
                onClick={() => fetchServices(true)}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                Cargar más
              </button>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}
