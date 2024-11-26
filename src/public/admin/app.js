let token = localStorage.getItem('token');
const API_URL = '';

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            showEventPanel();
            loadEvents();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Error logging in');
    }
}
async function register() {
    const email = document.getElementById('email-register').value;
    const password = document.getElementById('password-register').value;
    const name = document.getElementById('name-register').value;

    if (!email || !password || !name) {
        alert('All fields are required');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, name })
        });

        const data = await response.json();
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            showEventPanel();
            loadEvents();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Error logging in');
    }
}
function showEventPanel() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('eventPanel').style.display = 'block';
}

async function loadEvents() {
    try {
        const response = await fetch(`${API_URL}/api/events`);
        const events = await response.json();
        displayEvents(events);
    } catch (error) {
        alert('Error loading events');
    }
}

function displayEvents(events) {
    const eventsListDiv = document.getElementById('eventsList');
    eventsListDiv.innerHTML = '';

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'col-md-4';
        eventCard.innerHTML = `
            <div class="card event-card">
                ${event.image ? 
                    `<img src="${event.image}" class="event-image" alt="${event.title}">` : 
                    '<div class="event-image bg-light d-flex align-items-center justify-content-center">No Image</div>'
                }
                <div class="card-body">
                    <h5 class="card-title">${event.title}</h5>
                    <p class="card-text">${new Date(event.date).toLocaleString()}</p>
                    <p class="card-text">${event.description || ''}</p>
                    <div class="event-actions">
                        <button onclick="editEvent('${event.id}')" class="btn btn-primary btn-sm">Edit</button>
                        <button onclick="deleteEvent('${event.id}')" class="btn btn-danger btn-sm">Delete</button>
                    </div>
                </div>
            </div>
        `;
        eventsListDiv.appendChild(eventCard);
    });
}

function toggleEventForm(show = true) {
    const form = document.getElementById('eventForm');
    form.style.display = show ? 'block' : 'none';
    if (show) {
        document.getElementById('formTitle').textContent = 'Add New Event';
        document.getElementById('eventId').value = '';
        document.getElementById('title').value = '';
        document.getElementById('date').value = '';
        document.getElementById('description').value = '';
        document.getElementById('image').value = '';
    }
}

async function saveEvent() {
    const eventId = document.getElementById('eventId').value;
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('image').files[0];

    if (!title || !date) {
        alert('Title and date are required');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('date', date);
    formData.append('description', description);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const url = eventId ? 
            `${API_URL}/api/events/${eventId}` : 
            `${API_URL}/api/events`;
        
        const response = await fetch(url, {
            method: eventId ? 'PUT' : 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            toggleEventForm(false);
            loadEvents();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        alert('Error saving event');
    }
}

async function editEvent(id) {
    try {
        const response = await fetch(`${API_URL}/api/events/${id}`);
        const event = await response.json();

        document.getElementById('eventId').value = event.id;
        document.getElementById('title').value = event.title;
        document.getElementById('date').value = new Date(event.date).toISOString().slice(0, 16);
        document.getElementById('description').value = event.description || '';
        
        document.getElementById('formTitle').textContent = 'Edit Event';
        toggleEventForm(true);
    } catch (error) {
        alert('Error loading event details');
    }
}

async function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/events/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            loadEvents();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        alert('Error deleting event');
    }
}

// Check if user is already logged in
if (token) {
    showEventPanel();
    loadEvents();
}