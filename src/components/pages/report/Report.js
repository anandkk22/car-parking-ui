import { Modal } from 'react-bootstrap';
import './Report.css'
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchDailyReport, formatDate, checkout, payment, getAllParkedDetails } from '../../../services/authServices';
import { PriceDisplay } from '../../../services/service';
import Form from 'react-bootstrap/Form';
import { useCheckInOut } from '../../../context/CheckinContext';
import { CheckoutPage } from '../checkout/CheckoutPage';
import Pagination from 'react-bootstrap/Pagination';
// import { VehicleProps } from './VehicleProps'


/**
 * @typedef {Object} VehicleProps
 * @property {string} address
 * @property {number} amount
 * @property {string} customerName
 * @property {string} date
 * @property {string} entryTime
 * @property {string} exitTime
 * @property {number} floorId
 * @property {string} mobileNumber
 * @property {string} modeOfPayment
 * @property {string} pricingType
 * @property {number} slotId
 * @property {number} slotNumber
 * @property {string} status
 * @property {string} totalHrs
 * @property {number} transactionId
 * @property {string} vehicleNumber
 */


export const Report = ({ setcheckoutSlot, checkoutSlot, onCheckoutCompleted, setIsCheckout, isCheckout }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const { checkOutSlot, checkInVersion } = useCheckInOut();
    const currentDate = new Date();
    const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const [report, setDailyReport] = useState([]);
    const [fromDate, setFromDate] = useState(date);
    const [toDate, setToDate] = useState(date);
    const [search, setSearch] = useState('');
    const [noRecords, setNoRecords] = useState(false);
    const [areYouSure, setAreYouSure] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(/** @type {VehicleProps} */({address: '', amount: 0, customerName: '', date: '', entryTime: '', exitTime: '', mobileNumber: '', pricingType: '', slotId: 0, slotNumber: 0, status : '', totalHrs : '', transactionId: 0, vehicleNumber: '' }));
    const [selectgedDefaultPayment, setSelectgedDefaultPayment] = useState('online');
    const [pricingType, setPricingType] = useState(false);
    const normalizedSearch = search.trim().toLowerCase();
    // let selectedTrId = '';
    const reportRows = useMemo(() => {
        const baseRows = isCheckout
            ? report.filter(({ status = '' }) => status === 'occupied' || status === 'Ready to Exit')
            : report;

        if (!normalizedSearch) {
            return baseRows;
        }

        return baseRows.filter(({ vehicleNumber = '' }) =>
            String(vehicleNumber).toLowerCase().includes(normalizedSearch)
        );
    }, [report, isCheckout, normalizedSearch]);

    const paginatedRows = reportRows.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(reportRows.length / itemsPerPage);

    const fetchReport = useCallback(async () => {
        try {
            const data = isCheckout ? await getAllParkedDetails() : await fetchDailyReport(fromDate, toDate);
            if (!Array.isArray(data)) {
                throw new Error("Invalid floors response");
            }
            setNoRecords(data.length === 0);
            setDailyReport([...data].sort((a, b) => Number(b.transactionId) - Number(a.transactionId)));
            setCurrentPage(1);
        } catch (error) {
            toast.error(error.message);
        }
    }, [fromDate, toDate, isCheckout]);

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
        setIsCheckout(false);
    }

    const handleCancel = () => {
        setcheckoutSlot(true);
        setAreYouSure(false);
    }
  
    const handleCheckout = (selected) => {
        setSelectedVehicle(selected);

        if (selected.pricingType !== 'free') {
            setPricingType(true);
        } else {
            setPricingType(false);
        }

        handleClose();

        if (selected.status === 'Ready to Exit') {
            onConfirm(selected);
            setShowPayment(true);
        } else {
            setAreYouSure(true);
        }
    };

    useEffect(() => {
        console.log('Updated:', selectedVehicle.transactionId);
    }, [selectedVehicle]);

    const findVehicle = (searchTerm) => {
        setSearch(searchTerm);
    }

    async function onConfirm(selected) {
        try {
            const data = await checkout(selected.transactionId ?? selectedVehicle.transactionId);
            if (data) {
                checkOutSlot(data);
                const transactionId = data.transactionId ?? selectedVehicle.transactionId;
                setDailyReport((currentReport) => currentReport.map((transaction) =>
                    String(transaction.transactionId) === String(transactionId)
                        ? { ...transaction, ...data, status: data.status || 'Ready to Exit' }
                        : transaction
                ));
                try {
                    await onCheckoutCompleted();
                } catch (error) {
                    toast.error(`Checkout succeeded, but the slot display could not be refreshed: ${error.message}`);
                }
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
    }, [fetchReport, checkInVersion])
    return (
        <div>
            <Modal show={checkoutSlot} onHide={handleClose} modal-dialog centered size="xl" className='ps-3'>
                <Modal.Header closeButton>
                    <Modal.Title className='fs-5'>Report generated from {formatDate(fromDate, true)} to {formatDate(toDate, true)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='gap-2 d-flex ps-2 pe-4'>
                        {
                            !isCheckout && <div className='col-sm-6 ps-1 gap-2 d-flex align-items-center'>
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
                            </div>
                        }

                        <div className={`d-flex justify-content-end align-items-center ${isCheckout ? 'col-sm-12' : 'col-sm-6'}`}>
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
                                                <td><button type="button" className="btn btn-link p-0 text-reset" aria-label="print"><i className="bi bi-printer-fill cursor-pointer color-blue"></i></button></td>
                                                <td><button type="button" className="btn btn-link p-0 text-reset" disabled={report.status === 'Exit'} key={report.transactionId} onClick={() => handleCheckout(report)} aria-label="Checkout"><i className={`bi bi-cart4 cursor-pointer ${report.status === 'Exit' ? 'color-gray' : 'color-blue'}`}></i></button></td>
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
            <CheckoutPage areYouSure={areYouSure} handleClose={handleClose} selectedVehicle={selectedVehicle} handleCancel={handleCancel} onConfirm={onConfirm} showPayment={showPayment} pricingType={pricingType} selectgedDefaultPayment={selectgedDefaultPayment} onPaymentSelection={onPaymentSelection} submitPayment={submitPayment} />
        </div>
    )
}
