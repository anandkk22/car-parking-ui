import { createContext, useContext, useReducer } from "react"
import { AddSlotReducer } from "../components/reducers/AddSlotReducer"

const addSlotInitialState = {
    slotList: [],
    total: 0,
}

const AddSlotContext = createContext(addSlotInitialState)

export const AddSlotProvider = ({children}) => {
    const [state, dispatch ] = useReducer(AddSlotReducer, addSlotInitialState);

    function addSlot(slot) {
        const updatedSlot = state.slotList.concat(slot);
        const updatedTotal = state.total + 1;
        dispatch({
            type: 'ADD_SLOT',
            payload: {
                slots: updatedSlot,
                total: updatedTotal
            }
        })
    }

    const value = {
        slotList: state.slotList,
        total: state.total,
        addSlot,
    }

    return (
        <AddSlotProvider.Provider value = {value}>
            {children}
        </AddSlotProvider.Provider>
    )
}

export const useAddSlot = () => {
    const addSlotContext = useContext(AddSlotContext);
    return addSlotContext;
}