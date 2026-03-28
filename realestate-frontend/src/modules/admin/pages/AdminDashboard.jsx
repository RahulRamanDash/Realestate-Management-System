import { useEffect, useState } from "react";
import { Building2, Shield, UserCheck, Users } from "lucide-react";
import DashboardNavbar from "../../../components/DashboardNavbar";
import { getAdminSummary } from "../services/adminService";
import { getPropertyErrorMessage } from "../../../shared/utils/errorMessages";
import StatCard from "../../../components/StatCard";
import { formatPropertyPrice } from "../../../utils/property";
import { formatRoleLabel } from "../../../utils/auth";
import Button from "../../../components/Button/Button";

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getAdminSummary();
        setSummary(response);
      } catch (loadError) {
        console.error("Failed to load admin summary:", loadError);
        setError(getPropertyErrorMessage(loadError, "fetch"));
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <div className="page-shell">
      <DashboardNavbar />

      <main className="section-shell px-4 pb-16 pt-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <span className="eyebrow">Admin Control Center</span>
              <h1 className="headline-font page-heading text-4xl font-bold md:text-5xl">
                Manage users, inventory, and marketplace health from one place.
              </h1>
              <p className="page-copy max-w-2xl text-base leading-7">
                This dashboard gives administrators a system-wide view of accounts, listings, and completed sales.
              </p>
            </div>

            <div className="summary-card rounded-[1.75rem] p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Platform Snapshot</p>
              <p className="page-heading mt-3 text-4xl font-bold">{summary?.totalProperties ?? 0}</p>
              <p className="page-copy mt-2 text-sm">Properties currently stored in the system.</p>
              <div className="inset-panel page-copy mt-4 flex items-center justify-between rounded-[1.25rem] px-4 py-3 text-sm">
                <span>Sold listings</span>
                <span className="page-heading font-semibold">{summary?.soldProperties ?? 0}</span>
              </div>
            </div>
          </section>

          {loading && <section className="status-neutral rounded-[2rem] px-6 py-12 text-center">Loading admin metrics...</section>}
          {!loading && error && <section className="status-error rounded-[2rem] px-6 py-12 text-center">{error}</section>}

          {!loading && !error && summary && (
            <>
              <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={<Users className="h-5 w-5" />} label="Total users" value={summary.totalUsers} />
                <StatCard icon={<UserCheck className="h-5 w-5" />} label="Agents" value={summary.totalAgents} />
                <StatCard icon={<Shield className="h-5 w-5" />} label="Admins" value={summary.totalAdmins} />
                <StatCard icon={<Building2 className="h-5 w-5" />} label="Available listings" value={summary.availableProperties} />
              </section>

              <section className="grid gap-8 xl:grid-cols-3">
                <div className="glass-panel rounded-[1.75rem] p-6 xl:col-span-1">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="headline-font page-heading text-xl font-semibold">Recent Users</h2>
                      <p className="page-copy text-sm">Latest accounts in the platform.</p>
                    </div>
                    <Button variant="secondary" onClick={() => (window.location.href = "/admin/users")}>View All</Button>
                  </div>
                  <div className="space-y-3">
                    {summary.recentUsers?.map((user) => (
                      <div key={user.id} className="inset-panel rounded-[1.25rem] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="page-heading font-semibold">{user.name}</p>
                            <p className="page-copy text-sm">{user.email}</p>
                          </div>
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
                            {formatRoleLabel(user.role)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel rounded-[1.75rem] p-6 xl:col-span-1">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="headline-font page-heading text-xl font-semibold">Recent Listings</h2>
                      <p className="page-copy text-sm">Newest properties added to the catalog.</p>
                    </div>
                    <Button variant="secondary" onClick={() => (window.location.href = "/admin/properties")}>View All</Button>
                  </div>
                  <div className="space-y-3">
                    {summary.recentProperties?.map((property) => (
                      <div key={property.id} className="inset-panel rounded-[1.25rem] p-4">
                        <p className="page-heading font-semibold">{property.title}</p>
                        <p className="page-copy text-sm">{property.city}, {property.state}</p>
                        <p className="page-copy mt-2 text-sm">{formatPropertyPrice(property.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel rounded-[1.75rem] p-6 xl:col-span-1">
                  <div className="mb-5">
                    <h2 className="headline-font page-heading text-xl font-semibold">Recent Sales</h2>
                    <p className="page-copy text-sm">Listings already assigned to buyers.</p>
                  </div>
                  <div className="space-y-3">
                    {summary.recentSales?.length > 0 ? summary.recentSales.map((property) => (
                      <div key={property.id} className="inset-panel rounded-[1.25rem] p-4">
                        <p className="page-heading font-semibold">{property.title}</p>
                        <p className="page-copy text-sm">Buyer: {property.buyerId || "N/A"}</p>
                        <p className="page-copy mt-2 text-sm">{formatPropertyPrice(property.price)}</p>
                      </div>
                    )) : (
                      <div className="status-neutral rounded-[1.25rem] px-4 py-5 text-sm text-center">No completed sales yet.</div>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
