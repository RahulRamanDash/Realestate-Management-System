import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import DashboardNavbar from "../../../components/DashboardNavbar";
import PropertyCard from "../components/PropertyCard";
import { getLoggedUser } from "../../../utils/auth";

const MyListings = () => {
  const navigate = useNavigate();
  const user = getLoggedUser();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user?.id) {
        setLoading(false);
        setError("Unable to identify the current agent.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await api.get("/properties", {
          params: { agentId: user.id },
        });

        setProperties(Array.isArray(response.data) ? response.data : []);
      } catch {
        try {
          const fallbackResponse = await api.get("/properties");
          const allProperties = Array.isArray(fallbackResponse.data) ? fallbackResponse.data : [];
          setProperties(allProperties.filter((property) => property.agentId === user.id));
        } catch (fallbackError) {
          console.error("Failed to load agent listings:", fallbackError);
          setError("Unable to load your listings right now.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [user?.id]);

  const handleEdit = (property) => {
    navigate(`/add-property?propertyId=${property.id || property._id}`);
  };

  const handleDelete = async (property) => {
    const propertyId = property.id || property._id;
    if (!propertyId) {
      return;
    }

    const confirmed = window.confirm(`Delete "${property.title}"?`);
    if (!confirmed) {
      return;
    }

    setDeletingId(propertyId);
    try {
      await api.delete(`/properties/${propertyId}`);
      setProperties((current) => current.filter((item) => (item.id || item._id) !== propertyId));
    } catch (deleteError) {
      console.error("Failed to delete property:", deleteError);
      setError("Unable to delete that listing right now.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="page-shell">
      <DashboardNavbar />

      <main className="section-shell px-4 pb-16 pt-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <span className="eyebrow">My Listings</span>
              <h1 className="headline-font page-heading text-4xl font-bold md:text-5xl">
                Manage only the properties you created.
              </h1>
              <p className="page-copy max-w-2xl text-base leading-7">
                This workspace is agent-only. It loads listings by `agentId`, keeps edit and delete actions scoped to your own records, and hides buyer actions entirely.
              </p>
            </div>

            <div className="summary-card rounded-[1.75rem] p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Agent Summary</p>
              <p className="page-heading mt-3 text-4xl font-bold">{properties.length}</p>
              <p className="page-copy mt-2 text-sm">Listings currently assigned to your account.</p>
              <div className="inset-panel page-copy mt-4 flex items-center justify-between rounded-[1.25rem] px-4 py-3 text-sm">
                <span>Sold properties</span>
                <span className="page-heading font-semibold">
                  {properties.filter((property) => property?.available === false || property?.buyerId).length}
                </span>
              </div>
            </div>
          </section>

          {loading && (
            <section className="status-neutral rounded-[2rem] px-6 py-12 text-center">
              Loading your listings...
            </section>
          )}

          {!loading && error && (
            <section className="status-error rounded-[2rem] px-6 py-12 text-center">
              {error}
            </section>
          )}

          {!loading && !error && properties.length === 0 && (
            <section className="status-neutral rounded-[2rem] px-6 py-12 text-center">
              You have not created any listings yet.
            </section>
          )}

          {!loading && !error && properties.length > 0 && (
            <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => {
                const propertyId = property.id || property._id;

                return (
                  <PropertyCard
                    key={propertyId}
                    property={property}
                    user={user}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    deleteLoading={deletingId === propertyId}
                  />
                );
              })}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyListings;
