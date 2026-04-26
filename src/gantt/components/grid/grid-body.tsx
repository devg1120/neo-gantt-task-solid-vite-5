import { addToDate } from '../../helpers/date-helper'
import type { Task } from '../../types/public-types'
import styles from './grid.module.css'

export type GridBodyProps = {
  tasks: Task[]
  dates: Date[]
  svgWidth: number
  rowHeight: number
  columnWidth: number
  todayColor: string
  rtl: boolean
}
export const GridBody: Component<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  rtl,
}) => {
  //console.log("GridBody", tasks);
  let y = 0
  const gridRows = []
  const rowLines = [<line x="0" y1={0} x2={svgWidth} y2={0} class={styles.gridRowLine} />]
  for (const task of tasks()) {
    gridRows.push(<rect x="0" y={y} width={svgWidth} height={rowHeight} class={styles.gridRow} />)
    rowLines.push(
      <line x="0" y1={y + rowHeight} x2={svgWidth} y2={y + rowHeight} class={styles.gridRowLine} />,
    )
    y += rowHeight
  }

  const now = new Date()
  let tickX = 0
  const ticks: ReactChild[] = []
  let today: ReactChild = <rect />
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i]
    ticks.push(<line x1={tickX} y1={0} x2={tickX} y2={y} class={styles.gridTick} />)
    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      // if current date is last
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(date, date.getTime() - dates[i - 1].getTime(), 'millisecond').getTime() >=
          now.getTime())
    ) {
      today = <rect x={tickX} y={0} width={columnWidth} height={y} fill={todayColor} />
    }
    // rtl for today
    if (
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime()
    ) {
      today = (
        <rect x={tickX + columnWidth} y={0} width={columnWidth} height={y} fill={todayColor} />
      )
    }
    tickX += columnWidth
  }
  return (
    <g class="gridBody">
      <g class="rows">{gridRows}</g>
      <g class="rowLines">{rowLines}</g>
      <g class="ticks">{ticks}</g>
      <g class="today">{today}</g>
    </g>
  )
}
