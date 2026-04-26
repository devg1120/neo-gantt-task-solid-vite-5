import '../index.css'
import { ViewMode } from '../gantt/index.js'

type ViewSwitcherProps = {
  isChecked: boolean
  onViewListChange: (isChecked: boolean) => void
  onViewModeChange: (viewMode: ViewMode) => void
  showFromTo: boolean
  setShowFromTo: (showFromTo: boolean) => void
}
export const ViewSwitcher: Component<ViewSwitcherProps> = ({
  onViewModeChange,
  onViewListChange,
  isChecked,
  showFromTo,
  setShowFromTo,
}) => {
  const check = () => {
    let c = isChecked()
    onViewListChange(!c)
  }

  const fromto_check = () => {
    let c = showFromTo()
    setShowFromTo(!c)
  }
  return (
    <div class="ViewContainer">
      <button class="Button" onClick={() => onViewModeChange(ViewMode.Hour)} type="button">
        Hour
      </button>
      <button class="Button" onClick={() => onViewModeChange(ViewMode.QuarterDay)} type="button">
        Quarter of Day
      </button>
      <button class="Button" onClick={() => onViewModeChange(ViewMode.HalfDay)} type="button">
        Half of Day
      </button>
      <button class="Button" onClick={() => onViewModeChange(ViewMode.Day)} type="button">
        Day
      </button>
      <button class="Button" onClick={() => onViewModeChange(ViewMode.Week)} type="button">
        Week
      </button>
      <button class="Button" onClick={() => onViewModeChange(ViewMode.Month)} type="button">
        Month
      </button>
      <button class="Button" onClick={() => onViewModeChange(ViewMode.Year)} type="button">
        Year
      </button>
      <button class="Button" onClick={() => onViewModeChange(ViewMode.QuarterYear)} type="button">
        QuarterYear
      </button>
      <div class="Switch">
        <label class="Switch_Toggle">
          <input
            type="checkbox"
            defaultChecked={isChecked()}
            //onClick={() => onViewListChange(!isChecked())}
            onClick={() => check()}
          />
          <span class="Slider" />
        </label>
        Show Task List
      </div>
      <div class="Switch">
        <label class="Switch_Toggle">
          <input
            type="checkbox"
            defaultChecked={showFromTo}
            //onClick={() => setShowFromTo(!showFromTo)}
            onClick={() => fromto_check()}
          />
          <span class="Slider" />
        </label>
        Show From / To
      </div>
    </div>
  )
}
