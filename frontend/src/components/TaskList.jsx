import React from 'react'
import TaskEmpyState from './TaskEmpyState'
import TaskCard from './ui/TaskCard'

const TaskList = ({filteredTask , filter, handleTaskChanged}) => {



if(!filteredTask || filteredTask.length === 0  ) {
  return <TaskEmpyState filter = {filter}/>;
}
  return (
    <div className='space-y-3 '>
      {filteredTask.map((task, index) =>(
        <TaskCard
          key = {task._id ?? index }
          task = {task}
          index = {index}
          handleTaskChanged={handleTaskChanged}
        />
      ))}
    </div>
  )
}

export default TaskList