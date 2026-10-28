export const FloorReducer = (state, action) => {
    const{type, payload} = action;

    switch(type) {
        case 'ADD_FLOOR':
            return {...state, floorList: payload.floors, total: payload.total}

        default:
            throw new Error("No case Found!")
    }
}