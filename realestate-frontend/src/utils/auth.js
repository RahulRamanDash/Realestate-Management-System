export const normalizeRole = (role) => {
  if (role === "ROLE_USER") {
    return "ROLE_BUYER";
  }

  return role || "";
};

export const formatRoleLabel = (role) => {
  switch (normalizeRole(role)) {
    case "ROLE_BUYER":
      return "Buyer";
    case "ROLE_AGENT":
      return "Agent";
    case "ROLE_ADMIN":
      return "Admin";
    default:
      return "Visitor";
  }
};

export const getLoggedUser = () => {
  try {
    const rawUser = localStorage.getItem("loggedUser");
    if (!rawUser) {
      return null;
    }

    const user = JSON.parse(rawUser);
    return {
      ...user,
      role: normalizeRole(user?.role),
    };
  } catch {
    return null;
  }
};

export const isAgent = (user) => normalizeRole(user?.role) === "ROLE_AGENT";
export const isBuyer = (user) => normalizeRole(user?.role) === "ROLE_BUYER";
export const isAdmin = (user) => normalizeRole(user?.role) === "ROLE_ADMIN";
