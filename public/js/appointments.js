// public/js/appointments.js

document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'http://localhost:3000';
  const form   = document.getElementById('appointmentForm');
  const tbody  = document.getElementById('appointmentsBody');
  const userIn = document.getElementById('userId');

  // Load & render appointments for a specific user
  async function loadAppointments(userId) {
    tbody.innerHTML = '<tr><td colspan="8">Loading…</td></tr>';
    try {
      const res = await fetch(`${API_BASE}/appointments/user/${userId}`);
      if (!res.ok) {
        let msg = res.statusText;
        try { msg = (await res.json()).message || msg; } catch {}
        throw new Error(msg);
      }
      const list = await res.json();
      if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">No appointments found.</td></tr>';
        return;
      }
      tbody.innerHTML = list.map(a => `
        <tr>
          <td>${a.appointment_id}</td>
          <td>${a.user_id}</td>
          <td>${a.clinic_id}</td>
          <td>${new Date(a.appointment_date).toLocaleDateString()}</td>
          <td>${a.appointment_time}</td>
          <td>${a.doctor_name}</td>
          <td>${a.location}</td>
          <td>${a.reminder_enabled ? '✅' : '—'}</td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="8">Error: ${err.message}</td></tr>`;
    }
  }

  // When User ID changes, reload appointments
  userIn.addEventListener('change', () => {
    const uid = Number(userIn.value.trim());
    if (uid) loadAppointments(uid);
  });

  // On form submit, POST new appointment then reload
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const uid = Number(userIn.value.trim());
    if (!uid) {
      return alert('Please enter a valid User ID');
    }

    const payload = {
      user_id:           uid,
      clinic_id:         Number(document.getElementById('clinicId').value),
      appointment_date:  document.getElementById('appointmentDate').value,
      appointment_time:  document.getElementById('appointmentTime').value,
      doctor_name:       document.getElementById('doctorName').value.trim(),
      location:          document.getElementById('location').value.trim(),
      reminder_enabled:  document.getElementById('reminderEnabled').checked
    };

    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
      if (!res.ok) {
        let msg = res.statusText;
        try { msg = (await res.json()).message || msg; } catch {}
        throw new Error(msg);
      }
      form.reset();
      loadAppointments(uid);
    } catch (err) {
      alert('Error creating appointment: ' + err.message);
    }
  });
});
