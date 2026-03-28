import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import DashboardNavbar from "../../../components/DashboardNavbar";
import HomeNavbar from "../../../components/HomeNavbar";
import { Button, PropertyCard, EmptyState, PropertyCardSkeleton } from "../../../components/index";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { getLoggedUser, isBuyer } from "../../../utils/auth";
import { getPropertyErrorMessage } from "../../../shared/utils/errorMessages";

const initialFilters = {
  city: "",
  type: "",
  availability: "available",
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
    size: 12,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [buyingId, setBuyingId] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    property: null,
  });

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
          size: data.size || 12,
        });
      } catch (fetchError) {
        console.error("Failed to load properties:", fetchError);
        setError(getPropertyErrorMessage(fetchError, 'fetch'));
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

  const handleBuy = (property) => {
    const propertyId = property?.id || property?._id;

    if (!user) {
      navigate("/userAuth");
      return;
    }

    if (!isBuyer(user) || !propertyId) {
      return;
    }

    setConfirmDialog({ isOpen: true, property });
  };

  const handleConfirmPurchase = async () => {
    const property = confirmDialog.property;
    const propertyId = property?.id || property?._id;

    setBuyingId(propertyId);
    setActionMessage("");

    try {
      const response = await api.patch(`/properties/${propertyId}/purchase/${user.id}`);
      const updatedProperty = response.data;
      setProperties((current) =>
        current.map((item) => ((item.id || item._id) === propertyId ? updatedProperty : item))
      );
      setActionMessage("✓ Property purchased successfully! Check your owned properties.");
      setConfirmDialog({ isOpen: false, property: null });
    } catch (purchaseError) {
      console.error("Failed to purchase property:", purchaseError);
      const errorMsg = getPropertyErrorMessage(purchaseError, 'purchase');
      setActionMessage(`✗ ${errorMsg}`);
      setConfirmDialog({ isOpen: false, property: null });
    } finally {
      setBuyingId("");
    }
  };

  return (
    <div className="page-shell">
      {user ? <DashboardNavbar /> : <HomeNavbar />}

      <main className="section-shell px-4 pb-16 pt-6 md:pt-10">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Filters Section */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/15">
                  <SlidersHorizontal className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <h2 className="page-heading text-lg font-semibold">Find Properties</h2>
                  <p className="page-copy text-xs md:text-sm">Search and filter listings by location, type, and price.</p>
                </div>
              </div>
              {showResultsCount && (
                <p className="page-copy whitespace-nowrap text-sm font-semibold md:text-base">
                  {pageMeta.totalElements} found
                </p>
              )}
            </div>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.85fr_0.85fr_0.85fr_0.85fr_auto_auto]">
              {/* City Search */}
              <div className="space-y-1.5">
                <label className="page-copy block text-xs font-semibold uppercase tracking-wider">City</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="city"
                    placeholder="Search by city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="field-base py-3 pl-10 pr-4 text-sm"
                  />
                </div>
              </div>

              {/* Type Select */}
              <div className="space-y-1.5">
                <label className="page-copy block text-xs font-semibold uppercase tracking-wider">Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="field-base px-4 py-3 text-sm"
                >
                  <option value="">All types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Plot">Plot</option>
                </select>
              </div>

              {/* Availability Select */}
              <div className="space-y-1.5">
                <label className="page-copy block text-xs font-semibold uppercase tracking-wider">Status</label>
                <select
                  name="availability"
                  value={filters.availability}
                  onChange={handleFilterChange}
                  className="field-base px-4 py-3 text-sm"
                >
                  <option value="available">Available Only</option>
                </select>
              </div>

              {/* Min Price */}
              <div className="space-y-1.5">
                <label className="page-copy block text-xs font-semibold uppercase tracking-wider">Min Price</label>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="field-base px-4 py-3 text-sm"
                />
              </div>

              {/* Max Price */}
              <div className="space-y-1.5">
                <label className="page-copy block text-xs font-semibold uppercase tracking-wider">Max Price</label>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="999999"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="field-base px-4 py-3 text-sm"
                />
              </div>

              {/* Search Button */}
              <div className="flex items-end pt-6 sm:pt-0">
                <Button
                  onClick={applyFilters}
                  disabled={!canSearch}
                  className="w-full lg:w-auto"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </div>

              {/* Reset Button */}
              <div className="flex items-end pt-6 sm:pt-0">
                <Button variant="secondary" onClick={clearFilters} className="w-full lg:w-auto">
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Action Message */}
          {actionMessage && (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                actionMessage.includes("✓") ? "status-success" : "status-error"
              }`}
            >
              {actionMessage}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <PropertyCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <EmptyState
              title="Unable to load properties"
              description={error}
              action={
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              }
            />
          )}

          {/* Empty State */}
          {!loading && !error && pageMeta.totalElements === 0 && (
            <EmptyState
              title="No properties found"
              description={
                showResultsCount
                  ? "Try adjusting your filters to see more results."
                  : "Browse available properties to get started."
              }
            />
          )}

          {/* Properties Grid */}
          {!loading && !error && properties.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id || property._id}
                    property={property}
                    user={user}
                    onBuy={handleBuy}
                    actionLoading={buyingId === (property.id || property._id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pageMeta.totalPages > 1 && (
                <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
                  <Button
                    variant="secondary"
                    onClick={() => setPage((current) => Math.max(current - 1, 0))}
                    disabled={!pageMeta.hasPrevious}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="page-copy text-sm">
                      Page <strong>{page + 1}</strong> of <strong>{pageMeta.totalPages}</strong>
                    </span>
                  </div>

                  <Button
                    variant="secondary"
                    onClick={() => setPage((current) => current + 1)}
                    disabled={!pageMeta.hasNext}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Confirm Purchase"
        message={`Purchase "${confirmDialog.property?.title}" for ${confirmDialog.property?.price ? `$${Number(confirmDialog.property.price).toLocaleString()}` : "the listed price"}?`}
        confirmText="Purchase"
        cancelText="Cancel"
        onConfirm={handleConfirmPurchase}
        onCancel={() => setConfirmDialog({ isOpen: false, property: null })}
        loading={buyingId === (confirmDialog.property?.id || confirmDialog.property?._id)}
      />
    </div>
  );
};

export default PropertyBrowse;
