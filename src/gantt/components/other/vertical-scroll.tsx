import styles from './vertical-scroll.module.css'
import { createEffect, on } from 'solid-js'
import type { Component } from 'solid-js'

export const VerticalScroll: Component<{
  scroll: number
  ganttHeight: number
  ganttFullHeight: number
  headerHeight: number
  rtl: boolean
  onScroll: (event: SyntheticEvent) => void
}> = ({ scroll, ganttHeight, ganttFullHeight, headerHeight, rtl, onScroll }) => {
  let scrollRef: HTMLDivElement

  createEffect(
    on(
      () => [scroll],
      () => {
        if (scrollRef) {
          scrollRef.scrollTop = scroll
        }
      },
    ),
  )

  return (
    <div
      style={{
        height: ganttHeight + 'px',
        'margin-top': headerHeight + 'px',
        'margin-left': rtl ? '' : '-1rem',
      }}
      class={styles.scroll}
      onScroll={onScroll}
      ref={scrollRef}
    >
      <div
        style={{
          height: ganttFullHeight + 'px',
          width: '1px',
        }}
      />
    </div>
  )
}
