import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ImagePlus, MapPinHouse, ReceiptText, Trash2, UploadCloud } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../api/axiosInstance";
import DashboardNavbar from "../../../components/DashboardNavbar";
import { getLoggedUser } from "../../../utils/auth";
import { resolveImageUrl } from "../../../utils/property";

const emptyForm = {
  title: "",
  description: "",
  address: "",
  city: "",
  state: "",
  price: "",
  type: "",
  images: [],
};

const AddProperty = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const propertyId = searchParams.get("propertyId");
  const user = getLoggedUser();

  const [formData, setFormData] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(Boolean(propertyId));
  const [propertyMeta, setPropertyMeta] = useState({
    available: true,
    buyerId: null,
  });

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setInitialLoading(false);
        return;
      }

      try {
        const response = await api.get(`/properties/${propertyId}`);
        const property = response.data;

        setFormData({
          title: property.title || "",
          description: property.description || "",
          address: property.address || "",
          city: property.city || "",
          state: property.state || "",
          price: property.price || "",
          type: property.type || "",
          images: [],
        });
        setPropertyMeta({
          available: property.available !== false && !property.buyerId,
          buyerId: property.buyerId || null,
        });
        setExistingImages(Array.isArray(property.imageUrls) ? property.imageUrls : []);
        setNewImagePreviews([]);
      } catch (error) {
        console.error("Failed to load property:", error);
        setMessage("Unable to load this property for editing.");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    setFormData((current) => ({
      ...current,
      images: [...current.images, ...files],
    }));
    setNewImagePreviews((current) => [...current, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setExistingImages([]);
    setNewImagePreviews([]);
  };

  const removeExistingImage = (imageUrl) => {
    setExistingImages((current) => current.filter((image) => image !== imageUrl));
  };

  const removeNewImage = (indexToRemove) => {
    setFormData((current) => ({
      ...current,
      images: current.images.filter((_, index) => index !== indexToRemove),
    }));
    setNewImagePreviews((current) => current.filter((_, index) => index !== indexToRemove));
  };

  const handleAvailabilityChange = (event) => {
    const nextAvailability = event.target.value === "available";
    setPropertyMeta((current) => ({
      ...current,
      available: nextAvailability,
    }));
  };

  const sold = !propertyMeta.available || Boolean(propertyMeta.buyerId);
  const totalImageCount = existingImages.length + newImagePreviews.length;
  const canSubmit = useMemo(() => formData.title && formData.description && formData.price && formData.type, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        price: formData.price,
        type: formData.type,
        imageUrls: existingImages,
        agentId: user.id,
        available: propertyId ? propertyMeta.available : true,
        buyerId: propertyId ? (propertyMeta.available ? null : propertyMeta.buyerId) : null,
      };

      const payload = new FormData();
      payload.append("property", new Blob([JSON.stringify(propertyData)], { type: "application/json" }));
      formData.images.forEach((image) => payload.append("images", image));

      if (propertyId) {
        await api.put(`/properties/${propertyId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Property updated successfully.");
      } else {
        await api.post("/properties/add", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Property added successfully.");
        resetForm();
      }

      navigate("/my-listings");
    } catch (error) {
      console.error("Error saving property:", error);
      setMessage("Failed to save property. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <DashboardNavbar />

      <main className="section-shell flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <Link to="/my-listings" className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Link>
        </div>

        <div className="mx-auto mt-6 grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="glass-panel rounded-[2rem] p-8">
            <span className="eyebrow">{propertyId ? "Listing Editor" : "Listing Studio"}</span>
            <h1 className="headline-font page-heading mt-6 text-4xl font-bold">
              {propertyId ? "Update your property details with the same publishing workflow." : "Publish a property with a cleaner, more credible presentation."}
            </h1>
            <p className="page-copy mt-4 text-base leading-7">
              Agents can create new listings or revise existing ones without leaving the same form flow.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: <ReceiptText className="h-5 w-5" />, title: "Structured details", text: "Keep title, description, price, and type consistent across every listing." },
                { icon: <MapPinHouse className="h-5 w-5" />, title: "Location clarity", text: "City and state stay visible in the public and agent-only listing grids." },
                { icon: <ImagePlus className="h-5 w-5" />, title: "Image previews", text: "Uploaded images render immediately so agents can catch mistakes before publishing." },
              ].map((item) => (
                <div key={item.title} className="info-card rounded-[1.5rem] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                    {item.icon}
                  </div>
                  <h3 className="page-heading mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="page-copy mt-2 text-sm leading-6">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel-strong rounded-[2rem] p-8">
            <h2 className="headline-font page-heading text-3xl font-bold">
              {propertyId ? "Edit Property" : "Add New Property"}
            </h2>
            <p className="page-copy mt-2 text-sm">
              {propertyId ? "Update this listing and return to your agent workspace." : "Create a listing that is ready to appear in the marketplace."}
            </p>

            {initialLoading ? (
              <div className="status-neutral mt-6 rounded-[1.5rem] px-4 py-10 text-center">
                Loading property details...
              </div>
            ) : (
              <>
                {message && (
                  <p
                    className={`mt-5 rounded-2xl px-4 py-3 text-center text-sm ${
                      message.includes("successfully") ? "status-success" : "status-error"
                    }`}
                  >
                    {message}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label className="page-copy mb-2 block text-sm">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="field-base px-4 py-3" required />
                  </div>

                  <div>
                    <label className="page-copy mb-2 block text-sm">Description</label>
                    <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="field-base px-4 py-3" required />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="field-base px-4 py-3" />
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="field-base px-4 py-3" />
                    <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="field-base px-4 py-3" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price ($)" className="field-base px-4 py-3" required />
                    <select name="type" value={formData.type} onChange={handleChange} className="field-base px-4 py-3" required>
                      <option value="">Select Type</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="House">House</option>
                      <option value="Plot">Plot</option>
                    </select>
                  </div>

                  {propertyId && (
                    <div>
                      <label className="page-copy mb-2 block text-sm">Property Status</label>
                      <select value={propertyMeta.available ? "available" : "sold"} onChange={handleAvailabilityChange} className="field-base px-4 py-3">
                        <option value="available">Available</option>
                        {sold && <option value="sold">Sold</option>}
                      </select>
                      {sold && propertyMeta.available && (
                        <p className="page-copy mt-2 text-xs">This property will be marked unsold and removed from the buyer account when you save.</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="page-copy mb-2 block text-sm">
                      {propertyId ? "Manage Images" : "Upload Images"}
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="field-base cursor-pointer p-4 page-copy file:mr-4 file:rounded-full file:border-0 file:bg-emerald-400/15 file:px-4 file:py-2 file:font-semibold file:text-emerald-100"
                    />

                    {totalImageCount > 0 && (
                      <div className="inset-panel mt-4 rounded-[1.5rem] p-4">
                        <div className="page-copy mb-3 flex items-center gap-2 text-sm">
                          <UploadCloud className="h-4 w-4 text-emerald-200" />
                          <span>{totalImageCount} image(s) ready</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {existingImages.map((image, index) => (
                            <div key={`${image}-${index}`} className="relative">
                              <img src={resolveImageUrl(image)} alt="Preview" className="h-24 w-24 rounded-2xl border soft-border object-cover" />
                              <button
                                type="button"
                                onClick={() => removeExistingImage(image)}
                                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-red-400/20 bg-red-500/90 text-red-50 shadow-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          {newImagePreviews.map((image, index) => (
                            <div key={`${image}-${index}`} className="relative">
                              <img src={image} alt="Preview" className="h-24 w-24 rounded-2xl border soft-border object-cover" />
                              <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-red-400/20 bg-red-500/90 text-red-50 shadow-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !canSubmit}
                    className={`w-full rounded-full py-3 font-semibold transition duration-300 ${
                      loading || !canSubmit
                        ? "cursor-not-allowed bg-slate-600 text-slate-300"
                        : "bg-gradient-to-r from-emerald-300 to-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                    }`}
                  >
                    {loading ? "Saving..." : propertyId ? "Update Property" : "Add Property"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProperty;
