export const CheckinReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'SET_SLOTS':
            return {
                slotList: payload,
                totalAvailableSlot: payload.filter((slot) => slot.status === 'available').length,
                totalOccupiedSlot: payload.filter((slot) => slot.status === 'occupied').length,
                checkInVersion: state.checkInVersion,
            }

        case 'CHECK-IN':
            return {
                ...state,
                totalAvailableSlot: Math.max(0, state.totalAvailableSlot - 1),
                totalOccupiedSlot: state.totalOccupiedSlot + 1,
                checkInVersion: state.checkInVersion + 1,
            }

        case 'CHECK-OUT':
            return {
                ...state,
                totalAvailableSlot: state.totalAvailableSlot + 1,
                totalOccupiedSlot: Math.max(0, state.totalOccupiedSlot - 1),
            }

        default:
            throw new Error("No case found!!")
    }
}