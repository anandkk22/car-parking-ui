function getSession() {
    const token = JSON.parse(sessionStorage.getItem('token'));

    return { token: token }
}

export async function getUser() {
    const browserData = getSession();
    const requestOption = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${browserData.token}` }
    }

    const response = await fetch('http://localhost:8080/users/me', requestOption)
    if (!response.ok) {
        throw Object.assign(new Error(response.statusText), { status: response.status });
    }
    const data = await response.json();
    return data;
}

export async function login(authDetails) {
    const requestOption = {
        method: 'POST',
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(authDetails)
    }

    const response = await fetch('http://localhost:8080/auth/login', requestOption);
    if (!response.ok) {
        throw Object.assign(new Error(response.statusText), { status: response.status });
    }
    const data = await response.json();

    if (data.token) {
        sessionStorage.setItem("token", JSON.stringify(data.token));
    }
    return data;
}

export async function register(authDetails) {
    const requestOption = {
        method: 'POST',
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(authDetails)
    }

    const response = await fetch('http://localhost:8080/auth/signup', requestOption);
    if (!response.ok) {
        throw Object.assign(new Error(response.statusText), { status: response.status });
    }
    const data = await response.json();
    return data;
}

export async function getAllFloors() {
    const browserData = getSession();
    const requestOption = {
        method: 'GET',
        headers: { "content-Type": "application/json", Authorization: `Bearer ${browserData.token}` }
    }

    const response = await fetch('http://localhost:8080/api/v1/floor/all', requestOption);
    if (!response.ok) {
        throw Object.assign(new Error(response.statusText), { status: response.status });
    }
    const data = await response.json();
    return data;
}

export async function getParkingSlots() {
    const browserData = getSession();
    const requestOption = {
        method: 'GET',
        headers: { "content-Type": "application/json", Authorization: `Bearer ${browserData.token}` }
    }
    const response = await fetch('http://localhost:8080/api/v1/parkingslot/all', requestOption);
    if (!response.ok) {
        throw Object.assign(new Error(response.statusText), { status: response.status });
    }
    const data = await response.json();
    return data;
}

export async function getAllParkedDetails() {
    const browserData = getSession();
    const requestOption = {
        method: 'GET',
        headers: { "content-Type": "application/json", Authorization: `Bearer ${browserData.token}` }
    }
    const response = await fetch('http://localhost:8080/api/v1/parkingslot/parked', requestOption);
    if (!response.ok) {
        throw Object.assign(new Error(response.statusText), { status: response.status });
    }
    const data = await response.json();
    return data;
}

export async function addFloor(floorDetails) {
    const browserData = getSession();
    const requestOption = {
        method: 'POST',
        headers: { "content-Type": "application/json", Authorization: `Bearer ${browserData.token}` },
        body: JSON.stringify(floorDetails)
    }
    const response = await fetch('http://localhost:8080/api/v1/floor/add', requestOption);
    if (!response.ok) {
       const errorData = await response.json();
        throw new Error(errorData.error);
    }
    const data = await response.json();
    return data;
}

export async function addNewSlot(slotDetails) {
    const browserData = getSession();
    const requestOption = {
        method: 'POST',
        headers: { "content-Type": "application/json", Authorization: `Bearer ${browserData.token}` },
        body: JSON.stringify(slotDetails)
    }
    const response = await fetch('http://localhost:8080/api/v1/parkingslot', requestOption);
    if (!response.ok) {
       const errorData = await response.json();
        throw new Error(errorData.error);
    }
    const data = await response.json();
    return data;
}

export async function allocateNewSlot(slotDetails) {
   const browserData = getSession();
    const requestOption = {
        method: 'POST',
        headers: { "content-Type": "application/json", Authorization: `Bearer ${browserData.token}` },
        body: JSON.stringify(slotDetails)
    }
    const response = await fetch('http://localhost:8080/api/v1/parkingslot/allocateParking', requestOption);
    if (!response.ok) {
       const errorData = await response.json();
        throw new Error(errorData.error);
    }
    const data = await response.json();
    return data;

}

export function logout() {
    sessionStorage.removeItem("token");
}

