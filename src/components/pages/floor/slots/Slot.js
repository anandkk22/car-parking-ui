import { useEffect, useState } from 'react';
import { getAllParkedDetails } from '../../../../services/authServices'
import { toast } from "react-toastify"
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Slot.css'

const formatEntryTime = (entryTime) => {
    const date = new Date(entryTime);
    if (Number.isNaN(date.getTime())) return entryTime;

    const pad = value => String(value).padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const Slot = ({ selectedFloor }) => {
    const slots = Array.isArray(selectedFloor) ? selectedFloor : [];
    const [parked, setParked] = useState([]);

    const mergedSlots = slots.map(slot => {
        const match = parked.find(
            p => p.slotId === slot.slotId && p.status.toLowerCase() === slot.status.toLowerCase()
        );
        return match ? { ...slot, ...match } : slot;
    });

    useEffect(() => {
        async function fetchParkedDetails() {
            try {
                const data = await getAllParkedDetails();
                if (!Array.isArray(data)) {
                    throw new Error("Invalid floors response");
                }
                setParked(data);

            } catch (error) {
                toast.error(error.message);
            }
        } fetchParkedDetails()
    }, [])


    return (
        

        <div className="text-center">
            <div className="d-flex flex-wrap gap-3">{mergedSlots.map((slot) => (
                slot.vehicleNumber ? (
                    <OverlayTrigger
                        key={slot.slotId ?? slot.id}
                        placement="bottom"
                        overlay={<Tooltip id="button-tooltip">{slot.vehicleNumber}<br />{formatEntryTime(slot.entryTime)}<br />{slot.transactionId}</Tooltip>}
                    >
                        <button className={`min-width-height btn btn-sm rounded-0 ${slot.status === 'available' ? "btn-success" : slot.status === "reserved" ? "btn-warning" : "btn-danger"}`} type="button">{slot.slotNumber}</button>
                    </OverlayTrigger>
                ) : slot.status === 'reserved' ?
                    <OverlayTrigger
                        key={slot.slotId ?? slot.id}
                        placement="bottom"
                        overlay={<Tooltip id="button-tooltip">Reserved</Tooltip>}
                    >
                        <button className={`min-width-height btn btn-warning btn-sm rounded-0`} type="button">{slot.slotNumber}</button>
                    </OverlayTrigger>
                    : (
                        <button key={slot.slotId ?? slot.id} className={`min-width-height btn btn-sm rounded-0 ${slot.status === 'available' ? "btn-success" : slot.status === "reserved" ? "btn-warning" : "btn-danger"}`} type="button">{slot.slotNumber}</button>
                    )
            ))}</div>
        </div>
    )
}
