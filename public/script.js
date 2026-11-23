
const API_URL = '/api/students';

const studentForm = document.getElementById('studentForm');
const studentTable = document.getElementById('studentTable');
const studentModal = document.getElementById('studentModal');

let students = [];
let editingId = null;

// Fetch and display students
async function loadStudents() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }

        students = await response.json();

        displayStudents(students);
        updateStats();

    } catch (error) {
        alert('Error loading students: ' + error.message);
    }
}

// Display students in table
function displayStudents(data) {
    studentTable.innerHTML = '';

    document.getElementById('emptyMessage').style.display =
        data.length === 0 ? 'block' : 'none';

    data.forEach(student => {
        const row = document.createElement('tr');

        [student.name, student.email, student.course, student.age]
            .forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });

        const actionCell = document.createElement('td');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editStudent(student));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteStudent(student._id));

        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);

        row.appendChild(actionCell);
        studentTable.appendChild(row);
    });
}

// Update dashboard statistics
function updateStats() {
    document.getElementById('totalStudents').textContent = students.length;

    const courses = new Set(students.map(student => student.course));

    document.getElementById('totalCourses').textContent = courses.size;
}

// Open Add Student Form
document.getElementById('addStudentBtn').addEventListener('click', () => {
    editingId = null;
    studentForm.reset();

    document.getElementById('modalTitle').textContent = 'Add New Student';

    studentModal.style.display = 'flex';
});

// Close Form
document.getElementById('closeModal').addEventListener('click', () => {
    studentModal.style.display = 'none';
});

// Add or Update Student
studentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const studentData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        course: document.getElementById('course').value.trim(),
        age: Number(document.getElementById('age').value)
    };

    try {
        const url = editingId
            ? `${API_URL}/${editingId}`
            : API_URL;

        const method = editingId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || result.message || 'Operation failed');
        }

        alert(result.message);

        studentModal.style.display = 'none';
        studentForm.reset();
        editingId = null;

        loadStudents();

    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Edit Student
function editStudent(student) {
    editingId = student._id;

    document.getElementById('name').value = student.name;
    document.getElementById('email').value = student.email;
    document.getElementById('course').value = student.course;
    document.getElementById('age').value = student.age;

    document.getElementById('modalTitle').textContent = 'Edit Student';

    studentModal.style.display = 'flex';
}

// Delete Student
async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || result.message || 'Delete failed');
        }

        alert(result.message);
        loadStudents();

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Search Students
document.getElementById('searchInput').addEventListener('input', (event) => {
    const searchText = event.target.value.toLowerCase();

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchText) ||
        student.email.toLowerCase().includes(searchText) ||
        student.course.toLowerCase().includes(searchText)
    );

    displayStudents(filteredStudents);
});

// Load students when website opens
loadStudents();
