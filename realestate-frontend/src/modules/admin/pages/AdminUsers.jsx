import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../../components/DashboardNavbar";
import Button from "../../../components/Button/Button";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { getAdminUsers, updateAdminUserRole } from "../services/adminService";
import { formatRoleLabel } from "../../../utils/auth";
import { getErrorMessage } from "../../../shared/utils/errorMessages";

const initialFilters = {
  search: "",
  role: "",
};

const AdminUsers = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [dialog, setDialog] = useState({ isOpen: false, user: null, role: "" });
  const [updating, setUpdating] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminUsers({
        search: filters.search || undefined,
        role: filters.role || undefined,
      });
      setUsers(response);
    } catch (loadError) {
      console.error("Failed to load users:", loadError);
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const openRoleDialog = (user, role) => {
    if (!role || role === user.role) {
      return;
    }
    setDialog({ isOpen: true, user, role });
  };

  const handleConfirmRoleChange = async () => {
    if (!dialog.user || !dialog.role) {
      return;
    }

    setUpdating(true);
    setMessage("");
    try {
      const updatedUser = await updateAdminUserRole(dialog.user.id, dialog.role);
      setUsers((current) =>
        current.map((user) => (
          user.id === updatedUser.id
            ? { ...user, role: updatedUser.role }
            : user
        ))
      );
      setMessage(`Role updated for ${updatedUser.name}.`);
      setDialog({ isOpen: false, user: null, role: "" });
    } catch (updateError) {
      setMessage(getErrorMessage(updateError));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="page-shell">
      <DashboardNavbar />

      <main className="section-shell px-4 pb-16 pt-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="space-y-4">
            <span className="eyebrow">Admin Users</span>
            <h1 className="headline-font page-heading text-4xl font-bold md:text-5xl">Manage accounts and access levels.</h1>
            <p className="page-copy max-w-2xl text-base leading-7">
              Review user roles across buyers, agents, and admins, then open individual records for deeper inspection.
            </p>
          </section>

          <section className="glass-panel rounded-[1.75rem] p-6">
            <div className="grid gap-3 md:grid-cols-[1.2fr_0.7fr_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name, email, or phone"
                  className="field-base py-3 pl-10 pr-4 text-sm"
                />
              </div>

              <select name="role" value={filters.role} onChange={handleFilterChange} className="field-base px-4 py-3 text-sm">
                <option value="">All roles</option>
                <option value="ROLE_ADMIN">Admin</option>
                <option value="ROLE_AGENT">Agent</option>
                <option value="ROLE_BUYER">Buyer</option>
              </select>

              <Button onClick={loadUsers}>Apply Filters</Button>
            </div>
          </section>

          {message && (
            <section className={`${message.includes("updated") ? "status-success" : "status-error"} rounded-[1.25rem] px-4 py-3 text-sm`}>
              {message}
            </section>
          )}

          {loading && <section className="status-neutral rounded-[2rem] px-6 py-12 text-center">Loading users...</section>}
          {!loading && error && <section className="status-error rounded-[2rem] px-6 py-12 text-center">{error}</section>}

          {!loading && !error && (
            <section className="glass-panel overflow-hidden rounded-[1.75rem]">
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Listings</th>
                      <th>Owned</th>
                      <th>Change Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div>
                            <p className="page-heading font-semibold">{user.name}</p>
                            <p className="page-copy text-sm">{user.email}</p>
                          </div>
                        </td>
                        <td>{formatRoleLabel(user.role)}</td>
                        <td>{user.listingCount}</td>
                        <td>{user.ownedPropertyCount}</td>
                        <td>
                          <select
                            defaultValue={user.role}
                            className="field-base min-w-[150px] px-3 py-2 text-sm"
                            onChange={(event) => openRoleDialog(user, event.target.value)}
                          >
                            <option value="ROLE_ADMIN">Admin</option>
                            <option value="ROLE_AGENT">Agent</option>
                            <option value="ROLE_BUYER">Buyer</option>
                          </select>
                        </td>
                        <td>
                          <Button variant="secondary" onClick={() => navigate(`/admin/users/${user.id}`)}>View</Button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center">No users matched the current filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </main>

      <ConfirmDialog
        isOpen={dialog.isOpen}
        title="Update User Role"
        message={`Change ${dialog.user?.name}'s role to ${formatRoleLabel(dialog.role)}?`}
        confirmText="Update Role"
        onConfirm={handleConfirmRoleChange}
        onCancel={() => setDialog({ isOpen: false, user: null, role: "" })}
        loading={updating}
      />
    </div>
  );
};

export default AdminUsers;
