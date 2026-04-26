import { Calendar, type CalendarProps } from '../calendar/calendar'
import { Grid, type GridProps } from '../grid/grid'
import styles from './gantt.module.css'
import { TaskGanttContent, type TaskGanttContentProps } from './task-gantt-content'
import { createSignal, createEffect, on, onMount, onCleanup } from 'solid-js'

export type TaskGanttProps = {
  gridProps: GridProps
  calendarProps: CalendarProps
  barProps: TaskGanttContentProps
  ganttHeight: number
  scrollY: number
  scrollX: number
}

export const TaskGantt: Component<TaskGanttProps> = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  scrollY,
  scrollX,
}) => {
  let ganttSVGRef: SVGSVGElement
  let horizontalContainerRef: HTMLDivElement
  let verticalGanttContainerRef: HTMLDivElement

  let newBarProps = { ...barProps, svg: ganttSVGRef }

  const [__SVG, setSVG] = createSignal({ ...barProps, svg: ganttSVGRef })

  /*
    createEffect(on(
        () => {
            if (ganttSVGRef) {
               newBarProps = { ...barProps, svg: ganttSVGRef };
            }
        }
    ));
*/

  onMount(() => {
    if (ganttSVGRef) {
      newBarProps = { ...barProps, svg: ganttSVGRef }
      setSVG(<TaskGanttContent {...newBarProps()} />)
    }
  })

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

  createEffect(
    on(
      () => [scrollX()],
      () => {
        if (verticalGanttContainerRef) {
          verticalGanttContainerRef.scrollLeft = scrollX()
        }
      },
    ),
  )

  return (
    <div class={styles.ganttVerticalContainer} ref={verticalGanttContainerRef} dir="ltr">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={gridProps.svgWidth}
        height={calendarProps.headerHeight}
        font-family={barProps.fontFamily}
      >
        <title>Gantt Chart</title>
        <Calendar {...calendarProps} />
      </svg>

      <div
        ref={horizontalContainerRef}
        class={styles.horizontalContainer}
        style={
          ganttHeight
            ? { height: ganttHeight + 'px', width: gridProps.svgWidth + 'px' }
            : { width: gridProps.svgWidth + 'px' }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={newBarProps.rowHeight * newBarProps.tasks().length}
          font-family={newBarProps.fontFamily}
          ref={ganttSVGRef}
        >
          <Grid {...gridProps} />
          {__SVG()}
        </svg>
      </div>
    </div>
  )
}
