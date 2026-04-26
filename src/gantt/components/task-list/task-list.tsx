import type { BarTask } from '../../types/bar-task'
import type { Task } from '../../types/public-types'
import type { TaskListTableProps } from './task-list-table'
import type { TaskListHeaderProps } from './task-list-header'
import { createEffect, on } from 'solid-js'

export type TaskListProps = {
  headerHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
  rowHeight: number
  ganttHeight: number
  scrollY: number
  locale: string
  tasks: Task[]
  taskListRef: React.RefObject<HTMLDivElement>
  horizontalContainerClass?: string
  selectedTask: BarTask | undefined
  setSelectedTask: (task: string) => void
  onExpanderClick: (task: Task) => void
  TaskListHeader: Component<TaskListHeaderProps>
  TaskListTable: Component<TaskListTableProps>
  showFromTo: boolean
}

export const TaskList: Component<TaskListProps> = ({
  headerHeight,
  fontFamily,
  fontSize,
  rowWidth,
  rowHeight,
  scrollY,
  tasks,
  selectedTask,
  setSelectedTask,
  onExpanderClick,
  locale,
  ganttHeight,
  taskListRef,
  horizontalContainerClass,
  TaskListHeader,
  TaskListTable,
  showFromTo,
}) => {
  let horizontalContainerRef: HTMLDivElement
  createEffect(
    on(
      () => [scrollY()],
      () => {
        if (horizontalContainerRef) {
          horizontalContainerRef.scrollTop = scrollY()
        }
      },
    ),
  )

  const headerProps = {
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth,
    showFromTo,
  }
  const selectedTaskId = selectedTask ? selectedTask.id : ''
  const tableProps = {
    rowHeight,
    rowWidth,
    fontFamily,
    fontSize,
    tasks,
    locale,
    selectedTaskId: selectedTaskId,
    setSelectedTask,
    onExpanderClick,
    showFromTo,
  }
  return (
    <div ref={taskListRef}>
      <TaskListHeader {...headerProps} />
      <div
        ref={horizontalContainerRef}
        class={horizontalContainerClass}
        style={ganttHeight ? { height: ganttHeight + 'px' } : {}}
      >
        <TaskListTable {...tableProps} />
      </div>
    </div>
  )
}
