import { Modal } from 'react-bootstrap';
import './Report.css'
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchDailyReport, formatDate, checkout, payment, getAllParkedDetails } from '../../../services/authServices';
import { formatPrice } from '../../../services/service';
import Form from 'react-bootstrap/Form';
import { useCheckInOut } from '../../../context/CheckinContext';
import { CheckoutPage } from '../checkout/CheckoutPage';
import Pagination from 'react-bootstrap/Pagination';
import { handleCheckInPrint } from '../../../services/service';
import { getPrintSlotContents } from '../../other/PrintSlot';


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
 * @property {string} lastModifiedBy
 */


export const Report = ({ setcheckoutSlot, checkoutSlot, onCheckoutCompleted, setIsCheckout, isCheckout }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const { checkOutSlot, checkInVersion } = useCheckInOut();
    const currentDate = new Date();
    const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const [report, setDailyReport] = useState([]);
    const [report1, setDailyReport1] = useState([]);
    const [fromDate, setFromDate] = useState(date);
    const [toDate, setToDate] = useState(date);
    const [search, setSearch] = useState('');
    const [noRecords, setNoRecords] = useState(false);
    const [areYouSure, setAreYouSure] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(/** @type {VehicleProps} */({ address: '', amount: 0, customerName: '', date: '', entryTime: '', exitTime: '', mobileNumber: '', pricingType: '', slotId: 0, slotNumber: 0, status: '', totalHrs: '', transactionId: 0, vehicleNumber: '' }));
    const [selectgedDefaultPayment, setSelectgedDefaultPayment] = useState('online');
    const [pricingType, setPricingType] = useState(false);
    const normalizedSearch = search.trim().toLowerCase();
    const [total, setTotal] = useState(0);
    const [paymentTypes, setPaymentTypes] = useState({
        online: true,
        cash: true,
    });
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
    // console.log('paymentTypes', paymentTypes);
    // console.log('reportRows', reportRows);
    // const updatedReport = [...reportRows];

    

    const totalPages = Math.ceil(reportRows.length / itemsPerPage);

    const fetchReport = useCallback(async () => {
        try {
            const data = isCheckout ? await getAllParkedDetails() : await fetchDailyReport(fromDate, toDate);
            setTotal(data.map((item) => item.amount).reduce((a, c) => a + c, 0));
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

    const handlePaymentTypeChange = (type) => {
        const updatedPaymentTypes = {
            ...paymentTypes,
            [type]: !paymentTypes[type],
        };
        setPaymentTypes(updatedPaymentTypes);
        
        const updatedReport = [...report];
        
        const selectedTypes = Object.keys(updatedPaymentTypes).filter(
            (paymentType) => updatedPaymentTypes[paymentType]
        );
        
        const x = updatedReport.filter((ele) => selectedTypes.includes(ele.modeOfPayment))
        setDailyReport1(x);
        console.log('x', x);
        console.log('report1', report1);

        // setDailyReport(
        //     selectedTypes.length === 0
        //         ? []
        //         : report.filter((ele) => selectedTypes.includes(ele.modeOfPayment))
        // );
        // switch (updatedPaymentTypes) {
        //     case updatedPaymentTypes.online && updatedPaymentTypes.cash:
        //         // setPaymentTypes({ online: true, cash: true });
        //         return report;
        //     case updatedPaymentTypes.online && !updatedPaymentTypes.cash:
        //         // setPaymentTypes({ online: true, cash: false });
        //         setDailyReport(report.filter((ele) => ele.modeOfPayment === 'online'));
        //     case !updatedPaymentTypes.online && updatedPaymentTypes.cash:
        //         // setPaymentTypes({ online: false, cash: true });
        //         setDailyReport(report.filter((ele) => ele.modeOfPayment === 'cash'));
        // }
    };

    useEffect(() => {
        //  console.log('paymentTypes', paymentTypes);
        // const selectedType = Object.keys(paymentTypes).find(
        //     key => paymentTypes[key]
        // );
        // setDailyReport(report.filter((ele) => paymentTypes[ele.modeOfPayment]));
        
    }, [paymentTypes, report]);

    useEffect(() => {
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
                handlePrint(data);
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

    const handlePrint = (report) => {
        const updatedReport = {
            ...report,
            exitTime: report.exitTime ? report.exitTime : ' ',
            totalHrs: report.exitTime ? report.totalHrs : ' ',
            amount: report.exitTime ? report.amount : ' '
        }
        try {
            handleCheckInPrint(getPrintSlotContents(updatedReport));
        } catch (error) {
            toast.error(error.message);
        }
    }
    return (
        <div>
            <Modal show={checkoutSlot} onHide={handleClose} keyboard={false} backdrop="static" modal-dialog centered size="xl" className='ps-3'>
                <Modal.Header closeButton>
                    <Modal.Title className='fs-5'>Report generated from {formatDate(fromDate, 'ddMMM')} to {formatDate(toDate, 'ddMMM')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='gap-2 d-flex ps-2 pe-1'>
                        <div className='container pe-2'>
                            <div className='row'>
                                {
                                    !isCheckout && <div className='col-sm-8 ps-1 gap-2 d-flex align-items-center'>
                                        <div className='col-sm-3'>
                                            <Form.Group controlId="fromDate" className="d-flex mb-3">
                                                <Form.Control className='w-15'
                                                    type="date"
                                                    value={fromDate}
                                                    onChange={(e) => setFromDate(e.target.value)}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className='col-sm-3'>
                                            <Form.Group controlId="toDate" className="d-flex mb-3">
                                                <Form.Control className='w-15'
                                                    type="date"
                                                    value={toDate}
                                                    onChange={(e) => setToDate(e.target.value)}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className='col-sm-3 w-120px'>
                                            <Form.Group controlId="toDate" className="fs-14 d-flex mb-3">
                                                Payment Type:
                                            </Form.Group>
                                        </div>
                                        <div className='col-sm-3 mb-2'>
                                            <Form.Group controlId="paymentTypes" className="gap-2 d-flex">
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Online"
                                                    checked={paymentTypes.online}
                                                    onChange={() => handlePaymentTypeChange('online')}
                                                />

                                                <Form.Check
                                                    type="checkbox"
                                                    label="Cash"
                                                    checked={paymentTypes.cash}
                                                    onChange={() => handlePaymentTypeChange('cash')}
                                                />
                                            </Form.Group>
                                        </div>
                                    </div>
                                }

                                <div className={`d-flex justify-content-end align-items-center ${isCheckout ? 'col-sm-12' : 'col-sm-4'}`}>
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
                        </div>
                    </div>
                    {
                        reportRows.length > 0 && <div className="container">
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered p-2">
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
                                                <td>{formatDate(report.date, 'ddMMM')}</td>
                                                <td>{report.vehicleNumber}</td>
                                                <td>{report.pricingType}</td>
                                                <td className='text-center'>{report.floorId}</td>
                                                <td className='text-center'>{report.slotNumber}</td>
                                                <td>{formatDate(report.entryTime, 'ddMMMyyyy')}</td>
                                                <td>{report.exitTime && report.status === 'Exit' ? formatDate(report.exitTime, 'ddMMMyyyy') : ' '}</td>
                                                <td>{report.status === 'Exit' ? report.totalHrs || ' ' : ''}</td>
                                                <td className='text-end'>{report.status === 'Exit' ? formatPrice(report.amount) || ' ' : ''}</td>
                                                <td>{report.modeOfPayment || ' '}</td>
                                                <td>{report.status}</td>
                                                <td>{report.lastModifiedBy || ''}</td>
                                                <td><button type="button" className="btn btn-link p-0 text-reset" aria-label="print" onClick={() => handlePrint(report)}><i className="bi bi-printer-fill cursor-pointer color-blue"></i></button></td>
                                                <td><button type="button" className="btn btn-link p-0 text-reset" disabled={report.status === 'Exit'} key={report.transactionId} onClick={() => handleCheckout(report)} aria-label="Checkout"><i className={`bi bi-taxi-front cursor-pointer ${report.status === 'Exit' ? 'color-gray' : 'color-blue'}`}></i></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {!isCheckout && 
                            <div className='d-inline justify-content-end'>
                                <p className='p-0 m-0'>Total: <span className='fw-bold'>{formatPrice(total)}</span></p>
                                <p>Total Parked: <span className='fw-bold'>{report.length}</span></p>
                            </div> }
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
