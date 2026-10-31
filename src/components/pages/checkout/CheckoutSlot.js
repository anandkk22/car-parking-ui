import { Modal, Button } from 'react-bootstrap';
import './CheckoutSlot.css'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchDailyReport, formatDate, checkout, payment, getAllParkedDetails } from '../../../services/authServices';
import { PriceDisplay } from '../../../services/service';
import Form from 'react-bootstrap/Form';

export const CheckoutSlot = ({ setcheckoutSlot, checkoutSlot }) => {
    const currentDate = new Date();
    const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const [dailyReport, setDailyReport] = useState([]);
    const [fromDate, setFromDate] = useState(date);
    const [toDate, setToDate] = useState(date);
    const [search, setSearch] = useState('');
    const [noRecords, setNoRecords] = useState(false);
    const [areYouSure, setAreYouSure] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState({});
    const [selectgedDefaultPayment, setSelectgedDefaultPayment] = useState('online');
    const [pricingType, setPricingType] = useState(false);
    const reportRows = search
        ? dailyReport.filter(({ vehicleNumber = '' }) =>
            String(vehicleNumber).toLowerCase().includes(search.toLowerCase())
        )
        : dailyReport;

    const fetchReport = async () => {
        try {
            const data = await fetchDailyReport(fromDate, toDate);
            if (!Array.isArray(data)) {
                throw new Error("Invalid floors response");
            }
            setNoRecords(data.length === 0);
            setDailyReport([...data].sort((a, b) => Number(b.transactionId) - Number(a.transactionId)));
        } catch (error) {
            toast.error(error.message);
        }
    };
    
    const handleClose = () => {
        setcheckoutSlot(false);
        setShowPayment(false);
        setAreYouSure(false);
        setFromDate(date)
        setToDate(date)
        setSelectgedDefaultPayment('online');
        setSearch('')
    }

    const handleCancel = () => {
        setcheckoutSlot(true);
        setAreYouSure(false);
    }

    const handleCheckout = (selected) => {
        setSelectedVehicle(selected);
        if(selected.pricingType !== 'free') {
            setPricingType(true)
        } else {
            setPricingType(false)
        }
        handleClose();
        setAreYouSure(true);
        setShowPayment(false)
    }

    const findVehicle = (searchTerm) => {
        setSearch(searchTerm);
    }

    async function onConfirm() {
        try {
            const data = await checkout(selectedVehicle.transactionId);
            if (data) {
                setSelectedVehicle(data);
                handleClose();
                setcheckoutSlot(false);
                setAreYouSure(false);
                setShowPayment(true)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const onPaymentSelection = (event) => {
        setSelectgedDefaultPayment(event.target.value);
    }

    async function submitPayment() {
        try {
            const data = await payment(selectedVehicle.transactionId, selectgedDefaultPayment);
            if (data) {
                fetchReport();
                toast.success("Checkout submitted successfully");
                handleClose();
                setcheckoutSlot(false);
                setAreYouSure(false);
                setShowPayment(false)
                setSearch('')
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchReport();
    }, [fromDate, toDate])
    return (
        <div>
            <Modal show={checkoutSlot} onHide={handleClose} modal-dialog centered size="xl" className='ps-3'>
                <Modal.Header closeButton>
                    <Modal.Title className='fs-5'>Report generated from {formatDate(fromDate, true)} to {formatDate(toDate, true)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='gap-2 d-flex'>
                        <Form.Group controlId="fromDate" className="d-flex mb-3">
                            <Form.Control className='w-15'
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="toDate" className="d-flex mb-3">
                            <Form.Control className='w-15'
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </Form.Group>
                        {
                            !noRecords &&
                            <Form.Group controlId="search" className="d-flex justify-content-end w-100 mb-3">
                                <Form.Control
                                    type="text" className='w-15'
                                    value={search} placeholder='Search By Vehicle Number'
                                    onChange={(e) => findVehicle(e.target.value)}
                                />
                            </Form.Group>
                        }
                    </div>
                    {
                        !noRecords && <div className="table-responsive">
                            <table className="table">
                                <thead className="table-active">
                                    <tr>
                                        <th width="5%">Id</th>
                                        <th width="10%">Date</th>
                                        <th width="12%">Vehicle Number</th>
                                        <th width="7%">Type</th>
                                        <th width="7%">Floor No</th>
                                        <th width="7%">Slot No</th>
                                        <th width="7%">Entry</th>
                                        <th width="7%">Exit</th>
                                        <th width="10%">Total Hrs</th>
                                        <th width="5%">Amount</th>
                                        <th width="5%">Payment</th>
                                        <th width="5%">Status</th>
                                        <th width="5%">Created</th>
                                        <th width="5%"></th>
                                        <th width="5%"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportRows.map((report) => (
                                            <tr key={report.transactionId}>
                                                <td>{report.transactionId}</td>
                                                <td>{formatDate(report.date, true)}</td>
                                                <td>{report.vehicleNumber}</td>
                                                <td>{report.pricingType}</td>
                                                <td>{report.floorId}</td>
                                                <td>{report.slotNumber}</td>
                                                <td>{formatDate(report.entryTime, false)}</td>
                                                <td>{report.exitTime ? formatDate(report.exitTime, false) : ' '}</td>
                                                <td>{report.totalHrs || ' '}</td>
                                                <td>{PriceDisplay(report.amount) || ' '}</td>
                                                <td>{report.modeOfPayment || ' '}</td>
                                                <td>{report.status}</td>
                                                <td>{report.status}</td>
                                                <td><i className="bi bi-printer-fill"></i></td>
                                                <td onClick={() => handleCheckout(report)}><i className="bi bi-cart4 cursor-pointer"></i></td>
                                            </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    } {
                        noRecords && <div className='text-center'>No Records Found</div>
                    }

                </Modal.Body>
            </Modal>
            <Modal show={areYouSure} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Are you Sure you?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="card border-0 fs-8">
                        <div class="card-body">
                            <p class="card-text mb-1">Receipt : <b>{selectedVehicle.transactionId}</b></p>
                            <p class="card-text mb-1">Pricing Type : <b>{selectedVehicle.pricingType}</b></p>
                            <p class="card-text mb-1">Car Number: <b>{selectedVehicle.vehicleNumber}</b></p>
                            <p class="card-text mb-1">Entry: <b>{formatDate(selectedVehicle.entryTime, false)}</b></p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type='button' variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type='button' variant="success" onClick={onConfirm} >
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showPayment} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{pricingType ? 'Select Payment Mode': 'Checkout'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="card border-0 fs-8">
                        <div class="card-body pt-0 pb-0">
                            <table>
                                <tr class="thead-light">
                                    <td className='p-1'>Receipt:</td>
                                    <td className='p-1'><b>{selectedVehicle.transactionId}</b></td>
                                    <td className='p-1'>Pricing Type:</td>
                                    <td className='p-1'><b>{selectedVehicle.pricingType}</b></td>
                                </tr>
                                <tr class="thead-light">
                                    <td className='p-1'>Car Number:</td>
                                    <td className='p-1'><b>{selectedVehicle.vehicleNumber}</b></td>
                                    <td className='p-1'></td>
                                    <td className='p-1'></td>
                                </tr>
                                <tr class="thead-light">
                                    <td className='p-1'>CheckIn:</td>
                                    <td className='p-1'><b>{formatDate(selectedVehicle.entryTime, false)}</b></td>
                                    <td className='p-1'>CheckOut:</td>
                                    <td className='p-1'><b>{formatDate(selectedVehicle.exitTime, false)}</b></td>
                                </tr>
                                 <tr class="thead-light">
                                    <td className='p-1'>Total Hours:</td>
                                    <td className='p-1'><b>{selectedVehicle.totalHrs}</b></td>
                                    <td className='p-1'>Amount:</td>
                                    <td className='p-1'><b>{selectedVehicle.amount}</b></td>
                                </tr>
                            </table>
                            {pricingType &&
                                <div className="form-group mt-4 p-1">
                                <label htmlFor="paymentMode" className=''>Select Payment Mode</label>
                                <div className='d-flex mb-2'>
                                    <div className="form-check me-3">
                                        <input className="form-check-input" type="radio" name="payment" defaultChecked={selectgedDefaultPayment} id="online" value="online"
                                            onChange={onPaymentSelection} />
                                        <label className="form-check-label" for="online">
                                            Online
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="payment" id="cash" value="cash"
                                            onChange={onPaymentSelection} />
                                        <label className="form-check-label" for="cash">
                                            Cash
                                        </label>
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type='button' variant="success" onClick={submitPayment} >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
