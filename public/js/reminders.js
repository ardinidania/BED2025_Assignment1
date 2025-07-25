let reminders = [];
let currentDay = 'Monday';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Show add form
function toggleAddForm() {
  document.getElementById('addForm').style.display = 'block';
  document.getElementById('formDay').innerText = currentDay;
}

// Cancel and reset form
function cancelReminder() {
  document.getElementById('addForm').style.display = 'none';
  document.getElementById('taskInput').value = '';
  document.getElementById('timeInput').value = '';
  document.getElementById('typeInput').value = '';
}

// ✅ NEW: Save same reminder for all 7 days
function saveReminderForAllDays() {
  const task = document.getElementById('taskInput').value;
  const time = document.getElementById('timeInput').value;
  const type = document.getElementById('typeInput').value;
  const token = localStorage.getItem("token");

  if (task && time && type) {
    const promises = daysOfWeek.map(day => {
      const reminder = {
        description: task,
        time,
        type,
        day
      };

      return fetch('/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reminder)
      });
    });

    Promise.all(promises)
      .then(responses => {
        if (responses.every(res => res.ok)) {
          cancelReminder();
          fetchReminders();
        } else {
          alert('Failed to save some reminders.');
        }
      })
      .catch(err => console.error('Error saving reminders for all days:', err));
  } else {
    alert('Please fill in all fields!');
  }
}

// Save for current day
function saveReminder() {
  const task = document.getElementById('taskInput').value;
  const time = document.getElementById('timeInput').value;
  const type = document.getElementById('typeInput').value;
  const token = localStorage.getItem("token");

  if (task && time && type) {
    const newReminder = {
      description: task,
      time,
      type,
      day: currentDay
    };

    fetch('/reminders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newReminder)
    })
      .then(res => {
        if (res.ok) {
          cancelReminder();
          fetchReminders();
        } else {
          alert('Failed to save reminder.');
        }
      })
      .catch(err => console.error('Error saving reminder:', err));
  } else {
    alert('Please fill in all fields!');
  }
}

// Load reminders
function fetchReminders() {
  const token = localStorage.getItem("token");

  fetch('/reminders', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      reminders = data;
      renderReminders();
    })
    .catch(err => console.error('Error fetching reminders:', err));
}

// Render current day's reminders
function renderReminders() {
  const list = document.getElementById('reminderList');
  list.innerHTML = '';

  const filtered = reminders.filter(r => r.day === currentDay);

  filtered.forEach((reminder) => {
    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.padding = '16px 0';
    label.style.fontSize = '22px';
    label.style.borderBottom = '1px solid #4a90e2';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.marginRight = '12px';
    checkbox.style.width = '24px';
    checkbox.style.height = '24px';

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        label.style.transition = 'opacity 0.6s ease';
        label.style.opacity = '0.3';

        setTimeout(() => {
          deleteReminder(reminder.id);
        }, 600);
      }
    });

    const textSpan = document.createElement('span');
    textSpan.textContent = `${reminder.description} – ${reminder.time} (${reminder.type})`;

    label.appendChild(checkbox);
    label.appendChild(textSpan);
    list.appendChild(label);
  });

  document.getElementById('reminderTitle').innerText = `Reminder for ${currentDay}:`;
}

// Delete reminder
function deleteReminder(id) {
  const token = localStorage.getItem("token");

  fetch(`/reminders/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (res.ok) {
        fetchReminders();
      } else {
        alert('Failed to delete reminder');
      }
    })
    .catch(err => console.error('Error deleting reminder:', err));
}

// Handle day switching
document.querySelectorAll('.day-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    currentDay = button.dataset.day;
    renderReminders();
  });
});

// On load
fetchReminders();