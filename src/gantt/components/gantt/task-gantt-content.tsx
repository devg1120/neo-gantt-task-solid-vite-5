import { handleTaskBySVGMouseEvent } from '../../helpers/bar-helper'
import { isKeyboardEvent } from '../../helpers/other-helper'
import type { BarTask } from '../../types/bar-task'
import type {
  BarMoveAction,
  GanttContentMoveAction,
  GanttEvent,
} from '../../types/gantt-task-actions'
import type { EventOption } from '../../types/public-types'
import { Arrow } from '../other/arrow'
import { TaskItem } from '../task-item/task-item'
import { createEffect, on, createSignal } from 'solid-js'

export type TaskGanttContentProps = {
  tasks: BarTask[]
  dates: Date[]
  ganttEvent: GanttEvent
  selectedTask: BarTask | undefined
  rowHeight: number
  columnWidth: number
  timeStep: number
  svg?: React.RefObject<SVGSVGElement>
  svgWidth: number
  taskHeight: number
  arrowColor: string
  arrowIndent: number
  fontSize: string
  fontFamily: string
  rtl: boolean
  setGanttEvent: (value: GanttEvent) => void
  setFailedTask: (value: BarTask | null) => void
  setSelectedTask: (taskId: string) => void
} & EventOption

export const TaskGanttContent: Component<TaskGanttContentProps> = ({
  tasks,
  dates,
  __ganttEvent,
  selectedTask,
  rowHeight,
  columnWidth,
  timeStep,
  svg,
  taskHeight,
  arrowColor,
  arrowIndent,
  fontFamily,
  fontSize,
  rtl,
  setGanttEvent,
  setFailedTask,
  setSelectedTask,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onClick,
  onDelete,
}) => {
  const point = svg?.createSVGPoint()
  const [xStep, setXStep] = createSignal(0)
  const [initEventX1Delta, setInitEventX1Delta] = createSignal(0)
  const [isMoving, setIsMoving] = createSignal(false)

  // create xStep
  createEffect(
    on(
      () => [columnWidth, dates, timeStep],
      () => {
        if (!dates[0] || !dates[1]) return
        const dateDelta =
          dates[1].getTime() -
          dates[0].getTime() -
          dates[1].getTimezoneOffset() * 60 * 1000 +
          dates[0].getTimezoneOffset() * 60 * 1000
        const newXStep = (timeStep * columnWidth) / dateDelta
        setXStep(newXStep)
      },
    ),
  )

  createEffect(
    on(
      () => [
        __ganttEvent(),
        xStep(),
        initEventX1Delta(),
        onProgressChange,
        timeStep,
        onDateChange,
        svg,
        isMoving(),
        point,
        rtl,
        setFailedTask,
        setGanttEvent,
      ],
      () => {
        const handleMouseMove = async (event: MouseEvent) => {
          if (!__ganttEvent().changedTask || !point || !svg) return
          event.preventDefault()

          point.x = event.clientX
          const cursor = point.matrixTransform(svg?.getScreenCTM()?.inverse())

          const { isChanged, changedTask } = handleTaskBySVGMouseEvent(
            cursor.x,
            __ganttEvent().action as BarMoveAction,
            __ganttEvent().changedTask,
            xStep(),
            timeStep,
            initEventX1Delta(),
            rtl,
          )
          if (isChanged) {
            setGanttEvent({ action: __ganttEvent().action, changedTask })
          }
        }

        const handleMouseUp = async (event: MouseEvent) => {
          const { action, originalSelectedTask, changedTask } = __ganttEvent()
          /* GUSA
                if (!changedTask || !point || !svg || !originalSelectedTask)
                    return;
*/
          event.preventDefault()

          point.x = event.clientX
          const cursor = point.matrixTransform(svg?.getScreenCTM()?.inverse())
          const { changedTask: newChangedTask } = handleTaskBySVGMouseEvent(
            cursor.x,
            action as BarMoveAction,
            changedTask,
            xStep(),
            timeStep,
            initEventX1Delta(),
            rtl,
          )
          /*
                const isNotLikeOriginal =
                    originalSelectedTask.start !== newChangedTask.start ||
                    originalSelectedTask.end !== newChangedTask.end ||
                    originalSelectedTask.progress !== newChangedTask.progress;
*/
          // remove listeners
          svg.removeEventListener('mousemove', handleMouseMove)
          svg.removeEventListener('mouseup', handleMouseUp)
          setGanttEvent({ action: '' })
          setIsMoving(false)

          // custom operation start
          let operationSuccess = true
          if (
            (action === 'move' || action === 'end' || action === 'start') &&
            //onDateChange &&
            //isNotLikeOriginal
            onDateChange
          ) {
            try {
              const result = await onDateChange(newChangedTask, newChangedTask.barChildren)
              if (result !== undefined) {
                operationSuccess = result
              }
            } catch (error) {
              console.log(error)
              operationSuccess = false
            }
            // GUSA } else if (onProgressChange && isNotLikeOriginal) {
          } else if (onProgressChange) {
            try {
              const result = await onProgressChange(newChangedTask, newChangedTask.barChildren)
              if (result !== undefined) {
                operationSuccess = result
              }
            } catch (error) {
              operationSuccess = false
            }
          }

          // If operation is failed - return old state
          if (!operationSuccess) {
            setFailedTask(originalSelectedTask)
          }
        }

        if (
          !isMoving() &&
          (__ganttEvent().action === 'move' ||
            __ganttEvent().action === 'end' ||
            __ganttEvent().action === 'start' ||
            __ganttEvent().action === 'progress') &&
          svg
        ) {
          svg.addEventListener('mousemove', handleMouseMove)
          svg.addEventListener('mouseup', handleMouseUp)
          setIsMoving(true)
        }
      },
    ),
  )

  /**
   * Method is Start point of task change
   */
  const handleBarEventStart = async (
    action: GanttContentMoveAction,
    task: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent,
  ) => {
    if (!event) {
      if (action === 'select') {
        setSelectedTask(task.id)
      }
    }
    // Keyboard events
    else if (isKeyboardEvent(event)) {
      if (action === 'delete') {
        if (onDelete) {
          try {
            const result = await onDelete(task)
            if (result !== undefined && result) {
              setGanttEvent({ action, changedTask: task })
            }
          } catch (error) {
            console.error(`Error on Delete. ${error}`)
          }
        }
      }
    }
    // Mouse Events
    else if (action === 'mouseenter') {
      // console.log("mouseenter")

      if (!__ganttEvent().action) {
        setGanttEvent({
          action,
          changedTask: task,
          originalSelectedTask: task,
        })
      }
    } else if (action === 'mouseleave') {
      if (__ganttEvent().action === 'mouseenter') {
        setGanttEvent({ action: '' })
      }
    } else if (action === 'dblclick') {
      !!onDoubleClick && onDoubleClick(task)
    } else if (action === 'click') {
      !!onClick && onClick(task)
    }
    // Change task event start
    else if (action === 'move') {
      //console.log("move", svg, point)
      //if (!svg?.current || !point) return;
      if (!svg || !point) return
      //console.log("move2")
      point.x = event.clientX
      const cursor = point.matrixTransform(
        //svg.current.getScreenCTM()?.inverse(),
        svg.getScreenCTM()?.inverse(),
      )
      setInitEventX1Delta(cursor.x - task.x1)
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      })
    } else {
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      })
    }
  }

  return (
    <g class="content">
      <g class="arrows" fill={arrowColor} stroke={arrowColor}>
        {tasks().map((task) => {
          //console.log(task.y)
          return task.barChildren.map((child) => {
            return (
              <Arrow
                taskFrom={task}
                taskTo={tasks()[child.index]}
                rowHeight={rowHeight}
                taskHeight={taskHeight()}
                arrowIndent={arrowIndent}
                rtl={rtl}
              />
            )
          })
        })}
      </g>
      <g class="bar" font-family={fontFamily} font-size={fontSize}>
        {tasks().map((task) => {
          return (
            <TaskItem
              task={task}
              arrowIndent={arrowIndent}
              taskHeight={taskHeight()}
              isProgressChangeable={!!onProgressChange && !task.isDisabled}
              isDateChangeable={!!onDateChange && !task.isDisabled}
              isDelete={!task.isDisabled}
              onEventStart={handleBarEventStart}
              isSelected={!!selectedTask && task.id === selectedTask.id}
              rtl={rtl}
            />
          )
        })}
      </g>
    </g>
  )
}
