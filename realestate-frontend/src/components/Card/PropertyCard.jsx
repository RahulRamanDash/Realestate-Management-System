import { useEffect, useState } from 'react';
import { Heart, MapPin, Bed, Bath, Ruler } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import Badge from '../Card/Badge';
import { formatPrice, getPropertyId, cn } from '../../shared/utils/helpers';
import { BADGE_VARIANTS, BUTTON_VARIANTS } from '../../shared/utils/constants';
import { getPropertyLocation, resolveImageUrl } from '../../utils/property';
import { isBuyer } from '../../utils/auth';

/**
 * Modern PropertyCard Component
 * Displays property with image, details, badges, and actions
 */
const PropertyCard = ({
  property,
  user,
  onBuy,
  onEdit,
  onDelete,
  actionLoading = false,
  deleteLoading = false,
  isOwned = false,
}) => {
  const navigate = useNavigate();
  
  // Get first image from imageUrls array or single imageUrl
  const firstImage = Array.isArray(property?.imageUrls) && property.imageUrls.length > 0
    ? property.imageUrls[0]
    : property?.imageUrl || property?.image;
  
  const [imageSrc, setImageSrc] = useState(resolveImageUrl(firstImage));
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const propertyId = getPropertyId(property);
  const isSold =
    property?.available === false ||
    Boolean(property?.buyerId) ||
    property?.availability === 'sold' ||
    property?.status === 'sold';
  const isOwnedByCurrentBuyer = Boolean(user?.id) && property?.buyerId === user.id;
  const isManagedListing = Boolean(onEdit || onDelete);
  const isAgentListing = Boolean(user?.id) && property?.agentId === user.id;
  const showOwnedState = isOwned || isOwnedByCurrentBuyer;
  const canPurchase = Boolean(
    onBuy &&
    user &&
    isBuyer(user) &&
    !isSold &&
    !showOwnedState &&
    !isManagedListing &&
    !isAgentListing
  );

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setImageSrc('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23334155%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23cbd5e1%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3ENo Image Available%3C/text%3E%3C/svg%3E');
    setIsImageLoading(false);
  };

  const handleViewDetails = () => {
    navigate(`/properties/${propertyId}`);
  };

  useEffect(() => {
    setImageSrc(resolveImageUrl(firstImage));
    setIsImageLoading(true);
  }, [firstImage, propertyId]);

  return (
    <div
      onClick={handleViewDetails}
      className={cn(
        'group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white/8 hover:border-emerald-400/30 flex flex-col h-full cursor-pointer'
      )}
    >
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-white/10 to-white/5">
        {/* Sold Overlay */}
        {isSold && !showOwnedState && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">SOLD</p>
            </div>
          </div>
        )}

        {/* Image */}
        {isImageLoading && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/10 to-white/5" />
        )}
        <img
          src={imageSrc}
          alt={property?.title || 'Property'}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={cn(
            'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
            isImageLoading && 'opacity-0'
          )}
          style={{
            imageRendering: 'crisp-edges',
            WebkitFontSmoothing: 'antialiased'
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
          {property?.type && (
            <div className="relative">
              <div className="absolute inset-0 bg-black/40 rounded-full blur-sm dark:bg-black/40" />
              <Badge variant={BADGE_VARIANTS.INFO} size="sm" className="relative bg-white/90 text-gray-800 dark:bg-black/50 dark:text-white">
                {property.type}
              </Badge>
            </div>
          )}
          {showOwnedState && (
            <div className="relative">
              <div className="absolute inset-0 bg-black/40 rounded-full blur-sm dark:bg-black/40" />
              <Badge variant={BADGE_VARIANTS.SUCCESS} size="sm" className="relative bg-white/90 text-gray-800 dark:bg-black/50 dark:text-white">
                Owned
              </Badge>
            </div>
          )}
          {!showOwnedState && !isSold && property?.availability && (
            <div className="relative">
              <div className="absolute inset-0 bg-black/40 rounded-full blur-sm dark:bg-black/40" />
              <Badge variant={BADGE_VARIANTS.SUCCESS} size="sm" className="relative bg-white/90 text-gray-800 dark:bg-black/50 dark:text-white">
                {property.availability === 'available' ? 'Available' : 'Sold'}
              </Badge>
            </div>
          )}
          {!showOwnedState && isSold && (
            <div className="relative">
              <div className="absolute inset-0 bg-black/40 rounded-full blur-sm dark:bg-black/40" />
              <Badge variant={BADGE_VARIANTS.WARNING} size="sm" className="relative bg-white/90 text-gray-800 dark:bg-black/50 dark:text-white">
                Sold
              </Badge>
            </div>
          )}
        </div>

        {/* Favorite Button */}
        {isBuyer(user) && !showOwnedState && !isManagedListing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 text-gray-800 transition-all hover:bg-white hover:scale-110 dark:bg-black/40 dark:text-white dark:hover:bg-black/60"
          >
            <Heart
              className="h-5 w-5"
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        )}

        {/* Details Badge */}
        {property?.bedrooms && (
          <div className="absolute bottom-3 left-3 z-10 flex gap-3">
            {property.bedrooms && (
              <div className="flex items-center gap-1 rounded-lg bg-black/40 px-2 py-1 text-xs text-white">
                <Bed className="h-3 w-3" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property?.bathrooms && (
              <div className="flex items-center gap-1 rounded-lg bg-black/40 px-2 py-1 text-xs text-white">
                <Bath className="h-3 w-3" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property?.area && (
              <div className="flex items-center gap-1 rounded-lg bg-black/40 px-2 py-1 text-xs text-white">
                <Ruler className="h-3 w-3" />
                <span>{property.area} sqft</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col p-4">
        {/* Title and Price */}
        <div className="mb-3 flex-grow">
          <h3 className="page-heading line-clamp-2 text-base font-semibold transition-colors group-hover:text-emerald-300">
            {property?.title}
          </h3>
          <p className="page-copy mt-1 text-lg font-bold text-emerald-400">
            {formatPrice(property?.price)}
          </p>
        </div>

        {/* Location */}
        {(property?.location || property?.city || property?.state) && (
          <div className="mb-3 flex items-start gap-2">
            <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="page-copy truncate text-xs">{property.location || getPropertyLocation(property)}</p>
          </div>
        )}

        {/* City and Type */}
        {(property?.city || property?.description) && (
          <p className="page-copy mb-4 line-clamp-2 text-xs leading-5">
            {property.description || property.city}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
          {isManagedListing ? (
            <>
              {onEdit && (
                <Button
                  variant={BUTTON_VARIANTS.SECONDARY}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(property);
                  }}
                  className="w-full"
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant={BUTTON_VARIANTS.DANGER}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(property);
                  }}
                  loading={deleteLoading}
                  disabled={deleteLoading}
                  className="w-full"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </Button>
              )}
            </>
          ) : (
            <>
              {canPurchase && (
                <Button
                  variant={BUTTON_VARIANTS.SECONDARY}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBuy(property);
                  }}
                  loading={actionLoading}
                  disabled={actionLoading}
                  className="w-full"
                >
                  {actionLoading ? 'Processing...' : 'Purchase'}
                </Button>
              )}
              {showOwnedState && (
                <div className="w-full py-2 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <p className="text-xs font-medium text-emerald-300">Owned</p>
                </div>
              )}
              {!showOwnedState && isSold && (
                <div className="w-full py-2 px-3 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                  <p className="text-xs font-medium text-red-400">Property Sold</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
