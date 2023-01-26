export const PAGE_ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  login: "/login",
  register: "/register",
};

export const SERVER_ROUTES = {
  login: "/api/user/login",
  logout: "/api/user/logout",
  register: "/api/user/register",
  unlock: "/api/user/unlock",
  whoami: "/api/user/whoami",
  file: "/api/file",
  folder: "/api/folder",
  batch: "/api/batch",
};

export const MAX_UPLOAD_SIZE = 32 << 20; // 32MB

export const GOOGLE_CAPTCHA_SITE_KEY =
  "6LeFmxwkAAAAABFpg9KhEt0xndxwYWlAdtsoq3Jo";

export const DEV_MODE = process.env.REACT_APP_DEV_MODE === "true";

// Local storage keys
export const LS_FILE_VIEW_MODE = "file-viewing-mode";
