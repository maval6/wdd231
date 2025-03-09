// Course list array
const courses = [
    {
        code: "CSE 110",
        name: "Programming Building Blocks",
        credits: 3,
        completed: false
    },
    {
        code: "CSE 111",
        name: "Programming with Functions",
        credits: 3,
        completed: false
    },
    {
        code: "CSE 210",
        name: "Programming with Classes",
        credits: 3,
        completed: false
    },
    {
        code: "WDD 130",
        name: "Web Fundamentals",
        credits: 3,
        completed: false
    },
    {
        code: "WDD 131",
        name: "Web Frontend Development I",
        credits: 3,
        completed: false
    },
    {
        code: "WDD 231",
        name: "Web Frontend Development II",
        credits: 3,
        completed: false
    }
];

// Function to display courses
function displayCourses(coursesToDisplay) {
    const container = document.getElementById('courses-container');
    container.innerHTML = '';
    
    coursesToDisplay.forEach(course => {
        const card = document.createElement('div');
        card.classList.add('course-card');
        if (course.completed) {
            card.classList.add('completed');
        }
        
        card.textContent = course.code;
        container.appendChild(card);
    });
    
    // Calculate and display total credits
    const totalCredits = coursesToDisplay.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById('total-credits').textContent = `Total Credits: ${totalCredits}`;
}

// Initial display of all courses
displayCourses(courses);

// Event listeners for filter buttons
document.getElementById('all-btn').addEventListener('click', () => {
    displayCourses(courses);
});

document.getElementById('cse-btn').addEventListener('click', () => {
    const cseOnly = courses.filter(course => course.code.startsWith('CSE'));
    displayCourses(cseOnly);
});

document.getElementById('wdd-btn').addEventListener('click', () => {
    const wddOnly = courses.filter(course => course.code.startsWith('WDD'));
    displayCourses(wddOnly);
});