import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../../components/DashboardNavbar";
import Button from "../../../components/Button/Button";
import ConfirmDialog from "../../../components/ConfirmDialog";
import api from "../../../api/axiosInstance";
import { getAdminProperties } from "../services/adminService";
import { formatPropertyPrice } from "../../../utils/property";
import { getErrorMessage } from "../../../shared/utils/errorMessages";

const initialFilters = {
  search: "",
  city: "",
  type: "",
  availability: "",
};

const AdminProperties = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState({ isOpen: false, property: null });
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const loadProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminProperties({
        search: filters.search || undefined,
        city: filters.city || undefined,
        type: filters.type || undefined,
        availability: filters.availability || undefined,
      });
      setProperties(response);
    } catch (loadError) {
      console.error("Failed to load admin properties:", loadError);
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleDelete = async () => {
    const propertyId = dialog.property?.id;
    if (!propertyId) {
      return;
    }

    setDeleting(true);
    setMessage("");
    try {
      await api.delete(`/properties/${propertyId}`);
      setProperties((current) => current.filter((property) => property.id !== propertyId));
      setMessage("Property deleted successfully.");
      setDialog({ isOpen: false, property: null });
    } catch (deleteError) {
      setMessage(getErrorMessage(deleteError));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-shell">
      <DashboardNavbar />

      <main className="section-shell px-4 pb-16 pt-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="space-y-4">
            <span className="eyebrow">Admin Properties</span>
            <h1 className="headline-font page-heading text-4xl font-bold md:text-5xl">Inspect and control all listings.</h1>
            <p className="page-copy max-w-2xl text-base leading-7">
              Search the full property catalog, open details, reassign ownership, or remove listings that should not stay live.
            </p>
          </section>

          <section className="glass-panel rounded-[1.75rem] p-6">
            <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleChange}
                  placeholder="Search title, address, city, state"
                  className="field-base py-3 pl-10 pr-4 text-sm"
                />
              </div>
              <input type="text" name="city" value={filters.city} onChange={handleChange} placeholder="City" className="field-base px-4 py-3 text-sm" />
              <select name="type" value={filters.type} onChange={handleChange} className="field-base px-4 py-3 text-sm">
                <option value="">All types</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
              </select>
              <select name="availability" value={filters.availability} onChange={handleChange} className="field-base px-4 py-3 text-sm">
                <option value="">All statuses</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
              <Button onClick={loadProperties}>Apply Filters</Button>
            </div>
          </section>

          {message && (
            <section className={`${message.includes("successfully") ? "status-success" : "status-error"} rounded-[1.25rem] px-4 py-3 text-sm`}>
              {message}
            </section>
          )}

          {loading && <section className="status-neutral rounded-[2rem] px-6 py-12 text-center">Loading properties...</section>}
          {!loading && error && <section className="status-error rounded-[2rem] px-6 py-12 text-center">{error}</section>}

          {!loading && !error && (
            <section className="glass-panel overflow-hidden rounded-[1.75rem]">
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Agent</th>
                      <th>Buyer</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => {
                      const sold = property.available === false || Boolean(property.buyerId);
                      return (
                        <tr key={property.id}>
                          <td>
                            <div>
                              <p className="page-heading font-semibold">{property.title}</p>
                              <p className="page-copy text-sm">{property.city}, {property.state}</p>
                            </div>
                          </td>
                          <td>{property.type}</td>
                          <td>{sold ? "Sold" : "Available"}</td>
                          <td className="truncate">{property.agentId || "N/A"}</td>
                          <td className="truncate">{property.buyerId || "Not assigned"}</td>
                          <td>{formatPropertyPrice(property.price)}</td>
                          <td>
                            <div className="flex flex-wrap gap-2">
                              <Button variant="secondary" onClick={() => navigate(`/admin/properties/${property.id}`)}>View</Button>
                              <Button variant="secondary" onClick={() => navigate(`/add-property?propertyId=${property.id}&source=admin`)}>Edit</Button>
                              <Button variant="danger" onClick={() => setDialog({ isOpen: true, property })}>Delete</Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {properties.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center">No properties matched the current filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </main>

      <ConfirmDialog
        isOpen={dialog.isOpen}
        title="Delete Property"
        message={`Delete "${dialog.property?.title}"? This cannot be undone.`}
        confirmText="Delete"
        danger={true}
        onConfirm={handleDelete}
        onCancel={() => setDialog({ isOpen: false, property: null })}
        loading={deleting}
      />
    </div>
  );
};

export default AdminProperties;
