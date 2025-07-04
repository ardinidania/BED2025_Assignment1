let reminders = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: []
};

let currentDay = 'Monday';

function toggleAddForm() {
  document.getElementById('addForm').style.display = 'block';
  document.getElementById('formDay').innerText = currentDay;
}

function cancelReminder() {
  document.getElementById('addForm').style.display = 'none';
  document.getElementById('taskInput').value = '';
  document.getElementById('timeInput').value = '';
}

function saveReminder() {
  const task = document.getElementById('taskInput').value;
  const time = document.getElementById('timeInput').value;

  if (task && time) {
    reminders[currentDay].push({ task, time });
    cancelReminder();
    renderReminders();
  } else {
    alert('Please enter both task and time!');
  }
}

function renderReminders() {
  const list = document.getElementById('reminderList');
  list.innerHTML = '';

  reminders[currentDay].forEach((reminder, index) => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.width = '24px';
    checkbox.style.height = '24px';
    checkbox.style.marginRight = '12px';

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        setTimeout(() => {
          reminders[currentDay].splice(index, 1);
          renderReminders();
        }, 500); // brief delay before deletion
      }
    });

    label.appendChild(checkbox);
    label.append(`${reminder.task} – ${reminder.time}`);
    list.appendChild(label);
  });

  document.getElementById('reminderTitle').innerText = `Reminder for ${currentDay}:`;
}

// Handle day button clicks
document.querySelectorAll('.day-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    currentDay = button.dataset.day;
    renderReminders();
  });
});

// Initial render
renderReminders();
