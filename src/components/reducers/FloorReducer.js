export const FloorReducer = (state, action) => {
    const{type, payload} = action;

    switch(type) {
        case 'SET_FLOORS':
            return {...state, floorList: payload, totalFloors: payload.length}

        case 'ADD_FLOOR':
            return {
                ...state,
                floorList: [...state.floorList, payload],
                totalFloors: state.totalFloors + 1
            }

        default:
            throw new Error("No case Found!")
    }
}