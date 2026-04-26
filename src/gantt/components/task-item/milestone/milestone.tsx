import type { TaskItemProps } from '../task-item'
import styles from './milestone.module.css'

export const Milestone: Component<TaskItemProps> = ({
  task,
  isDateChangeable,
  onEventStart,
  isSelected,
}) => {
  const transform = `rotate(45 ${task.x1 + task.height * 0.356} 
    ${task.y + task.height * 0.85})`
  const getBarColor = () => {
    return isSelected ? task.styles.backgroundSelectedColor : task.styles.backgroundColor
  }

  return (
    <g tabIndex={0} class={styles.milestoneWrapper}>
      <rect
        fill={getBarColor()}
        x={task.x1}
        width={task.height}
        y={task.y}
        height={task.height}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        transform={transform}
        class={styles.milestoneBackground}
        onMouseDown={(e) => {
          isDateChangeable && onEventStart('move', task, e)
        }}
      />
    </g>
  )
}
