import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { addFloor } from '../../../services/authServices';

export const AddFloor = ({ newFloor, setNewFloor, floors, setFloors }) => {
    const handleClose = () => {
        setNewFloor(false);
        setFloorNumber("");
        setDescription("");
    }
    const [floorNumber, setFloorNumber] = useState("");
    const [description, setDescription] = useState("");
    const isDisabled = !floorNumber || !description;

    async function addNewFloor(event) {
        event.preventDefault();
        try {
            const floorDetails = {
                floorNumber: floorNumber,
                description: description,
            }
            const data = await addFloor(floorDetails);
            setFloors([...floors, data]);
            setFloorNumber("");
            setDescription("");
            handleClose();
            toast.success("Added Floor successfully");
        } catch (error) {
            toast.error(error.message);
        }
    }
    return (
        <div>
            <Modal show={newFloor} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Floor</Modal.Title>
                </Modal.Header>
                <form onSubmit={addNewFloor} className="flex items-center">
                    <Modal.Body>
                        <div class="form-group">
                            <label htmlFor="floorNumber" className='required-label'>Floor Number</label>
                            <input type="number" class="form-control" id="floorNumber" aria-describedby="emailHelp" placeholder="Enter Floor Number" value={floorNumber}
                                onChange={(e) => setFloorNumber(e.target.value)} />
                        </div>
                        <div class="form-group mt-4">
                            <label htmlFor="description" className='required-label'>Description</label>
                            <input type="text" class="form-control" id="description" placeholder="Enter Description" value={description}
                                onChange={(e) => setDescription(e.target.value)} />
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
