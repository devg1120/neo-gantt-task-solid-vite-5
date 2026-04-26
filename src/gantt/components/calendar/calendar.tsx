import {
  getCachedDateTimeFormat,
  getDaysInMonth,
  getLocalDayOfWeek,
  getLocaleMonth,
} from '../../helpers/date-helper'
import type { DateSetup } from '../../types/date-setup'
import { ViewModeEnum } from '../../types/public-types'
import styles from './calendar.module.css'
import { TopPartOfCalendar } from './top-part-of-calendar'
import type { JSXElement } from 'solid-js'

export type CalendarProps = {
  dateSetup: DateSetup
  locale: string
  viewMode: ViewModeEnum
  rtl: boolean
  headerHeight: number
  columnWidth: number
  fontFamily: string
  fontSize: string
  showDayOfWeek: boolean
}

export const Calendar: Component<CalendarProps> = ({
  __dateSetup,
  locale,
  viewMode,
  rtl,
  headerHeight,
  columnWidth,
  fontFamily,
  fontSize,
  showDayOfWeek,
}) => {
  //console.log(viewMode)
  const calculateXText = (rtl: boolean, i: number, value: number, columnWidth: number) => {
    return rtl ? (6 + i + value + 1) * columnWidth : (6 + i - value) * columnWidth
  }

  const getCalendarValuesForYear = () => {
    const topValues: JSXElement[] = []
    const bottomValues: JSXElement[] = []
    const topDefaultHeight = headerHeight * 0.5
    for (let i = 0; i < __dateSetup()().dates.length; i++) {
      const date = __dateSetup()().dates[i]
      const bottomValue = date.getFullYear()
      bottomValues.push(
        <text
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          class={styles.calendarBottomText}
        >
          {bottomValue}
        </text>,
      )
      if (i === 0 || date.getFullYear() !== __dateSetup()().dates[i - 1].getFullYear()) {
        const topValue = date.getFullYear().toString()
        const xText = calculateXText(rtl, i, date.getFullYear(), columnWidth)
        topValues.push(
          <TopPartOfCalendar
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={headerHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />,
        )
      }
    }
    return [topValues, bottomValues]
  }

  const getCalendarValuesForQuarterYear = () => {
    const topValues: JSXElement[] = []
    const bottomValues: JSXElement[] = []
    const topDefaultHeight = headerHeight * 0.5
    for (let i = 0; i < __dateSetup()().dates.length; i++) {
      const date = __dateSetup()().dates[i]
      // const bottomValue = getLocaleMonth(date, locale);
      const quarter = `Q${Math.floor((date.getMonth() + 3) / 3)}`
      bottomValues.push(
        <text
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          class={styles.calendarBottomText}
        >
          {quarter}
        </text>,
      )
      if (i === 0 || date.getFullYear() !== __dateSetup()().dates[i - 1].getFullYear()) {
        const topValue = date.getFullYear().toString()
        const xText = calculateXText(rtl, i, date.getMonth(), columnWidth)
        topValues.push(
          <TopPartOfCalendar
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={Math.abs(xText)}
            yText={topDefaultHeight * 0.9}
          />,
        )
      }
    }
    return [topValues, bottomValues]
  }

  const getCalendarValuesForMonth = () => {
    const topValues: JSXElement[] = []
    const bottomValues: JSXElement[] = []
    const topDefaultHeight = headerHeight * 0.5
    for (let i = 0; i < __dateSetup()().dates.length; i++) {
      const date = __dateSetup()().dates[i]
      const bottomValue = getLocaleMonth(date, locale)
      bottomValues.push(
        <text
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          class={styles.calendarBottomText}
        >
          {bottomValue}
        </text>,
      )
      if (i === 0 || date.getFullYear() !== __dateSetup()().dates[i - 1].getFullYear()) {
        const topValue = date.getFullYear().toString()
        const xText = calculateXText(rtl, i, date.getMonth(), columnWidth)
        topValues.push(
          <TopPartOfCalendar
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />,
        )
      }
    }
    return [topValues, bottomValues]
  }

  const getCalendarValuesForWeek = () => {
    const topValues: JSXElement[] = []
    const bottomValues: JSXElement[] = []
    let weeksCount = 1
    const topDefaultHeight = headerHeight * 0.5
    const dates = __dateSetup()().dates
    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i]
      let topValue = ''
      if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
        // top
        //topValue = `${getLocaleMonth(date, locale)}, ${date.getFullYear()}`;

        const year = getCachedDateTimeFormat(locale, {
          year: 'numeric',
        }).format(date)
        const month = getCachedDateTimeFormat(locale, {
          month: 'numeric',
        }).format(date)

        topValue = `${year} ${month}`
      }
      // bottom
      //const bottomValue = `W${getWeekNumberISO8601(date)}`;

      const month = getCachedDateTimeFormat(locale, {
        month: 'numeric',
      }).format(date)
      const day = getCachedDateTimeFormat(locale, {
        day: 'numeric',
      }).format(date)
      const bottomValue = `${month}/${day}`

      bottomValues.push(
        <text y={headerHeight * 0.8} x={columnWidth * (i + +rtl)} class={styles.calendarBottomText}>
          {bottomValue}
        </text>,
      )

      if (topValue) {
        // if last day is new month
        if (i !== dates.length - 1) {
          topValues.push(
            <TopPartOfCalendar
              value={topValue}
              x1Line={columnWidth * i + weeksCount * columnWidth}
              y1Line={0}
              y2Line={topDefaultHeight}
              xText={columnWidth * i + columnWidth * weeksCount * 0.5}
              yText={topDefaultHeight * 0.9}
            />,
          )
        }
        weeksCount = 0
      }
      weeksCount++
    }
    return [topValues, bottomValues]
  }

  const getCalendarValuesForDay = () => {
    const topValues: JSXElement[] = []
    const midValues: JSXElement[] = []
    const bottomValues: JSXElement[] = []
    //const topDefaultHeight = headerHeight * 0.5;
    const topDefaultHeight = headerHeight * 0.35 //GUSA
    //const dates = dateSetup.dates;
    const dates = __dateSetup()()['dates'] //GUSA
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i]
      const week = date.getDay()
      //console.log(week);
      let style = ''
      if (week == 0 || week == 6) {
        style = styles.calendarBottomTextHoliday
      } else {
        style = styles.calendarBottomText
      }
      const dayOfWeek = getLocalDayOfWeek(date, locale, 'short')
      /*
                        const midValue = showDayOfWeek
                            ? `${dayOfWeek}, ${date.getDate()}`
                            : `${date.getDate()}`;
            */
      const midValue = `${date.getDate()}`

      midValues.push(
        <text
          y={headerHeight * 0.6} //GUSA
          x={columnWidth * i + columnWidth * 0.5}
          //className={styles.calendarBottomText}
          class={style}
        >
          {midValue}
        </text>,
      )

      /*
                        const bottomValue = showDayOfWeek
                            ? `${dayOfWeek}, ${date.getDate()}`
                            : `${date.getDate()}`;
            */
      const bottomValue = `${dayOfWeek}`

      bottomValues.push(
        <text
          y={headerHeight * 0.87} //GUSA
          x={columnWidth * i + columnWidth * 0.5}
          //className={styles.calendarBottomText}
          class={style}
        >
          {bottomValue}
        </text>,
      )
      if (i + 1 !== dates.length && date.getMonth() !== dates[i + 1].getMonth()) {
        //console.log(i);
        const topValue = getLocaleMonth(date, locale)
        topValues.push(
          <TopPartOfCalendar
            value={topValue}
            x1Line={columnWidth * (i + 1)}
            y1Line={0}
            //y2Line={topDefaultHeight}
            y2Line={100} //GUSA
            /*
                        xText={
                            columnWidth * (i + 1 ) -
                            getDaysInMonth(date.getMonth(), date.getFullYear()) *
                                columnWidth *
                                0.5
                        }
                        */
            xText={
              //GUSA
              columnWidth * (i + 1) -
              getDaysInMonth(date.getMonth(), date.getFullYear()) * columnWidth * 1 +
              columnWidth / 2
            }
            yText={topDefaultHeight * 0.9}
          />,
        )
      }
    }
    return [topValues, midValues, bottomValues]
  }

  const getCalendarValuesForPartOfDay = () => {
    const topValues: JSXElement[] = []
    const bottomValues: JSXElement[] = []
    const ticks = viewMode === ViewModeEnum.HalfDay ? 2 : 4
    const topDefaultHeight = headerHeight * 0.5
    const dates = __dateSetup()().dates
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i]
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: 'numeric',
      }).format(date)

      bottomValues.push(
        <text
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          class={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>,
      )
      if (i === 0 || date.getDate() !== dates[i - 1].getDate()) {
        /*
                const topValue = `${getLocalDayOfWeek(
                    date,
                    locale,
                    "short",
                )}, ${date.getDate()} ${getLocaleMonth(date, locale)}`;
                */

        const day = getCachedDateTimeFormat(locale, {
          day: 'numeric',
        }).format(date)
        const topValue = `
				 ${getLocaleMonth(date, locale)}
				 ${day} 
				  (${getLocalDayOfWeek(date, locale, 'short')})`

        topValues.push(
          <TopPartOfCalendar
            value={topValue}
            x1Line={columnWidth * i + ticks * columnWidth}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * i + ticks * columnWidth * 0.5}
            yText={topDefaultHeight * 0.9}
          />,
        )
      }
    }

    return [topValues, bottomValues]
  }

  const getCalendarValuesForHour = () => {
    const topValues: JSXElement[] = []
    const bottomValues: JSXElement[] = []
    const topDefaultHeight = headerHeight * 0.5
    const dates = __dateSetup()().dates
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i]
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: 'numeric',
      }).format(date)

      bottomValues.push(
        <text
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          class={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>,
      )
      if (i !== 0 && date.getDate() !== dates[i - 1].getDate()) {
        const displayDate = dates[i - 1]
        /*
                const topValue = `${getLocalDayOfWeek(
                    displayDate,
                    locale,
                    "long",
                )}, ${displayDate.getDate()} ${getLocaleMonth(displayDate, locale)}`;
      */

        const day = getCachedDateTimeFormat(locale, {
          day: 'numeric',
        }).format(date)
        const topValue = `
				 ${getLocaleMonth(displayDate, locale)}
				 ${day} 
				  (${getLocalDayOfWeek(displayDate, locale, 'short')})`

        const topPosition = (date.getHours() - 24) / 2
        topValues.push(
          <TopPartOfCalendar
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * (i + topPosition)}
            yText={topDefaultHeight * 0.9}
          />,
        )
      }
    }

    return [topValues, bottomValues]
  }

  let topValues: JSXElement[] = []
  let midValues: JSXElement[] = []
  let bottomValues: JSXElement[] = []
  let dates_length: number = __dateSetup()().dates.length

  //switch (dateSetup.viewMode) {
  switch (
    __dateSetup()()['viewMode'] //GUSA
  ) {
    case ViewModeEnum.Year:
      ;[topValues, bottomValues] = getCalendarValuesForYear()
      break
    case ViewModeEnum.QuarterYear:
      ;[topValues, bottomValues] = getCalendarValuesForQuarterYear()
      break
    case ViewModeEnum.Month:
      ;[topValues, bottomValues] = getCalendarValuesForMonth()
      break
    case ViewModeEnum.Week:
      ;[topValues, bottomValues] = getCalendarValuesForWeek()
      break
    case ViewModeEnum.Day:
      ;[topValues, midValues, bottomValues] = getCalendarValuesForDay()
      break
    case ViewModeEnum.QuarterDay:
    case ViewModeEnum.HalfDay:
      ;[topValues, bottomValues] = getCalendarValuesForPartOfDay()
      break
    case ViewModeEnum.Hour:
      ;[topValues, bottomValues] = getCalendarValuesForHour()
  }
  return (
    <g class="calendar" font-size={fontSize} font-family={fontFamily}>
      <rect
        x={0}
        y={0}
        width={columnWidth * dates_length}
        height={headerHeight}
        class={styles.calendarHeader}
      />
      {bottomValues} {topValues} {midValues}
    </g>
  )
}
