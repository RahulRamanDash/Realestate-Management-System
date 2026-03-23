import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import DashboardNavbar from "../../../components/DashboardNavbar";
import HomeNavbar from "../../../components/HomeNavbar";
import PropertyCard from "../components/PropertyCard";
import { getLoggedUser, isBuyer } from "../../../utils/auth";

const initialFilters = {
  city: "",
  type: "",
  availability: "",
  minPrice: "",
  maxPrice: "",
};

const hasActiveFilters = (filters) =>
  Object.values(filters).some((value) => String(value || "").trim() !== "");

const PropertyBrowse = () => {
  const navigate = useNavigate();
  const user = getLoggedUser();
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [page, setPage] = useState(0);
  const [pageMeta, setPageMeta] = useState({
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
    size: 9,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [buyingId, setBuyingId] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {
          page,
          size: pageMeta.size,
        };

        if (appliedFilters.city) params.city = appliedFilters.city;
        if (appliedFilters.type) params.type = appliedFilters.type;
        if (appliedFilters.availability) params.availability = appliedFilters.availability;
        if (appliedFilters.minPrice) params.minPrice = appliedFilters.minPrice;
        if (appliedFilters.maxPrice) params.maxPrice = appliedFilters.maxPrice;

        const response = await api.get("/properties/search", { params });
        const data = response.data || {};
        setProperties(Array.isArray(data.content) ? data.content : []);
        setPageMeta({
          totalElements: data.totalElements || 0,
          totalPages: data.totalPages || 0,
          hasNext: Boolean(data.hasNext),
          hasPrevious: Boolean(data.hasPrevious),
          size: data.size || 9,
        });
      } catch (fetchError) {
        console.error("Failed to load properties:", fetchError);
        setError("Unable to load properties right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [appliedFilters, page, pageMeta.size]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPage(0);
  };

  const canSearch = hasActiveFilters(filters);
  const showResultsCount = hasActiveFilters(appliedFilters);

  const applyFilters = () => {
    if (!canSearch) {
      return;
    }

    setAppliedFilters(filters);
    setPage(0);
  };

  const handleBuy = async (property) => {
    const propertyId = property?.id || property?._id;

    if (!user) {
      navigate("/userAuth");
      return;
    }

    if (!isBuyer(user) || !propertyId) {
      return;
    }

    const confirmed = window.confirm(`Buy "${property.title}" for ${property.price ? `$${Number(property.price).toLocaleString()}` : "the listed price"}?`);
    if (!confirmed) {
      return;
    }

    setBuyingId(propertyId);
    setActionMessage("");

    try {
      const response = await api.patch(`/properties/${propertyId}/purchase/${user.id}`);
      const updatedProperty = response.data;
      setProperties((current) =>
        current.map((item) => ((item.id || item._id) === propertyId ? updatedProperty : item))
      );
      setActionMessage("Property purchased successfully. It is now visible in your owned properties.");
    } catch (purchaseError) {
      console.error("Failed to purchase property:", purchaseError);
      setActionMessage("Unable to complete this purchase right now.");
    } finally {
      setBuyingId("");
    }
  };

  return (
    <div className="page-shell">
      {user ? <DashboardNavbar /> : <HomeNavbar />}

      <main className="section-shell px-4 pb-16 pt-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="glass-panel rounded-[2rem] p-5 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <div>
                  <p className="page-heading text-sm font-semibold">Browse listings</p>
                  <p className="page-copy text-sm">Search and apply filters.</p>
                </div>
              </div>
              {showResultsCount && (
                <p className="page-copy pt-2 text-base font-semibold whitespace-nowrap">
                  {pageMeta.totalElements} records found
                </p>
              )}
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.35fr_0.85fr_0.85fr_0.85fr_0.85fr_auto_auto]">
              <div className="space-y-2">
                <label className="page-copy block text-xs font-semibold uppercase tracking-[0.16em]">City</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="city"
                    placeholder="Search by city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="field-base py-4 pl-11 pr-4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="page-copy block text-xs font-semibold uppercase tracking-[0.16em]">Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="field-base px-4 py-4"
                >
                  <option value="">All types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Plot">Plot</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="page-copy block text-xs font-semibold uppercase tracking-[0.16em]">Available</label>
                <select
                  name="availability"
                  value={filters.availability}
                  onChange={handleFilterChange}
                  className="field-base px-4 py-4"
                >
                  <option value="">All</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="page-copy block text-xs font-semibold uppercase tracking-[0.16em]">Min Price</label>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min price"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="field-base px-4 py-4"
                />
              </div>

              <div className="space-y-2">
                <label className="page-copy block text-xs font-semibold uppercase tracking-[0.16em]">Max Price</label>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max price"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="field-base px-4 py-4"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={applyFilters}
                  disabled={!canSearch}
                  className={`w-full whitespace-nowrap px-5 py-4 lg:w-auto ${
                    canSearch
                      ? "primary-button"
                      : "cursor-not-allowed rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-slate-400 opacity-70"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </span>
                </button>
              </div>

              <div className="flex items-end">
                <button type="button" onClick={clearFilters} className="secondary-button w-full whitespace-nowrap px-5 py-4 lg:w-auto">
                  Reset
                </button>
              </div>
            </div>
          </section>

          {actionMessage && (
            <section
              className={`rounded-[1.5rem] px-5 py-4 text-sm ${
                actionMessage.includes("successfully") ? "status-success" : "status-error"
              }`}
            >
              {actionMessage}
            </section>
          )}

          {loading && (
            <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="market-card">
                  <div className="h-56 animate-pulse inset-panel" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 animate-pulse rounded inset-panel" />
                    <div className="h-4 animate-pulse rounded inset-panel" />
                    <div className="h-20 animate-pulse rounded inset-panel" />
                  </div>
                </div>
              ))}
            </section>
          )}

          {!loading && error && (
            <section className="status-error rounded-[2rem] px-6 py-12 text-center">
              {error}
            </section>
          )}

          {!loading && !error && pageMeta.totalElements === 0 && (
            <section className="status-neutral rounded-[2rem] px-6 py-12 text-center">
              No properties matched the current filters.
            </section>
          )}

          {!loading && !error && properties.length > 0 && (
            <>
              <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id || property._id}
                    property={property}
                    user={user}
                    onBuy={handleBuy}
                    actionLoading={buyingId === (property.id || property._id)}
                  />
                ))}
              </section>

              {pageMeta.totalPages > 1 && (
                <section className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(current - 1, 0))}
                    disabled={!pageMeta.hasPrevious}
                    className="secondary-button disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <p className="page-copy text-sm font-semibold">
                    Page {page + 1} of {pageMeta.totalPages}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPage((current) => current + 1)}
                    disabled={!pageMeta.hasNext}
                    className="secondary-button disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PropertyBrowse;
