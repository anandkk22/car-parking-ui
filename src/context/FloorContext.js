import { createContext, useCallback, useContext, useReducer } from "react";
import { FloorReducer } from "../components/reducers/FloorReducer";

const floorInitialState = {
    floorList: [],
    totalFloors: 0,
}

const FloorContext = createContext(floorInitialState);

export const FloorProvider = ({ children }) => {
    const [state, dispatch] = useReducer(FloorReducer, floorInitialState);

    const setFloors = useCallback((floors) => {
        dispatch({
            type: 'SET_FLOORS',
            payload: floors
        })
    }, [])

    const addNewFloor = useCallback((floor) => {
        dispatch({
            type: 'ADD_FLOOR',
            payload: floor
        })
    }, [])

    const value = {
        floorList: state.floorList,
        totalFloors: state.totalFloors,
        setFloors,
        addNewFloor,
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