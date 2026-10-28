import { createContext, useContext, useReducer } from "react";
import { FloorReducer } from "../components/reducers/FloorReducer";

const floorInitialState = {
    floorList: [],
    total: 0,
}

const FloorContext = createContext(floorInitialState);

export const FloorProvider = ({children}) => {
    const [state, dispatch] = useReducer(FloorReducer, floorInitialState);

    function addFloor(floor) {
        const updatedFloor = state.floorList.concat(floor);
        const updatedTotal = state.total + 1;
        dispatch({
            type: 'ADD_FLOOR',
            payload: {
                floors: updatedFloor,
                total: updatedTotal
            }
        })
    }

    const value = {
        floorList: state.floorList,
        total: state.total,
        addFloor,
    }

    return (
        <FloorContext.Provider value={value}>
            {children}
        </FloorContext.Provider>
    )
}

export const useFloor = () => {
    const floorContext = useContext(FloorContext);
    return floorContext;
}