import { BadgeDollarSign, CheckCircle2, Image as ImageIcon, MapPin, Pencil, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPropertyPrice, getPropertyLocation, resolveImageUrl } from "../../../utils/property";
import { isBuyer } from "../../../utils/auth";

const PropertyCard = ({
  property,
  user,
  onBuy,
  onEdit,
  onDelete,
  deleteLoading = false,
  actionLoading = false,
}) => {
  const navigate = useNavigate();
  const propertyId = property?.id || property?._id;
  const sold = property?.available === false || Boolean(property?.buyerId);
  const ownedByCurrentBuyer = user?.id && property?.buyerId === user.id;
  const isOwnListing = user?.id && property?.agentId === user.id;
  const canBuyProperty = isBuyer(user) && !sold && !isOwnListing && typeof onBuy === "function";
  const canManageListing = typeof onEdit === "function" && typeof onDelete === "function";
  const imageCount = Array.isArray(property?.imageUrls) ? property.imageUrls.filter(Boolean).length : 0;

  const handleOpenDetails = () => {
    if (!propertyId) {
      return;
    }

    navigate(`/properties/${propertyId}`);
  };

  const stopCardClick = (event) => {
    event.stopPropagation();
  };

  return (
    <article
      onClick={handleOpenDetails}
      className="market-card cursor-pointer transition hover:-translate-y-1 hover:border-emerald-400/20"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={resolveImageUrl(property?.imageUrls?.[0])}
          alt={property?.title || "Property"}
          className="h-full w-full object-cover"
        />
        <div className="image-overlay absolute inset-0" />
        <div className="chip-surface absolute left-4 top-4 rounded-full border border-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] shadow-lg shadow-black/20 backdrop-blur-md">
          {property?.type || "Property"}
        </div>
        {imageCount > 1 && (
          <div className="chip-dark absolute right-4 top-4 flex items-center gap-2 rounded-full border border-black/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] shadow-lg shadow-black/25 backdrop-blur-md">
            <ImageIcon className="h-3.5 w-3.5" />
            {imageCount} Photos
          </div>
        )}
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="page-heading text-xl font-semibold">{property?.title || "Untitled property"}</h2>
            <div className="page-copy flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-emerald-200" />
              <span>{getPropertyLocation(property)}</span>
            </div>
          </div>

          <div className="min-w-[128px] rounded-[1.25rem] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-right">
            <div className="flex items-center justify-end gap-2 text-xs uppercase tracking-[0.16em] text-emerald-100/80">
              <BadgeDollarSign className="h-4 w-4" />
              Price
            </div>
            <p className="page-heading mt-1 text-lg font-bold">{formatPropertyPrice(property?.price)}</p>
          </div>
        </div>

        <p className="page-copy line-clamp-3 text-sm leading-6">
          {property?.description || "No description available for this listing yet."}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
            {property?.type || "Unknown type"}
          </span>
          {property?.address && (
            <span className="inset-panel rounded-full px-3 py-1 text-xs font-medium page-copy">
              {property.address}
            </span>
          )}
          {ownedByCurrentBuyer && (
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
              Owned
            </span>
          )}
          {!ownedByCurrentBuyer && sold && (
            <span className="status-warning rounded-full px-3 py-1 text-xs font-medium">
              Sold
            </span>
          )}
        </div>

        <div onClick={stopCardClick} className="flex flex-col gap-3 sm:flex-row">
          {canBuyProperty && (
            <button
              type="button"
              onClick={() => onBuy(property)}
              disabled={actionLoading}
              className="primary-button w-full justify-center sm:flex-1"
            >
              <ShoppingCart className="h-4 w-4" />
              {actionLoading ? "Processing..." : "Buy Property"}
            </button>
          )}

          {isBuyer(user) && sold && !ownedByCurrentBuyer && (
            <div className="status-warning flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold sm:flex-1">
              <CheckCircle2 className="h-4 w-4" />
              Sold by agent
            </div>
          )}

          <button
            type="button"
            onClick={handleOpenDetails}
            className="secondary-button w-full justify-center sm:flex-1"
          >
            View Details
          </button>

          {canManageListing && (
            <>
              <button
                type="button"
                onClick={() => onEdit(property)}
                className="secondary-button w-full justify-center sm:flex-1"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(property)}
                disabled={deleteLoading}
                className="danger-button w-full px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
              >
                <span className="inline-flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  {deleteLoading ? "Deleting..." : "Delete"}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
