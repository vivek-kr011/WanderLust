const defaultOrigins = [
  "http://localhost:5173",
  "https://wander-lust-two-silk.vercel.app",
];

const allowedOrigins = [
  ...defaultOrigins,
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
].filter((origin, index, origins) => origins.indexOf(origin) === index);

module.exports = { allowedOrigins };
 