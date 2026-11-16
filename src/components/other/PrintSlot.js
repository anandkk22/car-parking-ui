import { formatDate } from '../../services/authServices';
import { formatPrice } from '../../services/service';

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
})[character]);

export const getPrintSlotContents = (report) => {
    const isExit = report?.status === 'Exit';
    const date = new Date();
    return `
        <table class="table table-borderless">
            <tr>
                <td colspan="2" class="text-center fw-bold">
                    Shree Car Parking Services
                </td>
            </tr>
            <tr>
                <td colspan="2">&nbsp;</td>
            </tr>
            <tr>
                <td>Date:</td>
                <td class="fw-bold">${escapeHtml(formatDate(date))}</td>
            </tr>

            <tr>
                <td>Receipt Number:</td>
                <td class="fw-bold">${escapeHtml(report?.transactionId)}</td>
            </tr>

            <tr>
                <td>Floor:</td>
                <td class="fw-bold">${escapeHtml(report?.floorId)}</td>
            </tr>

            <tr>
                <td>Slot Number:</td>
                <td class="fw-bold">${escapeHtml(report?.slotNumber)}</td>
            </tr>

            <tr>
                <td>Car Number:</td>
                <td class="fw-bold">${escapeHtml(report?.vehicleNumber)}</td>
            </tr>

            <tr>
                <td>Entry:</td>
                <td class="fw-bold">
                    ${escapeHtml(formatDate(report?.entryTime))}
                </td>
            </tr>

            ${
                isExit
                    ? `
            <tr>
                <td>Exit:</td>
                <td class="fw-bold">
                    ${escapeHtml(formatDate(report?.exitTime))}
                </td>
            </tr>

            <tr>
                <td>Total Hours:</td>
                <td class="fw-bold">
                    ${escapeHtml(report?.totalHrs)}
                </td>
            </tr>

            <tr>
                <td>Amount:</td>
                <td class="fw-bold">
                    ${escapeHtml(formatPrice(report?.amount))}
                </td>
            </tr>
            `
                    : ''
            }

            <tr>
                <td colspan="2">&nbsp;</td>
            </tr>

            <tr>
                <td colspan="2">
                    Note:
                    <span class="fw-bold">
                        Car Parked at Owner's Risk
                    </span>
                </td>
            </tr>

            <tr>
                <td colspan="2">
                    Time:
                    <span class="fw-bold">
                        9.00am to 9.00pm
                    </span>
                </td>
            </tr>
        </table>
    `;
};
