import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaHome, FaBed, FaBath, FaRuler } from 'react-icons/fa';
import HomeNavbar from '../../../components/HomeNavbar';
import DashboardNavbar from '../../../components/DashboardNavbar';
import api from '../../../api/axiosInstance';

const PropertyBrowse = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        city: '',
        type: '',
        minPrice: '',
        maxPrice: ''
    });

    const backendUrl = "http://localhost:8080";

    // Fetch properties
    // useEffect(() => {
    //     const fetchProperties = async () => {
    //         try {
    //             const response = await axios.get(`${backendUrl}/api/properties`);
    //             setProperties(response.data);
    //             console.log('Fetched properties:', response.data);
    //             setLoading(false);
    //         } catch (error) {
    //             console.error('Error fetching properties:', error);
    //             setLoading(false);
    //         }
    //     };
    //     fetchProperties();
    // }, []);
    useEffect(() => {
        api
        .get("/properties")
        .then((res) => {
            setProperties(res.data);
            setLoading(false);
        })
        .catch((err) => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Filter properties
    const filteredProperties = properties.filter(property => {
        return (
            (!filters.city || property.city.toLowerCase().includes(filters.city.toLowerCase())) &&
            (!filters.type || property.type === filters.type) &&
            (!filters.minPrice || property.price >= parseFloat(filters.minPrice)) &&
            (!filters.maxPrice || property.price <= parseFloat(filters.maxPrice))
        );
    });

    const user = JSON.parse(localStorage.getItem("loggedUser"));
    console.log("Logged user: ", user);

    return (
        <div className="min-h-screen bg-gray-900">

            {user ? <DashboardNavbar /> : <HomeNavbar />}
            
            {/* Search and Filter Section */}
            <div className="bg-gray-800 py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        {/* Search Bar */}
                        <div className="flex-1 min-w-[300px]">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Search by city..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={filters.city}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-4">
                            <select
                                name="type"
                                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={filters.type}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Types</option>
                                <option value="Apartment">Apartment</option>
                                <option value="House">House</option>
                                <option value="Villa">Villa</option>
                            </select>

                            <input
                                type="number"
                                name="minPrice"
                                placeholder="Min Price"
                                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                            />

                            <input
                                type="number"
                                name="maxPrice"
                                placeholder="Max Price"
                                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Properties Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="text-center text-white">Loading properties...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map((property, index) => (
                            <motion.div
                                key={property.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                {/* Property Image */}
                                <div className="relative h-48">
                                    {/* <img
                                        src={property.imageUrls[0]}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    /> */}
                                    <img
                                    src={property.imageUrls?.[0] ? `${backendUrl}${property.imageUrls[0]}` : `${backendUrl}/uploads/images/Hotel-Marigold.jpg`}
                                    alt={property.title}
                                    />

                                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-2 py-1 rounded">
                                        ${property.price.toLocaleString()}
                                    </div>
                                </div>

                                {/* Property Details */}
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-white mb-2">{property.title}</h3>
                                    <p className="text-gray-400 mb-4">{property.address}</p>

                                    {/* Property Features */}
                                    <div className="flex items-center gap-4 text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <FaBed />
                                            <span>3 Beds</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaBath />
                                            <span>2 Baths</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FaRuler />
                                            <span>1,200 sqft</span>
                                        </div>
                                    </div>

                                    {/* Contact Button */}
                                    <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded transition duration-300">
                                        Contact Agent
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* No Results Message */}
                {!loading && filteredProperties.length === 0 && (
                    <div className="text-center text-gray-400">
                        No properties found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyBrowse;