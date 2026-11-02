import { createContext, useCallback, useContext, useReducer } from "react";
import { CheckinReducer } from "../components/reducers/CheckinReducer";

const checkInInitialState = {
    slotList: [],
    totalAvailableSlot: 0,
    totalOccupiedSlot: 0,
    checkInVersion: 0,
}

const CheckInContext = createContext(checkInInitialState);

export const CheckInOutProvider = ({children}) => {
    const [state, dispatch] = useReducer(CheckinReducer, checkInInitialState);

    const setSlots = useCallback((slots) => {
        dispatch({
            type: 'SET_SLOTS',
            payload: slots,
        })
    }, [])

    const checkInSlot = useCallback((slot) => {
        dispatch({
            type: 'CHECK-IN',
            payload: slot,
        })
    }, [])

    const checkOutSlot = useCallback((slot) => {
        dispatch({
            type: 'CHECK-OUT',
            payload: slot,
        })
    }, [])

    const value = {
        slotList: state.slotList,
        totalAvailableSlot: state.totalAvailableSlot,
        totalOccupiedSlot: state.totalOccupiedSlot,
        checkInVersion: state.checkInVersion,
        setSlots,
        checkInSlot,
        checkOutSlot
    }

     return (
        <CheckInContext.Provider value = {value}>
            {children}
        </CheckInContext.Provider>
    )
}

export const useCheckInOut = () => {
    const checkInOutContext = useContext(CheckInContext);
    return checkInOutContext;
}