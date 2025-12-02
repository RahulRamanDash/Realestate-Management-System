import React, { useState } from "react";
import api from "../../../api/axiosInstance";
import DashboardNavbar from "../../../components/DashboardNavbar";
import HomeNavbar from "../../../components/HomeNavbar";

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    price: "",
    type: "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (!user) {
        setMessage("❌ Please login first.");
        setLoading(false);
        return;
      }

      const propertyData = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        price: formData.price,
        type: formData.type,
        agentId: user.id,
      };

      const data = new FormData();
      data.append("property", new Blob([JSON.stringify(propertyData)], { type: "application/json" }));
      formData.images.forEach((img) => data.append("images", img));

      const res = await api.post("/properties/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Property added:", res.data);
      setMessage("✅ Property added successfully!");
      setLoading(false);

      // Reset form
      setFormData({
        title: "",
        description: "",
        address: "",
        city: "",
        state: "",
        price: "",
        type: "",
        images: [],
      });
      setPreviewImages([]);
    } catch (err) {
      console.error("Error adding property:", err);
      setMessage("❌ Failed to add property. Try again.");
      setLoading(false);
    }
  };

  return (
    // root wrapper full height + column so navbar + main area fill viewport
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Navbar */}
      {user ? <DashboardNavbar role={user?.role?.toLowerCase?.() || "agent"} /> : <HomeNavbar />}

      {/* Main content expands to fill remaining space so no white gap */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700
                        overflow-auto max-h-[calc(100vh-120px)]"> 
          {/* max-h ensures card won't overflow viewport; adjust 120px if navbar height differs */}
          <h2 className="text-2xl font-bold mb-6 text-center text-emerald-500">
            Add New Property
          </h2>

          {message && (
            <p
              className={`text-center mb-4 ${message.includes("✅") ? "text-emerald-400" : "text-red-400"}`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-emerald-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-emerald-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-emerald-400"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-emerald-400"
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price (₹)"
                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-emerald-400"
                required
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-emerald-400"
                required
              >
                <option value="">Select Type</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="House">House</option>
                <option value="Plot">Plot</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-gray-300 cursor-pointer focus:outline-none"
              />
              {previewImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {previewImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Preview"
                      className="w-20 h-20 rounded-md object-cover border border-gray-700"
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold transition duration-300 ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {loading ? "Uploading..." : "Add Property"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddProperty;