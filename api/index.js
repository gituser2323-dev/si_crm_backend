const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

// ✅ CORS FIRST
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://si-crm-ebon.vercel.app",
  "https://www.speedupinfotech.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ same options

// ✅ Body parsers
app.use(express.static("public/"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ DB connection
const connection = require("../config/db");
connection();

// ✅ Routes
const userRoutes = require("../routes/userRoutes");
const authRoutes = require("../routes/authRoutes");

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Server Is up...",
    success: true,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

module.exports = app;
