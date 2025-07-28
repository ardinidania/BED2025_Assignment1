let reminders = [];
let currentDay = 'Monday';
let editReminderId = null; // ID of reminder being updated

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Show add form
function toggleAddForm(editMode = false) {
  document.getElementById('addForm').style.display = 'block';
  document.getElementById('formDay').innerText = currentDay;
  document.getElementById('updateBtn').style.display = editMode ? 'inline-block' : 'none';
}

// Cancel and reset form
function cancelReminder() {
  document.getElementById('addForm').style.display = 'none';
  document.getElementById('taskInput').value = '';
  document.getElementById('timeInput').value = '';
  document.getElementById('typeInput').value = '';
  editReminderId = null;
  document.getElementById('updateBtn').style.display = 'none';
}

// Save for current day
function saveReminder() {
  const task = document.getElementById('taskInput').value;
  const time = document.getElementById('timeInput').value;
  const type = document.getElementById('typeInput').value;
  const token = localStorage.getItem("token");

  if (task && time && type) {
    const newReminder = { description: task, time, type, day: currentDay };

    fetch('/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(newReminder)
    })
      .then(res => res.ok ? (cancelReminder(), fetchReminders()) : alert('Failed to save reminder.'))
      .catch(err => console.error('Error saving reminder:', err));
  } else alert('Please fill in all fields!');
}

// Save for all days
function saveReminderForAllDays() {
  const task = document.getElementById('taskInput').value;
  const time = document.getElementById('timeInput').value;
  const type = document.getElementById('typeInput').value;
  const token = localStorage.getItem("token");

  if (task && time && type) {
    Promise.all(daysOfWeek.map(day =>
      fetch('/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ description: task, time, type, day })
      })
    ))
      .then(responses => responses.every(res => res.ok) ? (cancelReminder(), fetchReminders()) : alert('Some reminders failed to save.'))
      .catch(err => console.error('Error saving reminders for all days:', err));
  } else alert('Please fill in all fields!');
}

// Fetch reminders
function fetchReminders() {
  const token = localStorage.getItem("token");
  fetch('/reminders', { headers: { Authorization: `Bearer ${token}` } })
    .then(res => res.json())
    .then(data => { reminders = data; renderReminders(); })
    .catch(err => console.error('Error fetching reminders:', err));
}

// Render reminders with checkbox and update button
function renderReminders() {
  const list = document.getElementById('reminderList');
  list.innerHTML = '';

  reminders.filter(r => r.day === currentDay).forEach(reminder => {
    const div = document.createElement('div');
    div.classList.add('reminder-item');
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.padding = '10px 0';
    div.style.borderBottom = '1px solid #4a90e2';

    // Checkbox for delete
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('delete-checkbox');
    checkbox.style.marginRight = '10px';
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) deleteReminder(reminder.id);
    });

    // Reminder text
    const label = document.createElement('span');
    label.textContent = `${reminder.description} – ${reminder.time} (${reminder.type})`;
    label.style.flex = '1';

    // Update button (blue style)
    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Update';
    updateBtn.style.backgroundColor = '#007bff';
    updateBtn.style.color = 'white';
    updateBtn.style.border = 'none';
    updateBtn.style.padding = '6px 12px';
    updateBtn.style.borderRadius = '6px';
    updateBtn.style.cursor = 'pointer';
    updateBtn.onclick = () => loadReminderIntoForm(reminder);

    div.appendChild(checkbox);
    div.appendChild(label);
    div.appendChild(updateBtn);

    list.appendChild(div);
  });

  document.getElementById('reminderTitle').innerText = `Reminder for ${currentDay}:`;
}

// Load reminder into form for editing
function loadReminderIntoForm(reminder) {
  editReminderId = reminder.id;
  document.getElementById('taskInput').value = reminder.description;
  document.getElementById('timeInput').value = reminder.time;
  document.getElementById('typeInput').value = reminder.type;
  toggleAddForm(true);
}

// Update reminder
function updateReminder() {
  if (!editReminderId) return alert('No reminder selected for update.');

  const task = document.getElementById('taskInput').value;
  const time = document.getElementById('timeInput').value;
  const type = document.getElementById('typeInput').value;
  const token = localStorage.getItem("token");

  fetch(`/reminders/${editReminderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ description: task, time, type, day: currentDay })
  })
    .then(res => res.ok ? (cancelReminder(), fetchReminders()) : alert('Failed to update reminder.'))
    .catch(err => console.error('Error updating reminder:', err));
}

// Delete reminder
function deleteReminder(id) {
  const token = localStorage.getItem("token");
  fetch(`/reminders/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    .then(res => res.ok ? fetchReminders() : alert('Failed to delete reminder'))
    .catch(err => console.error('Error deleting reminder:', err));
}

// Day switching
document.querySelectorAll('.day-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    currentDay = button.dataset.day;
    renderReminders();
  });
});

// Initial fetch
fetchReminders();
