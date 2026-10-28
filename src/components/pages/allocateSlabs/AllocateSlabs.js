import { useEffect, useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { allocateNewSlot } from '../../../services/authServices'
import { toast } from 'react-toastify';
import './AllocateSlabs.css'

export const AllocateSlabs = ({ allocateNewSlab, setAllocateNewSlab, onSlotAllocated }) => {
    const printRef = useRef();
    const currentDate = new Date();
    const typeOfParking = [{ id: 1, name: 'Hourly', value: 'hourly' }, { id: 2, name: 'Fixed', value: 'fixed' }, { id: 3, name: 'Free', value: 'free' }];
    const [selectedVehicleType, setSelectedVehicleType] = useState('regular');
    const [disabled, setDisabled] = useState(false);
    const [print, setPrint] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [pricingType, setPricingType] = useState(typeOfParking[0].value);

    const [regState, setRegState] = useState('');
    const [regCityNumber, setRegCityNumber] = useState('');
    const [regAlpha, setRegAlpha] = useState('');
    const [regFourDigit, setRegFourDigit] = useState('');

    const [bhYear, setBhYear] = useState('');
    const [bhName, setBhName] = useState('BH');
    const [bhFourDigit, setBhFourDigit] = useState();
    const [bhAlha, setBhAlha] = useState();

    const [customerName, setCustomerName] = useState();
    const [mobileNumber, setMobileNumber] = useState();
    const [address, setAddress] = useState();
    const date = currentDate.toLocaleDateString();
    const formatEntryTime = (entryTime) => {
        const entryDate = new Date(entryTime);
        if (Number.isNaN(entryDate.getTime())) return entryTime;
        const pad = (value) => String(value).padStart(2, '0');
        return `${pad(entryDate.getDate())}/${pad(entryDate.getMonth() + 1)}/${entryDate.getFullYear()} ${pad(entryDate.getHours())}:${pad(entryDate.getMinutes())}`;
    };

    const handleClose = () => {
        setAllocateNewSlab(false);
        setSelectedVehicleType('regular')
        setPricingType('');
        setRegState('');
        setRegCityNumber('');
        setRegAlpha('');
        setRegFourDigit('');
        setBhYear('');
        setBhFourDigit('');
        setBhAlha('')
    }
    const onVehicleTypeChange = (event) => {
        setSelectedVehicleType(event.target.value);
        if (selectedVehicleType === 'regular') {
            setBhYear('')
            setBhFourDigit('');
            setBhAlha('')
        } else {
            setRegState('');
            setRegCityNumber('');
            setRegAlpha('');
            setRegFourDigit('');
        }
    }

    useEffect(() => {
        if (selectedVehicleType === 'regular') {
            setDisabled(!regState || !regCityNumber || !regAlpha || !regFourDigit || regCityNumber == 0 || regFourDigit == 0)
        } else {
            setDisabled(!bhYear || !bhFourDigit || !bhAlha || bhYear == 0 || bhFourDigit == 0)
        }
    }, [regState, regCityNumber, regAlpha, regFourDigit, bhYear, bhFourDigit, bhAlha])

    const handleRegState = (e) => {
        const inputValue = e.target.value.toUpperCase();
        if (/^[A-Za-z]{0,2}$/.test(inputValue)) {
            setRegState(inputValue);
        }
    }
    const handleRegAlpha = (e) => {
        const inputValue = e.target.value.toUpperCase();
        if (/^[A-Za-z]{0,2}$/.test(inputValue)) {
            setRegAlpha(inputValue);
        }
    }
    const handleCityNumber = (e) => {
        const inputValue = e.target.value;
        if (/^\d{0,2}$/.test(inputValue)) {
            setRegCityNumber(inputValue);
        }
    }
    const handleRegFourDigit = (e) => {
        const inputValue = e.target.value;
        if (/^\d{0,4}$/.test(inputValue)) {
            setRegFourDigit(inputValue);
        }
    }

    const handleBhYear = (e) => {
        const inputValue = e.target.value;
        if (/^\d{0,2}$/.test(inputValue)) {
            setBhYear(inputValue);
        }
    }

    const handleBhFourDigit = (e) => {
        const inputValue = e.target.value;
        if (/^\d{0,4}$/.test(inputValue)) {
            setBhFourDigit(inputValue);
        }
    }
    const handleBhAlha = (e) => {
        const inputValue = e.target.value.toUpperCase();
        if (/^[A-Za-z]{0,2}$/.test(inputValue)) {
            setBhAlha(inputValue);
        }
    }
    async function allocateSlot(event) {
        event.preventDefault();
        try {
            const allocateSlotDetails = {
                vehicleNumber: selectedVehicleType === 'regular' ? `${regState}-${regCityNumber} ${regAlpha}-${regFourDigit}` : `${bhYear}-${bhName} ${bhFourDigit}-${bhAlha}`,
                pricingType: pricingType,
                customerName: customerName,
                mobileNumber: mobileNumber,
                address: address
            }
            const data = await allocateNewSlot(allocateSlotDetails);
            if (data) {
                setResponseData(data);
                setPrint(true);
                setAllocateNewSlab(false);
                handleClose();
                toast.success("Allocated Slot successfully");
                try {
                    await onSlotAllocated();
                } catch (error) {
                    toast.error(`Slot allocated, but the slot display could not be refreshed: ${error.message}`);
                }
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const printAndClose = () => {
        setPrint(false)
    }

    const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();

    printAndClose();
  };
    return (
        <div>
            <Modal show={allocateNewSlab} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Allocate Slot</Modal.Title>
                </Modal.Header>
                <form className="flex items-center" onSubmit={allocateSlot} >
                    <Modal.Body>
                        <label htmlFor="vehicleNumber" className='required-label'>Type of Parking</label>
                        <select className="form-select form-select-sm" aria-label=".form-select-sm example" required value={pricingType}
                            onChange={(e) => setPricingType(e.target.value)}>
                            {
                                typeOfParking.map((parkType) => (
                                    <option value={parkType.value}>{parkType.name}</option>
                                ))
                            }
                        </select>

                        <div className="form-group mt-4">
                            <label htmlFor="vehicleNumber" className='required-label'>Vehicle Registration Type</label>
                            <div className='d-flex mb-2'>
                                <div className="form-check me-3">
                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked={selectedVehicleType} value="regular"
                                        checked={selectedVehicleType === 'regular'} onChange={onVehicleTypeChange} />
                                    <label className="form-check-label" for="flexRadioDefault1">
                                        Regular
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="bhSeries"
                                        checked={selectedVehicleType === 'bhSeries'} onChange={onVehicleTypeChange} />
                                    <label className="form-check-label" for="flexRadioDefault2">
                                        BH Series
                                    </label>
                                </div>
                            </div>
                        </div>
                        {selectedVehicleType === 'regular' && (
                            <div className='ms-4 d-flex w-75 gap-2'>
                                <input type="text" className="w-50 text-center form-control" maxLength={2} onChange={handleRegState} value={regState} />
                                <input type="number" className="w-50 text-center form-control" onChange={handleCityNumber} value={regCityNumber} />
                                <input type="text" className="w-50 text-center form-control" maxLength={2} onChange={handleRegAlpha} value={regAlpha} />
                                <input type="number" className="w-75 text-center form-control" maxLength={4} onChange={handleRegFourDigit} value={regFourDigit} />
                            </div>
                        )}
                        {selectedVehicleType === 'bhSeries' && (
                            <div>
                                <div className='ms-4 d-flex w-75 gap-2'>
                                    <input type="number" className="w-25 text-center form-control" onChange={handleBhYear} value={bhYear} />
                                    <input type="text" className="w-25 text-center form-control" disabled value={bhName} />
                                    <input type="number" className="w-50 text-center form-control" onChange={handleBhFourDigit} value={bhFourDigit} />
                                    <input type="text" className="w-25 text-center form-control" onChange={handleBhAlha} value={bhAlha} />
                                </div>
                            </div>
                        )}
                        <div className="form-group mt-4">
                            <label htmlFor="customerName">Customer Name</label>
                            <input type="text" className="form-control" id="customerName" aria-describedby="customerName" placeholder="Enter Customer Name" value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)} />
                        </div>
                        <div className="form-group mt-4">
                            <label htmlFor="mobileNumber">Mobile Number</label>
                            <input type="number" className="form-control" id="mobileNumber" aria-describedby="customerName" placeholder="Enter Customer Mobile Number" value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)} />
                        </div>
                        <div className="form-group mt-4">
                            <label htmlFor="address">Customer Address</label>
                            <input type="text" className="form-control" id="address" aria-describedby="address" placeholder="Enter Customer Address" value={address}
                                onChange={(e) => setAddress(e.target.value)} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='button' variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type='submit' variant="success" disabled={disabled} >
                            Add
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal show={print} onHide={printAndClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Shree Car Parking</Modal.Title>
                </Modal.Header>                
                    <Modal.Body ref={printRef}>
                        <div className='row'>
                            <div className='container d-flex mb-2'>
                                <div className='col-sm-6'>Date: <span className='fw-bold'>{date}</span></div>
                                <div className='col-sm-6'>Transaction Number: <span className='fw-bold'>{responseData?.transactionId}</span></div>
                            </div>
                            <div className='container d-flex mb-2'>
                                <div className='col-sm-6'>Floor: <span className='fw-bold'>{responseData?.floorId}</span></div>
                                <div className='col-sm-6'>Slot Number: <span className='fw-bold'>{responseData?.slotNumber}</span></div>
                            </div>
                            <div className='container d-flex mb-2'>
                                <div className='col-sm-6'>Car Number: <span className='fw-bold'>{responseData?.vehicleNumber}</span></div>
                                <div className='col-sm-6'>Entry: <span className='fw-bold'>{formatEntryTime(responseData?.entryTime)}</span></div>
                            </div>
                        </div>
                        <div className='row mt-2'><div className='container'><p className='fontsize-10'>Note: "Car Parked at Owner's Risk"<br /> Time: 9.00am to 9.00pm</p></div></div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='button' variant="success" onClick={handlePrint} >
                            Print
                        </Button>
                    </Modal.Footer>
            </Modal>
        </div>
    )
}
