import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import DashboardNavbar from "../../../components/DashboardNavbar";
import Button from "../../../components/Button/Button";
import { getAdminPropertyById, getAdminUsers, reassignAdminProperty } from "../services/adminService";
import { formatPropertyPrice, getPropertyLocation, resolveImageUrl } from "../../../utils/property";
import { getErrorMessage } from "../../../shared/utils/errorMessages";

const AdminPropertyDetails = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [agents, setAgents] = useState([]);
  const [agentId, setAgentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProperty = async () => {
      if (!propertyId) {
        setError("Property not found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const [propertyResponse, userResponse] = await Promise.all([
          getAdminPropertyById(propertyId),
          getAdminUsers({ role: "ROLE_AGENT" }),
        ]);
        setProperty(propertyResponse);
        setAgentId(propertyResponse.agentId || "");
        setAgents(userResponse);
      } catch (loadError) {
        console.error("Failed to load property details:", loadError);
        setError(getErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  const handleReassign = async () => {
    if (!propertyId || !agentId) {
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const updatedProperty = await reassignAdminProperty(propertyId, agentId);
      setProperty(updatedProperty);
      setAgentId(updatedProperty.agentId || "");
      setMessage("Property reassigned successfully.");
    } catch (reassignError) {
      setMessage(getErrorMessage(reassignError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <DashboardNavbar />

      <main className="section-shell px-4 pb-16 pt-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <Link to="/admin/properties" className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to properties
          </Link>

          {loading && <section className="status-neutral rounded-[2rem] px-6 py-12 text-center">Loading property details...</section>}
          {!loading && error && <section className="status-error rounded-[2rem] px-6 py-12 text-center">{error}</section>}

          {!loading && !error && property && (
            <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="market-card rounded-[2rem]">
                  <img
                    src={resolveImageUrl(property.imageUrls?.[0])}
                    alt={property.title}
                    className="h-[420px] w-full object-cover"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(property.imageUrls || []).map((imageUrl, index) => (
                    <img
                      key={`${imageUrl}-${index}`}
                      src={resolveImageUrl(imageUrl)}
                      alt={`${property.title} ${index + 1}`}
                      className="h-24 w-full rounded-[1.25rem] border soft-border object-cover"
                    />
                  ))}
                  {(!property.imageUrls || property.imageUrls.length === 0) && (
                    <div className="status-neutral col-span-full rounded-[1.25rem] px-4 py-6 text-center text-sm">
                      No uploaded images for this property.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-panel rounded-[1.75rem] p-6">
                  <span className="eyebrow">Property Record</span>
                  <h1 className="headline-font page-heading mt-5 text-3xl font-bold">{property.title}</h1>
                  <p className="page-copy mt-3 text-sm">{getPropertyLocation(property)}</p>
                  <p className="page-heading mt-4 text-3xl font-bold">{formatPropertyPrice(property.price)}</p>
                  <p className="page-copy mt-4 text-sm leading-7">{property.description}</p>
                </div>

                <div className="glass-panel rounded-[1.75rem] p-6">
                  <h2 className="headline-font page-heading text-xl font-semibold">Admin Controls</h2>
                  <div className="mt-5 grid gap-4">
                    <div className="inset-panel rounded-[1.25rem] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Status</p>
                      <p className="page-heading mt-2 text-sm">
                        {property.available === false || property.buyerId ? "Sold" : "Available"}
                      </p>
                    </div>
                    <div className="inset-panel rounded-[1.25rem] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Current Agent ID</p>
                      <p className="page-heading mt-2 text-sm">{property.agentId || "N/A"}</p>
                    </div>
                    <div className="inset-panel rounded-[1.25rem] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Buyer ID</p>
                      <p className="page-heading mt-2 text-sm">{property.buyerId || "Not assigned"}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="page-copy mb-2 block text-sm">Reassign Agent</label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <select value={agentId} onChange={(event) => setAgentId(event.target.value)} className="field-base px-4 py-3 text-sm">
                        <option value="">Select an agent</option>
                        {agents.map((agent) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name} ({agent.email})
                          </option>
                        ))}
                      </select>
                      <Button onClick={handleReassign} loading={saving} disabled={!agentId || saving}>Reassign</Button>
                    </div>
                  </div>

                  {message && (
                    <div className={`${message.includes("successfully") ? "status-success" : "status-error"} mt-4 rounded-[1.25rem] px-4 py-3 text-sm`}>
                      {message}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPropertyDetails;
