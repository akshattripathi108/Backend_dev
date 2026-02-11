const express = require('express');
const app = express();
app.use(express.json());

let students = [
    { id: 1, name: 'Rajit', description: 'This is Rajit.', marks: 85 },
    { id: 2, name: 'Sanskar', description: 'This is Sanskar', marks: 90 },
    { id: 3, name: 'Ayushman', description: 'This is Ayushman', marks: 92 }
];

app.delete('/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex === -1) {
        return res.status(404).json({ message: 'Student not found' });
    }

    students.splice(studentIndex, 1);
    res.json({ message: 'Student deleted successfully' });
});
app.get('/students', (req, res) => {
    res.json(students);
});
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
