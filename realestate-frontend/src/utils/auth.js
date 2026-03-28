export const normalizeRole = (role) => {
  if (role === "ROLE_USER") {
    return "ROLE_BUYER";
  }

  return role || "";
};

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "loggedUser",
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
    const rawUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
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

export const getAccessToken = () => localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
export const getRefreshToken = () => localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);

export const setSession = (authResponse) => {
  if (!authResponse?.accessToken || !authResponse?.refreshToken) {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, authResponse.accessToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, authResponse.refreshToken);
  localStorage.setItem(
    AUTH_STORAGE_KEYS.USER,
    JSON.stringify({
      id: authResponse.userId,
      name: authResponse.name,
      email: authResponse.email,
      role: normalizeRole(authResponse.role),
    })
  );
};

export const clearSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
};

export const isAgent = (user) => normalizeRole(user?.role) === "ROLE_AGENT";
export const isBuyer = (user) => normalizeRole(user?.role) === "ROLE_BUYER";
export const isAdmin = (user) => normalizeRole(user?.role) === "ROLE_ADMIN";
