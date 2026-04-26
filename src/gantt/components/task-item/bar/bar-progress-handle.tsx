import styles from './bar.module.css'

type BarProgressHandleProps = {
  progressPoint: string
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void
}
export const BarProgressHandle: Component<BarProgressHandleProps> = ({
  progressPoint,
  onMouseDown,
}) => {
  return <polygon class={styles.barHandle} points={progressPoint} onMouseDown={onMouseDown} />
}
