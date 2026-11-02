export const AddSlotReducer = (state, action) => {
    const {type, payload} = action;

    switch(type) {
        case 'SET_SLOTS':
            return {...state, slotList: payload, total: payload.length}

        case 'ADD_SLOT':
            return{
                ...state,
                slotList: [...state.slotList, payload],
                total: state.total + 1
            }
        
        default:
            throw new Error("No case found!!")
    }
}