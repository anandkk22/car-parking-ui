import { useEffect, useState } from "react";
import { getAllFloors, getParkingSlots } from '../../services/authServices'
import { FloorTabs } from './floor/FloorTabs';
import { toast } from "react-toastify";
import { Modal, Button } from 'react-bootstrap';
import './Dashboard.css'
import { AddFloor } from "./floor/AddFloor";
import { AddSlot } from "./floor/slots/AddSlot";
import { AllocateSlabs } from "./allocateSlabs/AllocateSlabs";
export const Dashboard = () => {
    const [floors, setFloors] = useState([]);
    const [activeFloor, setActiveFloor] = useState(null);
    const [floorSlots, setFloorSlots] = useState([]);
    const [selectedFloor, setselectedFloor] = useState([]);
    const [available, setAvailable] = useState([]);
    const [occupied, setOccupied] = useState([]);
    const [newFloor, setNewFloor] = useState(false);
    const [newSlot, setNewSlot] = useState(false);
    const [allocateNewSlab, setAllocateNewSlab] = useState(false);

    const addFloor = () => setNewFloor(true);
    const addSlot = () => setNewSlot(true);
    const addAllocateSlab = () => setAllocateNewSlab(true);


    useEffect(() => {
        async function fetchFloorDetails() {
            try {
                const data = await getAllFloors();
                if (!Array.isArray(data)) {
                    throw new Error("Invalid floors response");
                }

                const validFloors = data.filter(
                    (floor) => floor !== null && typeof floor === "object"
                );
                setFloors(validFloors);
                setActiveFloor(validFloors[0]?.floorId ?? null);
            } catch (error) {
                toast.error(error.message)
            }
        }
        fetchFloorDetails();
    }, [])

    useEffect(() => {
        async function fetchParkingSlots() {
            try {
                const data = await getParkingSlots();
                if (!Array.isArray(data)) {
                    throw new Error("Invalid floors response");
                }
                setFloorSlots(data);
                setAvailable(data.filter((slot) => slot.status == 'available'));
                setOccupied(data.filter((slot) => slot.status == 'occupied'));
            } catch (error) {
                toast.error(error.message);
            }
        }
        fetchParkingSlots()
    }, [])

    useEffect(() => {
        if (activeFloor === null) {
            setselectedFloor([]);
            return;
        }
        setselectedFloor(
            floorSlots.filter((slot) => String(slot.floorId) === String(activeFloor))
        );
    }, [activeFloor, floorSlots]);

    return (
        <main className="my-10">
            <section className="my-5">
                <div className="my-10 flex justify-between">
                    <div className="container mt-3 ps-0">
                        <div className="row">
                            <div className="col-sm-3 p-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="fs-5 card-title fw-bold">Total Floors</div>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div className="fs-4">{floors.length}</div>
                                            <i className="bi bi-grid-3x3-gap fs-2 text-warning"></i>
                                        </div>
                                        <button className="small btn btn-link ps-0 fs-13" onClick={addFloor}>
                                            <i class="bi bi-plus-square me-2 text-primary"></i><span className="text-primary">Add Floor</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 p-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="fs-5 card-title fw-bold">Total Slots</div>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div className="fs-4">{floorSlots.length}</div>
                                            <i className="bi bi-columns-gap fs-2 text-danger"></i>
                                        </div>
                                        <button className="small btn btn-link ps-0 fs-13" onClick={addSlot}>
                                            <i class="bi bi-plus-square me-2 text-primary"></i><span className="text-primary">Add Slot</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 p-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="fs-5 card-title fw-bold">Available Slots</div>
                                        <div className='align-items-center justify-content-between'>
                                            <div class="progress" style={{ height: '30px' }}>
                                                <div class="progress-bar" role="progressbar" style={{ width: '55%' }} aria-valuenow={floorSlots.length - available.length} aria-valuemin="0" aria-valuemax={floorSlots.length - available.length}>{available.length}</div>
                                            </div>
                                        </div>
                                        <button className="small btn btn-link mt-3 ps-0 fs-13" onClick={addAllocateSlab} disabled={available.length== 0}>
                                            <i class="bi bi-plus-square me-2 text-primary"></i><span className="text-primary">Allocate Slot</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 p-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="fs-5 card-title fw-bold">Occupied Slots</div>
                                        <div className='align-items-center justify-content-between'>
                                            <div class="progress" style={{ height: '30px' }}>
                                                <div class="progress-bar bg-danger" role="progressbar" style={{ width: '75%' }} aria-valuenow={123 - 25} aria-valuemin="0" aria-valuemax={123 - 25}>{occupied.length}</div>
                                            </div>
                                        </div>
                                        <button className="small btn btn-link mt-3 ps-0 fs-13">
                                            <i class="bi bi-dash-square me-2 text-primary"></i><span className="text-primary">Checkout Slot</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className='row'>
                <div className='col-sm-12'>
                    <section className='d-flex'>
                        <FloorTabs
                            floors={floors}
                            selectedFloor={selectedFloor}
                            activeFloor={activeFloor}
                            setActiveFloor={setActiveFloor}
                        />
                    </section>
                </div>
            </div>
            <AddFloor newFloor={newFloor} setNewFloor={setNewFloor} floors={floors} setFloors={setFloors} />
            <AddSlot newSlot={newSlot} setNewSlot={setNewSlot} floors={floors}/>
            <AllocateSlabs allocateNewSlab={allocateNewSlab} setAllocateNewSlab={setAllocateNewSlab} />
        </main>
    );
}
