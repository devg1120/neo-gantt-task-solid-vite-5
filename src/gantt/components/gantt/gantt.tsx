import { createSignal, createMemo, createEffect, onMount, For } from 'solid-js'

import { convertToBarTasks } from '../../helpers/bar-helper'
import { ganttDateRange, seedDates } from '../../helpers/date-helper'
import { removeHiddenTasks, sortTasks } from '../../helpers/other-helper'
import type { BarTask } from '../../types/bar-task'
import type { DateSetup } from '../../types/date-setup'
import type { GanttEvent } from '../../types/gantt-task-actions'
import { type GanttProps, type Task, ViewModeEnum } from '../../types/public-types'
import type { CalendarProps } from '../calendar/calendar'
import type { GridProps } from '../grid/grid'
import { HorizontalScroll } from '../other/horizontal-scroll'
import { StandardTooltipContent, Tooltip } from '../other/tooltip'
import { VerticalScroll } from '../other/vertical-scroll'
import { TaskList, type TaskListProps } from '../task-list/task-list'
import { TaskListHeaderDefault } from '../task-list/task-list-header'
import { TaskListTableDefault } from '../task-list/task-list-table'
import styles from './gantt.module.css'
import { TaskGantt } from './task-gantt'
import type { TaskGanttContentProps } from './task-gantt-content'

