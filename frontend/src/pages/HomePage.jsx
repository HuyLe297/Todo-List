
import { Header } from '@/components/Header';
import AddTask from '@/components/AddTask';
import { StatsAndFilter } from '@/components/StatsAndFilter';
import TaskList from '@/components/TaskList';
import { TaskListPagination } from '@/components/TaskListPagination';
import { DateTimeFilter } from '@/components/DateTimeFilter';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { visibleTaskLimit } from '@/lib/data';


function HomePage() {
  const [taskBuffer, settaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [dateQuery, setDateQuery] = useState(null);
  const [page, setPage] = useState(1);



  useEffect(()=>{
    fetchTask();
  } , [dateQuery]);

  useEffect(() => {
    setPage(1)
  } , [filter,dateQuery]);
  // logic
  const fetchTask = async () =>{
    try {
      const res = await api.get(`/tasks/?filter=${dateQuery}`)
      settaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompleteTaskCount(res.data.completeCount);
    } catch (error) {
      console.error("Lỗi xảy ra khi truy xuất tasks:" , error);
      toast.error("Lỗi xảy ra khi truy xuất tasks");
    }
  };

  const handleTaskChange = () =>{
    fetchTask();
  };

  const handleNext = () => {
    if(page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if(page > 1 ) {
      setPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage) =>{
    setPage(newPage);
  };

  // biến lưu danh sách nv đã lọc
  const filteredTasks = taskBuffer.filter((task) =>{
    switch (filter) {
      case 'active':
        return task.status === 'active';
      case 'complete':
        return task.status === 'complete'
        
      default:
        return true;
    }
  })

  const visibleTask = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit

  );
  if(visibleTask.length === 0) {
    handlePrev();
  }

  const totalPages = Math.ceil(filteredTasks.length/visibleTaskLimit);



  return (

    <div className="min-h-screen w-full relative">
  {/* Radial Gradient Background from Top */}
  <div
    className="absolute inset-0 z-0"
    style={{
      background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #475569 100%)",
    }}
  />
  {/* Your Content/Components */}
   <div className='container pt-8 mx-auto relative z-10'>
     <div className='w-full max-w-2xl p-6 mx-auto space-y-6'>
      <Header/>

      <AddTask handleNewTaskAdded={handleTaskChange}/>

      <StatsAndFilter 
      filter={filter}
      setFilter ={setFilter}
      activeTasksCount={activeTaskCount}
      completedTasksCount={completeTaskCount}
      
      />

      <TaskList filteredTask={visibleTask} filter={filter} handleTaskChanged={handleTaskChange}/>

      <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>

        <TaskListPagination
        handleNext ={handleNext}
        handlePrev ={handlePrev}
        handlePageChange ={handlePageChange}
        page={page}
        totalPages={totalPages}
        
        />

        <DateTimeFilter 
            dateQuery={dateQuery} 
            setDateQuery={setDateQuery}
        />
      </div>
    <Footer
    activeTasksCount={activeTaskCount}
    completedTasksCount={completeTaskCount}
    />
     </div>
  </div>
</div>

   
  )
}
export default HomePage