import { Route, Routes } from "react-router-dom";
import UserAuth from "./modules/user/pages/UserAuth";
import Dashboard from "./modules/user/pages/Dashboard";
import PropertyBrowse from "./modules/property/pages/PropertyBrowse";
import PropertyDetails from "./modules/property/pages/PropertyDetails";
import Home from "./modules/Home";
import AddProperty from "./modules/property/pages/AddProperty";
import MyListings from "./modules/property/pages/MyListings";
import OwnedProperties from "./modules/property/pages/OwnedProperties";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="app-shell">
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
      </Routes>
    </div>
  );
}

export default App;
