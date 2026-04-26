import styles from './calendar.module.css'

type TopPartOfCalendarProps = {
  value: string
  x1Line: number
  y1Line: number
  y2Line: number
  xText: number
  yText: number
}

export const TopPartOfCalendar: Component<TopPartOfCalendarProps> = ({
  value,
  x1Line,
  y1Line,
  y2Line,
  xText,
  yText,
}) => {
  return (
    <g class="calendarTop">
      <line x1={x1Line} y1={y1Line} x2={x1Line} y2={y2Line} class={styles.calendarTopTick} />
      <text y={yText} x={xText} class={styles.calendarTopText}>
        {value}
      </text>
    </g>
  )
}
