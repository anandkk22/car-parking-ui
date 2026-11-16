export async function getAllFloors() {
    const response = await fetch('http://localhost:8080/api/v1/floor/all');
    if (!response.ok) {
        throw Object.assign(new Error(response.statusText), { status: response.status });
    }
    const data = await response.json();
    return data;
}

export function formatPrice(amount) {
   return amount > 0
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount)
    : '';
}

export function handleCheckInPrint(printRef) {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (!printWindow) {
            throw new Error('The print window was blocked. Please allow pop-ups and try again.');
        }
        printWindow.document.write(`
        <html>
        <head>
            <title>Print</title>
            <style>
                @page {
                    size: 80mm auto; /* Thermal printer */
                    margin: 5mm;
                }

                body {
                    width: 80mm;
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                }

                @media print {
                    body {
                        width: 80mm;
                    }
                }
            </style>
        </head>
        <body>
            ${printRef}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}