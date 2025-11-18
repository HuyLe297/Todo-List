import experss from 'express'
import taskRoute from '../routes/tasksRoutes.js'
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const PORT = process.env.PORT || 5001 

const app = experss();

// middlewares
app.use(cors({origin:"http://localhost:5173"}))
app.use(experss.json())


app.use("/api/tasks" , taskRoute)
connectDB().then(()=>{
app.listen(PORT,() =>{
    console.log(`serve bat dau tren cong ${PORT}`)
});
})



