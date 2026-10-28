export const AddSlotReducer = (state, action) => {
    const {type, payload} = action;

    switch(type) {
        case 'ADD_SLOT':
            return {...state, slotList: payload.slots, total: payload.total}
        
        default:
            throw new Error("No case found!!")
    }
}