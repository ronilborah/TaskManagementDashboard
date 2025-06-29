// Test script to verify localStorage functionality
// Run this in the browser console to test the localStorage API

console.log('🧪 Testing localStorage API...');

// Test data
const testProject = {
    name: 'Test Project',
    description: 'A test project',
    color: '#ff0000',
    colorHex: '#ff0000'
};

const testTask = {
    title: 'Test Task',
    description: 'A test task',
    priority: 'Medium',
    status: 'To Do',
    projectId: 'test-project-id',
    dueDate: '2024-12-31'
};

// Test localStorage keys
const projectsKey = 'taskmanager_projects';
const tasksKey = 'taskmanager_tasks';

// Clear existing test data
localStorage.removeItem(projectsKey);
localStorage.removeItem(tasksKey);

console.log('✅ localStorage cleared for testing');

// Test project creation
try {
    const projects = JSON.parse(localStorage.getItem(projectsKey) || '[]');
    const newProject = {
        _id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        ...testProject,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    projects.push(newProject);
    localStorage.setItem(projectsKey, JSON.stringify(projects));
    console.log('✅ Project created successfully:', newProject);
} catch (error) {
    console.error('❌ Failed to create project:', error);
}

// Test task creation
try {
    const tasks = JSON.parse(localStorage.getItem(tasksKey) || '[]');
    const newTask = {
        _id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        ...testTask,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    localStorage.setItem(tasksKey, JSON.stringify(tasks));
    console.log('✅ Task created successfully:', newTask);
} catch (error) {
    console.error('❌ Failed to create task:', error);
}

// Test data retrieval
try {
    const storedProjects = JSON.parse(localStorage.getItem(projectsKey) || '[]');
    const storedTasks = JSON.parse(localStorage.getItem(tasksKey) || '[]');
    console.log('✅ Data retrieval successful:');
    console.log('   Projects:', storedProjects.length);
    console.log('   Tasks:', storedTasks.length);
} catch (error) {
    console.error('❌ Failed to retrieve data:', error);
}

// Test filtering
try {
    const tasks = JSON.parse(localStorage.getItem(tasksKey) || '[]');
    const filteredTasks = tasks.filter(t => t.status === 'To Do');
    console.log('✅ Filtering successful:', filteredTasks.length, 'tasks with status "To Do"');
} catch (error) {
    console.error('❌ Failed to filter tasks:', error);
}

console.log('🎉 localStorage API test completed!');
console.log('💡 You can now use the app with localStorage persistence.'); 