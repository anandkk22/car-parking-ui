import { Modal, Button } from 'react-bootstrap';
import { formatDate } from '../../../services/authServices';

export const CheckoutPage = ({ areYouSure, handleClose, selectedVehicle, handleCancel, showPayment, onConfirm, pricingType, selectgedDefaultPayment, onPaymentSelection, submitPayment  }) => {
    return (
        <>
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
                    <Modal.Title>{pricingType ? 'Select Payment Mode' : 'Checkout'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="card border-0 fs-8">
                        <div class="card-body pt-0 pb-0">
                            <table>
                                <tbody>
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
                                </tbody>
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
        </>

    )
}
