const defaultApiUrl = "https://wanderlust-c75i.onrender.com";

export const API_URL = (
  import.meta.env.VITE_API_URL || defaultApiUrl
).replace(/\/+$/, "").replace(/\/api$/, "");
