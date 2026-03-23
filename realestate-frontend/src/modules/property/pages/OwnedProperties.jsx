import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import DashboardNavbar from "../../../components/DashboardNavbar";
import PropertyCard from "../components/PropertyCard";
import { getLoggedUser } from "../../../utils/auth";

const OwnedProperties = () => {
  const user = getLoggedUser();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwnedProperties = async () => {
      if (!user?.id) {
        setError("Unable to identify the current buyer.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/properties/buyer/${user.id}`);
        setProperties(Array.isArray(response.data) ? response.data : []);
      } catch (fetchError) {
        console.error("Failed to load buyer properties:", fetchError);
        setError("Unable to load your owned properties right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnedProperties();
  }, [user?.id]);

  return (
    <div className="page-shell">
      <DashboardNavbar />

      <main className="section-shell px-4 pb-16 pt-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <span className="eyebrow">Owned Properties</span>
              <h1 className="headline-font page-heading text-4xl font-bold md:text-5xl">
                Review the homes you have already purchased.
              </h1>
              <p className="page-copy max-w-2xl text-base leading-7">
                Buyers can use this workspace to keep a clean record of everything they own without mixing purchased homes into the public marketplace flow.
              </p>
            </div>

            <div className="summary-card rounded-[1.75rem] p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Buyer Summary</p>
              <p className="page-heading mt-3 text-4xl font-bold">{properties.length}</p>
              <p className="page-copy mt-2 text-sm">Properties currently assigned to your account.</p>
            </div>
          </section>

          {loading && (
            <section className="status-neutral rounded-[2rem] px-6 py-12 text-center">
              Loading your owned properties...
            </section>
          )}

          {!loading && error && (
            <section className="status-error rounded-[2rem] px-6 py-12 text-center">
              {error}
            </section>
          )}

          {!loading && !error && properties.length === 0 && (
            <section className="status-neutral rounded-[2rem] px-6 py-12 text-center">
              You have not purchased any property yet.
            </section>
          )}

          {!loading && !error && properties.length > 0 && (
            <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id || property._id} property={property} user={user} />
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default OwnedProperties;
