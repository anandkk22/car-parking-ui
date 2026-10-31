export async function getAllFloors() {
    const response = await fetch('http://localhost:8080/api/v1/floor/all');
    if (!response.ok) {
        throw Object.assign(new Error(response.statusText), { status: response.status });
    }
    const data = await response.json();
    return data;
}

export function PriceDisplay(amount) {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0 // Optional: removes paise decimal points
  }).format(amount);

  return <p> {amount > 0 ? formattedPrice : ' '}</p>; // Outputs: ₹1,50,000
}