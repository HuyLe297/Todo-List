import express from 'express';                    // SỬA: express (không phải experss)
import taskRoute from '../routes/tasksRoutes.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';             // THÊM DÒNG NÀY (cần cho __dirname trong ESM)

dotenv.config();

// Fix __dirname trong module ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5001;
const app = express();

// Middleware
app.use(express.json());                       // SỬA: express (không phải experss)

// CORS – sửa lỗi cú pháp dấu phẩy thừa
if (process.env.NODE_ENV !== 'production') {   // SỬA: process.env.NODE_ENV (xóa dấu phẩy)
    app.use(cors({ origin: "http://localhost:5173" }));
} else {
    app.use(cors()); // production thì cho phép tất cả (hoặc chỉ định domain Vercel sau)
}

// Routes
app.use("/api/tasks", taskRoute);

// Phục vụ frontend build (khi production)
if (process.env.NODE_ENV === 'production') {   // SỬA: process.env.NODE_ENV (xóa dấu phẩy)
    const frontendPath = path.join(__dirname, "../../frontend/dist");
    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

// Kết nối DB và khởi động server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server đang chạy trên cổng ${PORT}`);
    });
}).catch(err => {
    console.error("Lỗi kết nối DB:", err);
});