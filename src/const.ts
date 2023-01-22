export const PageRoutes = {
  home: "/",
  dashboard: "/dashboard",
  login: "/login",
  register: "/register",
};

export const ServerRoutes = {
  login: "/api/user/login",
  logout: "/api/user/logout",
  register: "/api/user/register",
  unlock: "/api/user/unlock",
  whoami: "/api/user/whoami",
  file: "/api/file",
  folder: "/api/folder",
  batch: "/api/batch",
};

export const LocalStorageKeys = {
  viewingMode: "file-viewing-mode",
};

export const MaxUploadSize = 32 << 20; // 32MB
