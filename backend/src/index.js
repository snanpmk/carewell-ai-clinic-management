require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Route imports
const patientRoutes = require("./routes/patients");
const consultationRoutes = require("./routes/consultations");
const chronicCaseRoutes = require("./routes/chronicCases");
const aiRoutes = require("./routes/ai");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet());

// Dynamic CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL?.replace(/\/$/, ""), // Remove trailing slash if present
  "http://localhost:3000",
  "http://localhost:5173", // Vite default
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const normalizedOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalizedOrigin) || process.env.NODE_ENV === "development") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(morgan("dev"));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/chronicCases", chronicCaseRoutes);
app.use("/api/ai", aiRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Carewell API is running." });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found." });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  const statusCode = err.status || 500;
  const message = err.message || "Internal server error.";

  res.status(statusCode).json({ 
    success: false, 
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Carewell API running on http://localhost:${PORT}`);
});
