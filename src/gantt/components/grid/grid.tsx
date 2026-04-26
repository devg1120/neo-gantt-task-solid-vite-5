import { GridBody, type GridBodyProps } from './grid-body'

export type GridProps = GridBodyProps
export const Grid: Component<GridProps> = (props) => {
  //  console.log("Grid", props);
  return (
    <g class="grid">
      <GridBody {...props} />
    </g>
  )
}
