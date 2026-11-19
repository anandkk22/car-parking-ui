import { Modal, Button } from 'react-bootstrap';

export const ViewFloor = ({ viewFloorDetails, setViewFloorDetails, floors, floorDetails }) => {
    const detailsFloor = Object.keys(floorDetails?.[0] ?? {});

    const handleClose = () => {
        setViewFloorDetails(false);
    }

    return (
        <div>
            <Modal show={viewFloorDetails} onHide={handleClose} keyboard={false} backdrop="static" centered>
                <Modal.Header closeButton>
                    <Modal.Title>View Floor Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="table table-striped table-bordered p-2 m-0">
                        <thead className='thead-light'>
                            <tr>
                                <th scope="col">Floor No</th>
                                <th scope="col">Total Slots</th>
                                <th scope="col">Available</th>
                                <th scope="col">Occupied</th>
                                <th scope="col">Reserved</th>
                            </tr>
                        </thead>
                        <tbody>
                            {floorDetails.map((detail, index) => (
                                <tr key={detail.id ?? floors[index]?.id ?? index}>
                                    <td className='fs-14'>Floor {floors[index]?.description}</td>
                                    {detailsFloor.map((key) => (
                                        <td key={key} className={`text-center fs-14 ${key === 'Available' ? 'text-success' : key === 'Occupied' ? 'text-danger' : key === 'Reserved' ? 'text-warning' : 'text-secondary'}`}>{detail[key]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button type='button' variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
