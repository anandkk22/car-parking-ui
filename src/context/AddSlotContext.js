import { createContext, useCallback, useContext, useReducer } from "react"
import { AddSlotReducer } from "../components/reducers/AddSlotReducer"

const addSlotInitialState = {
    slotList: [],
    total: 0,
}

const AddSlotContext = createContext(addSlotInitialState)

export const AddSlotProvider = ({children}) => {
    const [state, dispatch ] = useReducer(AddSlotReducer, addSlotInitialState);

    const setSlots = useCallback((slots) => {
        dispatch({
            type: 'SET_SLOTS',
            payload: slots
        })
    }, [])

    const addNewSlot = useCallback((slot) => {
        dispatch({
            type: 'ADD_SLOT',
            payload: slot
        })
    }, [])

    const value = {
        slotList: state.slotList,
        total: state.total,
        setSlots,
        addNewSlot,
    }

    return (
        <AddSlotContext.Provider value = {value}>
            {children}
        </AddSlotContext.Provider>
    )
}

export const useAddSlot = () => {
    const addSlotContext = useContext(AddSlotContext);
    return addSlotContext;
}