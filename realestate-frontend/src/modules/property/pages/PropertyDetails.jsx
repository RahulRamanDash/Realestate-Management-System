import { useEffect, useState } from "react";
import { BadgeDollarSign, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axiosInstance";
import DashboardNavbar from "../../../components/DashboardNavbar";
import HomeNavbar from "../../../components/HomeNavbar";
import { getLoggedUser, isBuyer } from "../../../utils/auth";
import { formatPropertyPrice, getPropertyLocation, resolveImageUrl } from "../../../utils/property";

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const user = getLoggedUser();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [buying, setBuying] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setError("Property not found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/properties/${propertyId}`);
        setProperty(response.data);
      } catch (fetchError) {
        console.error("Failed to load property details:", fetchError);
        setError("Unable to load this property right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [propertyId]);

  const imageUrls = Array.isArray(property?.imageUrls) && property.imageUrls.length > 0
    ? property.imageUrls
    : [null];
  const sold = property?.available === false || Boolean(property?.buyerId);
  const ownedByCurrentBuyer = user?.id && property?.buyerId === user.id;
  const isOwnListing = user?.id && property?.agentId === user.id;
  const canBuyProperty = isBuyer(user) && !sold && !isOwnListing;

  const handleBuy = async () => {
    if (!propertyId) {
      return;
    }

    if (!user) {
      navigate("/userAuth");
      return;
    }

    if (!canBuyProperty) {
      return;
    }

    const confirmed = window.confirm(`Buy "${property?.title}" for ${formatPropertyPrice(property?.price)}?`);
    if (!confirmed) {
      return;
    }

    setBuying(true);
    setActionMessage("");

    try {
      const response = await api.patch(`/properties/${propertyId}/purchase/${user.id}`);
      setProperty(response.data);
      setActionMessage("Property purchased successfully. It is now visible in your owned properties.");
    } catch (purchaseError) {
      console.error("Failed to purchase property:", purchaseError);
      setActionMessage("Unable to complete this purchase right now.");
    } finally {
      setBuying(false);
    }
  };

  const showPreviousImage = () => {
    setActiveImageIndex((current) => (current === 0 ? imageUrls.length - 1 : current - 1));
  };

  const showNextImage = () => {
    setActiveImageIndex((current) => (current === imageUrls.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="page-shell">
      {user ? <DashboardNavbar /> : <HomeNavbar />}

      <main className="section-shell px-4 pb-16 pt-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <Link to="/properties" className="page-copy inline-flex items-center gap-2 text-sm font-semibold transition hover:text-white">
            <ChevronLeft className="h-4 w-4" />
            Back to listings
          </Link>

          {loading && (
            <section className="status-neutral rounded-[2rem] px-6 py-12 text-center">
              Loading property details...
            </section>
          )}

          {!loading && error && (
            <section className="status-error rounded-[2rem] px-6 py-12 text-center">
              {error}
            </section>
          )}

          {!loading && !error && property && (
            <>
              <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-4">
                  <div className="market-card relative overflow-hidden rounded-[2rem]">
                    <img
                      src={resolveImageUrl(imageUrls[activeImageIndex])}
                      alt={property?.title || "Property"}
                      className="h-[420px] w-full object-cover"
                    />
                    <div className="image-overlay absolute inset-0" />
                    {imageUrls.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={showPreviousImage}
                          className="nav-icon-button absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={showNextImage}
                          className="nav-icon-button absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-4">
                    {imageUrls.map((imageUrl, index) => (
                      <button
                        key={`${propertyId}-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`overflow-hidden rounded-[1.25rem] border ${
                          activeImageIndex === index ? "border-emerald-300" : "soft-border"
                        }`}
                      >
                        <img
                          src={resolveImageUrl(imageUrl)}
                          alt={`${property?.title || "Property"} ${index + 1}`}
                          className="h-24 w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <section className="glass-panel rounded-[2rem] p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
                        {property?.type || "Property"}
                      </span>
                      {ownedByCurrentBuyer && (
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
                          Owned
                        </span>
                      )}
                      {!ownedByCurrentBuyer && sold && (
                        <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-100">
                          Sold
                        </span>
                      )}
                    </div>

                    <h1 className="headline-font page-heading mt-5 text-4xl font-bold">
                      {property?.title || "Untitled property"}
                    </h1>

                    <div className="page-copy mt-4 flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-emerald-200" />
                      <span>{getPropertyLocation(property)}</span>
                    </div>

                    <div className="mt-6 rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-emerald-100/80">
                        <BadgeDollarSign className="h-4 w-4" />
                        Price
                      </div>
                      <p className="page-heading mt-2 text-3xl font-bold">{formatPropertyPrice(property?.price)}</p>
                    </div>

                    <p className="page-copy mt-6 text-sm leading-7">
                      {property?.description || "No description available for this listing yet."}
                    </p>

                    {actionMessage && (
                      <div
                        className={`mt-6 rounded-[1.25rem] px-4 py-3 text-sm ${
                          actionMessage.includes("successfully") ? "status-success" : "status-error"
                        }`}
                      >
                        {actionMessage}
                      </div>
                    )}

                    {canBuyProperty && (
                      <button type="button" onClick={handleBuy} disabled={buying} className="primary-button mt-6 w-full justify-center">
                        {buying ? "Processing..." : "Buy Property"}
                      </button>
                    )}
                  </section>

                  <section className="glass-panel rounded-[2rem] p-6">
                    <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Property Snapshot</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="info-card rounded-[1.25rem] p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Address</p>
                        <p className="page-heading mt-2 text-sm">{property?.address || "Not provided"}</p>
                      </div>
                      <div className="info-card rounded-[1.25rem] p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">City</p>
                        <p className="page-heading mt-2 text-sm">{property?.city || "Not provided"}</p>
                      </div>
                      <div className="info-card rounded-[1.25rem] p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">State</p>
                        <p className="page-heading mt-2 text-sm">{property?.state || "Not provided"}</p>
                      </div>
                      <div className="info-card rounded-[1.25rem] p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Photos</p>
                        <p className="page-heading mt-2 text-sm">{imageUrls.length}</p>
                      </div>
                    </div>
                  </section>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;
