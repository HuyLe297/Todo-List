import { FilterType } from '@/lib/data'
import { Badge } from './ui/badge'
import React from 'react'
import { Button } from './ui/button'
import { Filter } from 'lucide-react' 

export const StatsAndFilter = ({
  activeTasksCount = 0,
  completedTasksCount = 0,
  setFilter,
  filter = FilterType.all,
}) => {
  return (
    <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
      {/* Stats */}
      <div className='flex gap-3'>
        <Badge variant="secondary" className='bg-white/50 text-accent-foreground border-info/20'>
          {activeTasksCount} {FilterType.active}
        </Badge>
        <Badge variant="secondary" className='bg-white/50 text-green-700 border-success/20'>
          {completedTasksCount} {FilterType.completed}
        </Badge>
      </div>

      {/* Filter Buttons - ĐÃ SỬA ĐÚNG THEO CODE CỦA BẠN */}
      <div className='flex flex-col gap-2 sm:flex-row'>
        {Object.values(FilterType).map((type) => {
          const filterValue = 
            type === FilterType.all ? 'all' :
            type === FilterType.active ? 'active' :
            type === FilterType.completed ? 'complete' : 'all';

          return (
            <Button
              key={type}
              variant={filter === filterValue ? 'gradient' : 'ghost'}
              size='sm'
              className='capitalize'
              onClick={() => setFilter(filterValue)}
            >
              <Filter className='w-4 h-4 mr-1' />
              {type}
            </Button>
          )
        })}
      </div>
    </div>
  )
}