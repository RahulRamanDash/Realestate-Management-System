import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import DashboardNavbar from "../../../components/DashboardNavbar";
import { getAdminUserById, getAdminUsers } from "../services/adminService";
import { formatRoleLabel } from "../../../utils/auth";
import { getErrorMessage } from "../../../shared/utils/errorMessages";

const AdminUserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) {
        setError("User not found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const [userResponse, userList] = await Promise.all([
          getAdminUserById(userId),
          getAdminUsers(),
        ]);
        setUser(userResponse);
        setSummary(userList.find((item) => item.id === userId) || null);
      } catch (loadError) {
        console.error("Failed to load user details:", loadError);
        setError(getErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  return (
    <div className="page-shell">
      <DashboardNavbar />

      <main className="section-shell px-4 pb-16 pt-10">
        <div className="mx-auto max-w-5xl space-y-8">
          <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to users
          </Link>

          {loading && <section className="status-neutral rounded-[2rem] px-6 py-12 text-center">Loading user details...</section>}
          {!loading && error && <section className="status-error rounded-[2rem] px-6 py-12 text-center">{error}</section>}

          {!loading && !error && user && (
            <section className="grid gap-6 md:grid-cols-2">
              <div className="glass-panel rounded-[1.75rem] p-6">
                <span className="eyebrow">Profile</span>
                <h1 className="headline-font page-heading mt-5 text-3xl font-bold">{user.name}</h1>
                <div className="mt-6 space-y-4">
                  <div className="inset-panel rounded-[1.25rem] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Email</p>
                    <p className="page-heading mt-2 text-sm">{user.email}</p>
                  </div>
                  <div className="inset-panel rounded-[1.25rem] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Phone</p>
                    <p className="page-heading mt-2 text-sm">{user.phone || "Not provided"}</p>
                  </div>
                  <div className="inset-panel rounded-[1.25rem] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Role</p>
                    <p className="page-heading mt-2 text-sm">{formatRoleLabel(user.role)}</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-[1.75rem] p-6">
                <span className="eyebrow">Activity Summary</span>
                <div className="mt-6 grid gap-4">
                  <div className="summary-card rounded-[1.25rem] p-5">
                    <p className="text-sm uppercase tracking-[0.18em] text-emerald-200">Listings owned</p>
                    <p className="page-heading mt-2 text-3xl font-bold">{summary?.listingCount ?? 0}</p>
                  </div>
                  <div className="summary-card rounded-[1.25rem] p-5">
                    <p className="text-sm uppercase tracking-[0.18em] text-emerald-200">Properties purchased</p>
                    <p className="page-heading mt-2 text-3xl font-bold">{summary?.ownedPropertyCount ?? 0}</p>
                  </div>
                  <div className="inset-panel rounded-[1.25rem] p-5">
                    <p className="page-copy text-sm">
                      This view is sourced from the admin API and is intended as a user-inspection page before broader moderation tools are added.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUserDetails;
