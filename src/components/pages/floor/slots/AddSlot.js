import { useState } from 'react';
import { addNewSlot } from '../../../../services/authServices'
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

export const AddSlot = ({ floors, newSlot, setNewSlot }) => {
    const status = [{ id: 1, name: 'Available', value: 'available' }, { id: 2, name: 'Occupied', value: 'occupied' }, { id: 3, name: 'Reserved', value: 'reserved' }];
    const [floorSelected, setFloorSelected] = useState('');
    const [slectedSlotNumber, setSelectedSlotNumber] = useState('');
    const [selectStatus, setSelectStatus] = useState('')
    const isDisabled = !floorSelected || !slectedSlotNumber || slectedSlotNumber == Number(0)  || !selectStatus;

    const handleClose = () => {
        setNewSlot(false);
        setFloorSelected('');
        setSelectedSlotNumber('');
        setSelectStatus('')
    }

    async function addSlot(event) {
        event.preventDefault();
        try {
            const slotDetails = {
                floorId: Number(floorSelected),
                slotNumber: Number(slectedSlotNumber),
                status: selectStatus,
            }
            const data = await addNewSlot(slotDetails);
            if(data)
            setFloorSelected('')
            setSelectedSlotNumber('');
            setSelectStatus('')
            handleClose();
            toast.success("Added Slot successfully");

        } catch (error) {
            toast.error(error.message)
        }
    }
    return (
        <div>
            <Modal show={newSlot} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Slot</Modal.Title>
                </Modal.Header>
                <form className="flex items-center" onSubmit={addSlot}>
                    <Modal.Body>
                        <label htmlFor="floorSelected" className='required-label'>Floor Number</label>
                        <select class="form-select form-select-sm" aria-label=".form-select-sm example" required value={floorSelected}
                        onChange={(e) => setFloorSelected(e.target.value)}>
                            <option value="" disabled selected>Select Floor</option>
                            {
                                floors.map((floor) => (
                                    <option value={floor.floorId}>{floor.description}</option>
                                ))
                            }
                        </select>
                        <div class="form-group mt-4">
                            <label htmlFor="description" className='required-label'>Slot Number</label>
                            <input type="number" class="form-control" id="floorNumber" aria-describedby="emailHelp" placeholder="Enter Slot Number" value={slectedSlotNumber}
                             onChange={(e) => setSelectedSlotNumber(e.target.value)}/>
                        </div>
                        <div class="form-group mt-4">
                            <label htmlFor="description" className='required-label'>Status</label>
                            <select class="form-select form-select-sm" aria-label=".form-select-sm example" required value={selectStatus}
                            onChange={(e) => setSelectStatus(e.target.value)}>
                                <option value="" disabled selected>Select Status</option>
                                {
                                    status.map((st) => (
                                        <option value={st.value}>{st.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='button' variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type='submit' variant="success" disabled={isDisabled}>
                            Add
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}
