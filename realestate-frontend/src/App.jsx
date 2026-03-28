import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./modules/Home"));
const UserAuth = lazy(() => import("./modules/user/pages/UserAuth"));
const Dashboard = lazy(() => import("./modules/user/pages/Dashboard"));
const PropertyBrowse = lazy(() => import("./modules/property/pages/PropertyBrowse"));
const PropertyDetails = lazy(() => import("./modules/property/pages/PropertyDetails"));
const AddProperty = lazy(() => import("./modules/property/pages/AddProperty"));
const MyListings = lazy(() => import("./modules/property/pages/MyListings"));
const OwnedProperties = lazy(() => import("./modules/property/pages/OwnedProperties"));
const AdminDashboard = lazy(() => import("./modules/admin/pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./modules/admin/pages/AdminUsers"));
const AdminUserDetails = lazy(() => import("./modules/admin/pages/AdminUserDetails"));
const AdminProperties = lazy(() => import("./modules/admin/pages/AdminProperties"));
const AdminPropertyDetails = lazy(() => import("./modules/admin/pages/AdminPropertyDetails"));

const RouteFallback = () => (
  <div className="page-shell">
    <main className="section-shell px-4 py-10">
      <div className="status-neutral mx-auto max-w-3xl rounded-[1.75rem] px-6 py-10 text-center">
        Loading page...
      </div>
    </main>
  </div>
);

function App() {
  return (
    <div className="app-shell">
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/UserAuth" element={<UserAuth />} />
          <Route path="/userAuth" element={<UserAuth />} />
          <Route path="/properties" element={<PropertyBrowse />} />
          <Route path="/properties/:propertyId" element={<PropertyDetails />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/owned-properties" element={<OwnedProperties />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["ROLE_AGENT", "ROLE_ADMIN"]} />}>
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/my-listings" element={<MyListings />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:userId" element={<AdminUserDetails />} />
            <Route path="/admin/properties" element={<AdminProperties />} />
            <Route path="/admin/properties/:propertyId" element={<AdminPropertyDetails />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