export const Gantt: Component<GanttProps> = ({
  id = 0,
  //tasks = [],
  tasks,
  //headerHeight = 50,
  headerHeight = 70,
  columnWidth = 60,
  //listCellWidth = "155px",
  listCellWidth,
  rowHeight = 50,
  ganttHeight = 0,
  viewMode = ViewModeEnum.Day,
  preStepsCount = 1,
  //locale = "en-GB",
  locale = 'ja-JP', //GUSA
  barFill = 60,
  barCornerRadius = 3,
  barProgressColor = '#a3a3ff',
  barProgressSelectedColor = '#8282f5',
  barBackgroundColor = '#b8c2cc',
  barBackgroundSelectedColor = '#aeb8c2',
  projectProgressColor = '#7db59a',
  projectProgressSelectedColor = '#59a985',
  projectBackgroundColor = '#fac465',
  projectBackgroundSelectedColor = '#f7bb53',
  milestoneBackgroundColor = '#f1c453',
  milestoneBackgroundSelectedColor = '#f29e4c',
  rtl = false,
  showDayOfWeek = true, //GUSA
  showFromTo = false,
  handleWidth = 8,
  timeStep = 300000,
  arrowColor = 'grey',
  fontFamily = 'Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue',
  fontSize = '14px',
  arrowIndent = 20,
  todayColor = 'rgba(252, 248, 227, 0.5)',
  viewDate,
  TooltipContent = StandardTooltipContent,
  TaskListHeader = TaskListHeaderDefault,
  TaskListTable = TaskListTableDefault,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onClick,
  onDelete,
  onSelect,
  onExpanderClick,
  // onScrollX,
  // onScrollY,
  // syncScrollX,
  // syncScrollY,
  // __scrollX,
  // setScrollX,
  // __scrollY,
  // setScrollY,
}) => {
  const createDefaultDates = () => {
    const today = new Date()
    const daysBefore = 7
    const daysAfter = 7

    const defaultDates: Date[] = []

    // pre-week
    for (let i = daysBefore; i > 0; i--) {
      const date = new Date()
      date.setDate(today.getDate() - i)
      defaultDates.push(date)
    }

    // today
    defaultDates.push(today)

    // post-week
    for (let i = 1; i <= daysAfter; i++) {
      const date = new Date()
      date.setDate(today.getDate() + i)
      defaultDates.push(date)
    }

    return defaultDates
  }

  let wrapperRef: HTMLDivElement
  let taskListRef: HTMLDivElement

  const [__dateSetup, setDateSetup] = createSignal<DateSetup>(() => {
    if (!tasks() || tasks().length === 0) {
      return { viewMode: ViewModeEnum.Day, dates: createDefaultDates() }
    }
    const [startDate, endDate] = ganttDateRange(tasks(), viewMode, preStepsCount)
    return { viewMode, dates: seedDates(startDate, endDate, viewMode) }
  })
  const [__currentViewDate, setCurrentViewDate] = createSignal<Date | undefined>(undefined)

  const [__taskListWidth, setTaskListWidth] = createSignal(200)
  const [__svgContainerWidth, setSvgContainerWidth] = createSignal(0)
  const [__svgContainerHeight, setSvgContainerHeight] = createSignal(ganttHeight)
  const [__barTasks, setBarTasks] = createSignal<BarTask[]>([])
  const [__ganttEvent, setGanttEvent] = createSignal<GanttEvent>({
    action: '',
  })
  const taskHeight = createMemo(() => (rowHeight * barFill) / 100, [rowHeight, barFill])

  const [__selectedTask, setSelectedTask] = createSignal<BarTask>()
  const [__failedTask, setFailedTask] = createSignal<BarTask | null>(null)

  const svgWidth = __dateSetup()().dates.length * columnWidth

  const ganttFullHeight = tasks().length * rowHeight

  const [__scrollY, setScrollY] = createSignal(0)
  const [__scrollX, setScrollX] = createSignal(-1)

  const [__syncScrollX_OLD, setSyncScrollX_OLD] = createSignal(0)
  const [__syncScrollY_OLD, setSyncScrollY_OLD] = createSignal(0)

  const [__ignoreScrollEvent, setIgnoreScrollEvent] = createSignal(false)

  const [__keyDownScrollEvent, setKeyDownScrollEvent] = createSignal(false)

  const [__ignoreSyncScrollXEvent, setIgnoreSyncScrollXEvent] = createSignal(false)
  const [__ignoreSyncScrollYEvent, setIgnoreSyncScrollYEvent] = createSignal(false)

  // task change events
  createEffect(() => {
    if (!tasks() || tasks().length === 0) {
      setSvgContainerHeight(headerHeight)
      return
    }
    let filteredTasks: Task[]
    if (onExpanderClick) {
      filteredTasks = removeHiddenTasks(tasks())
    } else {
      filteredTasks = tasks()
    }
    filteredTasks = filteredTasks.sort(sortTasks)
    const [startDate, endDate] = ganttDateRange(filteredTasks, viewMode, preStepsCount)
    let newDates = seedDates(startDate, endDate, viewMode)
    if (rtl) {
      newDates = newDates.reverse()
      if (__scrollX() === -1) {
        setScrollX(newDates.length * columnWidth)
      }
    }
    setDateSetup({ dates: newDates, viewMode })

    const newBarTasks = convertToBarTasks(
      filteredTasks,
      newDates,
      columnWidth,
      rowHeight,
      taskHeight,
      barCornerRadius,
      handleWidth,
      rtl,
      barProgressColor,
      barProgressSelectedColor,
      barBackgroundColor,
      barBackgroundSelectedColor,
      projectProgressColor,
      projectProgressSelectedColor,
      projectBackgroundColor,
      projectBackgroundSelectedColor,
      milestoneBackgroundColor,
      milestoneBackgroundSelectedColor,
    )
    if (newBarTasks.length === 0) {
      setSvgContainerHeight(headerHeight)
      return
    }

    setBarTasks(newBarTasks)
  })
  createEffect(() => {
    if (
      viewMode === __dateSetup().viewMode &&
      ((viewDate && !currentViewDate()) ||
        (viewDate && currentViewDate()?.valueOf() !== viewDate.valueOf()))
    ) {
      const dates = __dateSetup().dates
      const index = dates.findIndex(
        (d, i) =>
          viewDate.valueOf() >= d.valueOf() &&
          i + 1 !== dates.length &&
          viewDate.valueOf() < dates[i + 1].valueOf(),
      )
      if (index === -1) {
        return
      }
      setCurrentViewDate(viewDate)
      setScrollX(columnWidth * index)
    }
  })
  const [key, setKey] = createSignal({})

  createEffect(() => {
    const { changedTask, action } = __ganttEvent()

    if (changedTask) {
      if (action === 'delete') {
        setGanttEvent({ action: '' })
        setBarTasks(barTasks().filter((t) => t.id !== changedTask.id))
      } else if (
        action === 'move' ||
        action === 'end' ||
        action === 'start' ||
        action === 'progress'
      ) {
        const prevStateTask = __barTasks().find((t) => t.id === changedTask.id)

        if (
          prevStateTask &&
          (prevStateTask.start.getTime() !== changedTask.start.getTime() ||
            prevStateTask.end.getTime() !== changedTask.end.getTime() ||
            prevStateTask.progress !== changedTask.progress)
        ) {
          // actions for change
          setKey([{}])
          const newTaskList = __barTasks().map((t) => (t.id === changedTask.id ? changedTask : t))
          setBarTasks(newTaskList)
        }
      }
    }
  })

  createEffect(() => {
    if (__failedTask()) {
      setBarTasks(barTasks().map((t) => (t.id !== failedTask.id ? t : failedTask)))
      setFailedTask(null)
    }
  })

  /*
    createEffect(() => {
        if (!listCellWidth()) {
            setTaskListWidth(0);
        }
        //if (taskListRef.current) {
        if (taskListRef) {
            //setTaskListWidth(taskListRef.current.offsetWidth);
            setTaskListWidth(taskListRef.offsetWidth);
        }
    }) ;
*/

  createEffect(() => {
    let v = listCellWidth()
    if (v == '') {
      setTaskListWidth(0)
    } else {
      let v2 = v.slice(0, -2)
      setTaskListWidth(Number(v2))
    }
  })

  createEffect(() => {
    //if (wrapperRef.current) {
    if (wrapperRef) {
      //setSvgContainerWidth(wrapperRef.current.offsetWidth - taskListWidth);
      setSvgContainerWidth(wrapperRef.offsetWidth - __taskListWidth())
    }
  })

  createEffect(() => {
    if (__barTasks().length === 0) {
      setSvgContainerHeight(headerHeight)
    } else if (ganttHeight) {
      setSvgContainerHeight(ganttHeight + headerHeight)
    } else {
      setSvgContainerHeight(tasks().length * rowHeight + headerHeight)
    }
  })

  // scroll events
  createEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.shiftKey || event.deltaX) {
        const scrollMove = event.deltaX ? event.deltaX : event.deltaY
        let newScrollX = __scrollX() + scrollMove
        if (newScrollX < 0) {
          newScrollX = 0
        } else if (newScrollX > svgWidth) {
          newScrollX = svgWidth
        }
        setScrollX(newScrollX)
        event.preventDefault()
      } else if (ganttHeight) {
        let newScrollY = __scrollY() + event.deltaY
        if (newScrollY < 0) {
          newScrollY = 0
        } else if (newScrollY > ganttFullHeight - ganttHeight) {
          newScrollY = ganttFullHeight - ganttHeight
        }
        if (newScrollY !== __scrollY()) {
          setScrollY(newScrollY)
          event.preventDefault()
        }
      }

      setIgnoreScrollEvent(true)
    }

    // subscribe if scroll is necessary
    //wrapperRef.current?.addEventListener("wheel", handleWheel, {
    wrapperRef?.addEventListener('wheel', handleWheel, {
      passive: false,
    })
    return () => {
      //wrapperRef.current?.removeEventListener("wheel", handleWheel);
      wrapperRef?.removeEventListener('wheel', handleWheel)
    }
  })
  /*
  createEffect(() => {
    if (onScrollY) {
      //onScrollY(scrollY)
      onScrollY({ sid: id, num: __scrollY() })
    }
  })

  createEffect(() => {
    if (onScrollX) {
      //onScrollX(scrollX)
      onScrollX({ sid: id, num: __scrollX() })
    }
  })
*/
  /*
    createEffect(() => {
        //console.log("syncScrollX", syncScrollX)
        if (!syncScrollX) { return; }
        if (syncScrollX.sid == id) { return; }

        setSyncScrollX_OLD(syncScrollX.num);

        //console.log("syncScrollX_OLD", syncScrollX_OLD)

        if (!__ignoreSyncScrollXEvent()) {
            if (syncScrollX) {
                setScrollX(syncScrollX.num);
                setIgnoreSyncScrollXEvent(true);
            }
        } else {
            setIgnoreSyncScrollXEvent(false);
        }

    });
*/
  /*  LOOP
    createEffect(() => {
        //console.log("syncScrollY")
        if (!syncScrollY) { return; }
        if (syncScrollY.sid == id) { return; }

        setSyncScrollY_OLD(syncScrollY.num);

        //console.log("syncScrollY_OLD", syncScrollY_OLD)

        if (!__ignoreSyncScrollYEvent()) {
            if (syncScrollY) {
                setScrollY(syncScrollY.num);
                setIgnoreSyncScrollYEvent(true);
            }

        } else {
            setIgnoreSyncScrollYEvent(false);
        }

    });
*/
  /* LOOP
    createEffect(() => {
        console.log("syncScrollY")
        if (!__ignoreSyncScrollYEvent()) {
            if(syncScrollY){
            console.log("Y")
            setScrollY(syncScrollY);
            setIgnoreSyncScrollYEvent(true);
            }
        } else {
            if(syncScrollY){
            console.log("Y")
            setScrollY(syncScrollY);
            setIgnoreSyncScrollYEvent(false);
            }
        }
        	
    } );

*/

  const handleScrollY = (event: SyntheticEvent) => {
    if (__scrollY() !== event.currentTarget.scrollTop && !__ignoreScrollEvent()) {
      //console.log(id, 'sclollY', event.currentTarget.scrollTop)
      setScrollY(event.currentTarget.scrollTop)
      setIgnoreScrollEvent(true)
    } else {
      setIgnoreScrollEvent(false)
    }
  }

  const handleScrollX = (event: SyntheticEvent) => {
    if (__scrollX() !== event.currentTarget.scrollLeft && !__ignoreScrollEvent()) {
      //console.log(id, 'sclollX', event.currentTarget.scrollLeft)
      setScrollX(event.currentTarget.scrollLeft)
      setIgnoreScrollEvent(true)
    } else {
      setIgnoreScrollEvent(false)
    }
  }

  /**
   * Handles arrow keys events and transform it to new scroll
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.repeat) {
      //return;
    }

    let newScrollY = __scrollY()
    let newScrollX = __scrollX()
    let isX = true
    //console.log("keydown")
    switch (event.key) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        newScrollY += rowHeight
        isX = false
        break
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        newScrollY -= rowHeight
        isX = false
        break
      case 'Left':
      case 'ArrowLeft':
        newScrollX -= columnWidth
        break
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        newScrollX += columnWidth
        break
    }
    if (isX) {
      if (newScrollX < 0) {
        newScrollX = 0
      } else if (newScrollX > svgWidth) {
        newScrollX = svgWidth
      }
      setKeyDownScrollEvent(true)
      setScrollX(newScrollX)
    } else {
      if (newScrollY < 0) {
        newScrollY = 0
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        newScrollY = ganttFullHeight - ganttHeight
      }
      setKeyDownScrollEvent(true)
      setScrollY(newScrollY)
    }
    setIgnoreScrollEvent(true)
  }

  /**
   * Task select event
   */
  const handleSelectedTask = (taskId: string) => {
    const newSelectedTask = barTasks().find((t) => t.id === taskId)
    const oldSelectedTask = barTasks().find((t) => !!selectedTask && t.id === selectedTask.id)
    if (onSelect) {
      if (oldSelectedTask) {
        onSelect(oldSelectedTask, false)
      }
      if (newSelectedTask) {
        onSelect(newSelectedTask, true)
      }
    }
    setSelectedTask(newSelectedTask)
  }
  const handleExpanderClick = (task: Task) => {
    if (onExpanderClick && task.hideChildren !== undefined) {
      onExpanderClick({ ...task, hideChildren: !task.hideChildren })
    }
  }

  const gridProps: GridProps = {
    columnWidth,
    svgWidth,
    tasks: tasks,
    rowHeight,
    //dates: dateSetup.dates,
    dates: __dateSetup()().dates, //GUSA
    todayColor,
    rtl,
  }

  const calendarProps: CalendarProps = {
    __dateSetup,
    locale,
    viewMode,
    headerHeight,
    columnWidth,
    fontFamily,
    fontSize,
    rtl,
    showDayOfWeek,
  }

  const barProps: TaskGanttContentProps = {
    tasks: __barTasks,
    //dates: dateSetup.dates,
    dates: __dateSetup()().dates,
    __ganttEvent,
    __selectedTask,
    rowHeight,
    taskHeight,
    columnWidth,
    arrowColor,
    timeStep,
    fontFamily,
    fontSize,
    arrowIndent,
    svgWidth,
    rtl,
    setGanttEvent,
    setFailedTask,
    setSelectedTask: handleSelectedTask,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onClick,
    onDelete,
    //onScrollX,
    //onScrollY,
  }

  const tableProps: TaskListProps = {
    rowHeight,
    rowWidth: listCellWidth(),
    fontFamily,
    fontSize,
    tasks: __barTasks,
    locale,
    headerHeight,
    scrollY: __scrollY,
    ganttHeight,
    horizontalContainerClass: styles.horizontalContainer,
    __selectedTask,
    taskListRef,
    setSelectedTask: handleSelectedTask,
    onExpanderClick: handleExpanderClick,
    TaskListHeader,
    TaskListTable,
    showFromTo,
  }

  if (tasks().length === 0) {
    return null
  }

  return (
    <div>
      <div class={styles.wrapper} onKeyDown={handleKeyDown} ref={wrapperRef} tabIndex={-1}>
        {/* Column: Task List */}
        {listCellWidth() && <TaskList {...tableProps} />}
        {/* Column: Gantt Chart */}
        <TaskGantt
          gridProps={gridProps}
          calendarProps={calendarProps}
          barProps={barProps}
          ganttHeight={ganttHeight}
          scrollY={__scrollY}
          scrollX={__scrollX}
        />

        {__ganttEvent().changedTask && (
          <Tooltip
            arrowIndent={arrowIndent}
            rowHeight={rowHeight}
            svgContainerHeight={__svgContainerHeight()}
            svgContainerWidth={__svgContainerWidth()}
            fontFamily={fontFamily}
            fontSize={fontSize}
            scrollX={__scrollX}
            scrollY={__scrollY}
            task={__ganttEvent().changedTask}
            __ganttEvent={__ganttEvent}
            headerHeight={headerHeight}
            taskListWidth={__taskListWidth()}
            TooltipContent={TooltipContent}
            rtl={rtl}
            svgWidth={svgWidth}
          />
        )}

        <VerticalScroll
          ganttFullHeight={ganttFullHeight}
          ganttHeight={ganttHeight}
          headerHeight={headerHeight}
          scroll={__scrollY()}
          onScroll={handleScrollY}
          rtl={rtl}
        />
      </div>
      <HorizontalScroll
        svgWidth={svgWidth}
        taskListWidth={__taskListWidth}
        scroll={__scrollX()}
        rtl={rtl}
        onScroll={handleScrollX}
      />
    </div>
  )
}
