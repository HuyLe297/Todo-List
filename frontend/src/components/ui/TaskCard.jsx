import React, { useState } from 'react'
import { Card } from './card'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from 'lucide-react'
import { Input } from './input'
import api from '@/lib/axios'
import { toast } from 'sonner'

const TaskCard = ({ task, index , handleTaskChanged }) => {
  const [isEditting, setIsEditting] = React.useState(false)
  const [updateTaskTitle , setUpdateTaskTitle] = useState(task.title || "");

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      toast.success('Nhiệm vụ đã được xóa')
      handleTaskChanged();
    } catch (error) {
       console.error("Lỗi xảy ra khi xóa task" , error);
       toast.error("Lỗi xảy ra khi xóa.");
    }
  }
  const updateTask = async () => {
    try {
      setIsEditting(false)
      await api.put(`/tasks/${task._id}` , {
        title : updateTaskTitle.trim(),
      })
      toast.success(`Nhiệm vụ đã đổi thành ${updateTaskTitle}`)
       handleTaskChanged();
    } catch (error) {
      console.error("Lỗi xảy ra khi update task" , error);
       toast.error("Lỗi xảy ra khi cập nhật nhiệm vụ.");
    }
  }

 const toggleTaskCompleteButton = async () => {
  try {
    if (task.status === 'active') {
      await api.put(`/tasks/${task._id}`, {
        status: 'complete',
          completedAt: new Date().toISOString(),
      });
      toast.success(`${task.title} đã hoàn thành 🎉`);
    } else {
      await api.put(`/tasks/${task._id}`, {
          status: 'active',
          completedAt: null,
      });
      toast.success(`${task.title} đã được đưa lại danh sách đang làm`);
    }
    handleTaskChanged();
  } catch (error) {
    console.error("Lỗi khi toggle task:", error);
    toast.error("Không thể cập nhật trạng thái nhiệm vụ");
  }
};


  return (
    <Card
      className={cn(
        "p-4 bg-gradient-background border-0 shadow-custom-md-lg transition-all duration-200 animate-fade-in group",
        task.status === 'complete' && 'opacity-75'
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className='flex items-center gap-4'>
        {/* Checkbox */}
        <Button
          variant='ghost'
          size='icon'
          className={cn(
            'shrink-0 size-8 rounded-full transition-all duration-200',
            task.status === 'complete'
              ? 'text-success hover:text-success/80'
              : 'text-muted-foreground hover:text-primary'
          )}
          onClick = {toggleTaskCompleteButton}
        >
          {task.status === 'complete' ? (
            <CheckCircle2 className='size-5' />
          ) : (
            <Circle className='size-5' />
          )}
        </Button>

        {/* Task content + actions */}
        <div className='flex-1 min-w-0 flex items-center justify-between gap-4'>
          {/* Title + Date */}
          <div className='flex-1 min-w-0'>
            {isEditting ? (
              <Input
                  placeholder='Cần phải làm gì?'
                  className='h-9 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20'
                  type='text'
                  value={updateTaskTitle}
                  onChange={(e) => setUpdateTaskTitle(e.target.value)}   
                  onKeyPress={(e) => e.key === 'Enter' && updateTask()}
                  onBlur={updateTask}
                  autoFocus
                />
            ) : (
              <p
                className={cn(
                  'text-base transition-all duration-200 cursor-pointer',
                  task.status === 'complete'
                    ? 'line-through text-muted-foreground'
                    : 'text-foreground'
                )}
                onDoubleClick={() => setIsEditting(true)}
              >
                {task.title}
              </p>
            )}

            {/* Date */}
            <div className='flex items-center gap-1.5 mt-1 text-xs text-muted-foreground'>
            <Calendar className='size-3' />
            <span>
              {new Date(task.createdAt).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </span>

            {/* Nếu đã hoàn thành → hiện thời gian hoàn thành */}
            {task.completedAt && (
              <>
                <span className='mx-2'>→</span>
                <Calendar className='size-3 text-green-600' />
                <span className='text-green-600 font-medium'>
                  {new Date(task.completedAt).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </>
            )}
          </div>
          </div>

          {/* Edit/Delete Buttons - hiện khi hover */}
          <div className='hidden group-hover:inline-flex gap-1.5 transition-all'>
            <Button
              variant="ghost"
              size='icon'
              className='size-7 text-muted-foreground hover:text-info'
              onClick={() => {
                setIsEditting(true)
                setUpdateTaskTitle(task.title || "")


              }}
              
            >
              <SquarePen className='size-3.5' />
            </Button>
            <Button
              variant="ghost"
              size='icon'
              className='size-7 text-muted-foreground hover:text-destructive'
              onClick = {() => deleteTask(task._id)}
            >
              <Trash2 className='size-3.5' />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TaskCard