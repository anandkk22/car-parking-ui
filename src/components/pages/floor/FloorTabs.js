import './Floor.css'
import { Slot } from "./slots/Slot";

export const FloorTabs = ({ floors, activeFloor, setActiveFloor, selectedFloor, parkedRefreshVersion }) => {
  return (
    <div>
      <ul className="nav nav-tabs mb-4 justify-content-start" id="pills-tab" role="tablist">
        {floors.map((floor) => (
          <li className="nav-item" role="presentation" key={floor.floorId}>
            <button
              className={`nav-link ${String(activeFloor) === String(floor.floorId) ? "active" : ""}`}
              id={`floor-${floor.floorId}-tab`}
              type="button"
              role="tab"
              aria-controls="floor-slots"
              aria-selected={String(activeFloor) === String(floor.floorId)}
              onClick={() => setActiveFloor(floor.floorId)}
            >
              {floor.description}
            </button>
          </li>
        ))}
      </ul>
      <div id="floor-slots" role="tabpanel" aria-labelledby={`floor-${activeFloor}-tab`} tabIndex="0">
        <Slot selectedFloor={selectedFloor} parkedRefreshVersion={parkedRefreshVersion} />
      </div>
    </div>
  )
}
