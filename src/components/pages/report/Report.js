import { Modal } from 'react-bootstrap';
import './Report.css'
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchDailyReport, formatDate, checkout, payment } from '../../../services/authServices';
import { PriceDisplay } from '../../../services/service';
import Form from 'react-bootstrap/Form';
import { useCheckInOut } from '../../../context/CheckinContext';
import { CheckoutPage } from '../checkout/CheckoutPage';
import Pagination from 'react-bootstrap/Pagination';

export const Report = ({ setcheckoutSlot, checkoutSlot, onCheckoutCompleted }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const { checkOutSlot, checkInVersion } = useCheckInOut();
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
    const [selectedTrId, setSelectedTrId] = useState('');
    const [selectgedDefaultPayment, setSelectgedDefaultPayment] = useState('online');
    const [pricingType, setPricingType] = useState(false);
    const reportRows = search
        ? dailyReport.filter(({ vehicleNumber = '' }) =>
            String(vehicleNumber).toLowerCase().includes(search.toLowerCase())
        )
        : dailyReport;

    const paginatedRows = reportRows.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(reportRows.length / itemsPerPage);

    const fetchReport = useCallback(async () => {
        try {
            const data = await fetchDailyReport(fromDate, toDate);
            if (!Array.isArray(data)) {
                throw new Error("Invalid floors response");
            }
            setDailyReport([...data].sort((a, b) => Number(b.transactionId) - Number(a.transactionId)));            
            setCurrentPage(1);
        } catch (error) {
            toast.error(error.message);
        }
    }, [fromDate, toDate]);

    const items = Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return (
            <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
            >
                {page}
            </Pagination.Item>
        );
    });
    
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
                checkOutSlot(data);
                try {
                    await onCheckoutCompleted();
                } catch (error) {
                    toast.error(`Checkout succeeded, but the slot display could not be refreshed: ${error.message}`);
                }
                setSelectedVehicle(data);
                setSelectedTrId(selectedVehicle.transactionId)
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
    }, [fetchReport, checkInVersion])
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
                         reportRows.length > 0 && <div className="container">
                            <div class="table-responsive">
                                <table class="table">
                                    <thead class="table-active">
                                        <tr>
                                            <th scope="col">Id</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Car Number</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Floor No</th>
                                            <th scope="col">Slot No</th>
                                            <th scope="col">Entry</th>
                                            <th scope="col">Exit</th>
                                            <th scope="col">Total Hrs</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Payment</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Created</th>
                                            <th scope="col"></th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedRows.map((report) => (
                                            <tr key={report.transactionId}>
                                                <td>{report.transactionId}</td>
                                                <td>{formatDate(report.date, true)}</td>
                                                <td>{report.vehicleNumber}</td>
                                                <td>{report.pricingType}</td>
                                                <td className='text-center'>{report.floorId}</td>
                                                <td className='text-center'>{report.slotNumber}</td>
                                                <td>{formatDate(report.entryTime, false)}</td>
                                                <td>{report.exitTime ? formatDate(report.exitTime, false) : ' '}</td>
                                                <td>{report.totalHrs || ' '}</td>
                                                <td className='text-end'>{PriceDisplay(report.amount) || ' '}</td>
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
                            <div class="d-flex justify-content-end p-2">
                                {totalPages > 1 && (
                                    <Pagination className="mb-0">
                                        <Pagination.Prev
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage((page) => page - 1)}
                                        />
                                        {items}
                                        <Pagination.Next
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage((page) => page + 1)}
                                        />
                                    </Pagination>
                                )}
                            </div>
                        </div>
                    } {
                        reportRows.length === 0 && <div className='text-center'>No Records Found</div>
                    }

                </Modal.Body>
            </Modal>
            <CheckoutPage areYouSure={areYouSure} handleClose={handleClose} selectedVehicle={selectedVehicle} handleCancel={handleCancel} onConfirm={onConfirm} showPayment={showPayment} pricingType={pricingType} selectgedDefaultPayment={selectgedDefaultPayment} onPaymentSelection={onPaymentSelection} submitPayment={submitPayment}   />
        </div>
    )
}
