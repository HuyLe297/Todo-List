 import Task from '../models/Task.js'

 
 
 
 export const getAllTasks = async (req, res)=>{

    const {filter = 'today'} = req.query;
    const now = new Date();
    let startDate = null;
    switch(filter){
        case 'today':{
            startDate = new Date(now.getFullYear() , now.getMonth() , now.getDate());
            break;
        }
        case 'week' :{
            const modayDate = now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
            startDate = new Date(now.getFullYear() , now.getMonth() , modayDate);
            break
        }
        case 'month':{
            startDate = new Date(now.getFullYear(), now.getMonth() , 1 );
            break;
        }
        case 'all' : 
        default : {
            startDate = null;
        }
    }

const query = startDate ? {createdAt: {$gte: startDate}} : {};
 
    try {
        
        const result = await Task.aggregate([
            {$match : query},
            {
                $facet:{
                    tasks:[{$sort: {createdAt: -1}}],
                    activeCount : [{$match: {status: 'active'} }, {$count: 'count'}],
                    completeCount : [{$match: {status: 'complete'} }, {$count: 'count'}],
                },
            }
        ]);
        const tasks = result[0].tasks;
        const activeCount = result[0].activeCount[0] ?.count || 0;
        const completeCount = result[0].completeCount[0] ?.count || 0;
        res.status(200).json({tasks, activeCount, completeCount});
    } catch (error) {
        console.log("Loi khi goi getAllTasks", error)
        res.status(500).json({message: "Loi he thong"})
    }
    
}

export const createTasks = async (req,res)=>{
    try {
        const { title, status = 'active', completeAt } = req.body;
        const finalCompleteAt = status === 'complete' ? new Date(completeAt) : null;
        const task = new Task({title , status,completedAt: finalCompleteAt});
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error("Loi khi goi createTask" , error);
         res.status(500).json({message: "Loi he thong"})
    }
}
export const updateTasks = async (req,res)=>{
    try {
        const {title, status, completedAt} = req.body
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                status,
                completedAt,

            },
            {new:true}
        );
        if(!updatedTask){
            return res.status(404).json({message: "Nhiem vu khong ton tai"})
        }
        res.status(200).json(updatedTask);
    } catch (error) {
         console.error("Loi khi goi updateTask" , error);
         res.status(500).json({message: "Loi he thong"})
    }
}
export const deleteTasks = async (req,res)=>{
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if(!deletedTask){
            return res.status(404).json({message: "Nhiem vu khong ton tai"})
        }
        res.status(200).json(deletedTask)
    } catch (error) {
        console.error("Loi khi goi deleteTask" , error);
         res.status(500).json({message: "Loi he thong"})
    }
}