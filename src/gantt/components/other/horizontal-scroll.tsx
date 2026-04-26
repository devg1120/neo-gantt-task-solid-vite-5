import styles from './horizontal-scroll.module.css'
import { createEffect, on } from 'solid-js'
import type { Component } from 'solid-js'

export const HorizontalScroll: Component<{
  scroll: number
  svgWidth: number
  taskListWidth: number
  rtl: boolean
  onScroll: (event: SyntheticEvent) => void
}> = ({ scroll, svgWidth, taskListWidth, rtl, onScroll }) => {
  let scrollRef: HTMLDivElement

  createEffect(
    on(
      () => [scroll],
      () => {
        if (scrollRef) {
          scrollRef.scrollLeft = scroll
        }
      },
    ),
  )

  return (
    <div
      dir="ltr"
      style={{
        margin: rtl ? `0px ${taskListWidth()}px 0px 0px` : `0px 0px 0px ${taskListWidth()}px`,
      }}
      class={styles.scrollWrapper}
      onScroll={onScroll}
      ref={scrollRef}
    >
      <div style={{ width: svgWidth + 'px' }} class={styles.scroll} />
    </div>
  )
}
