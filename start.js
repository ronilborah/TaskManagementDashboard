#!/usr/bin/env node

const { spawn } = require('child_process');
const { createServer } = require('net');

// Function to find an available port
function findAvailablePort(startPort = 8765) {
    return new Promise((resolve, reject) => {
        const server = createServer();
        server.listen(startPort, () => {
            const { port } = server.address();
            server.close(() => resolve(port));
        });
        server.on('error', () => {
            resolve(findAvailablePort(startPort + 1));
        });
    });
}

// Function to find an available port for backend
function findAvailableBackendPort(startPort = 8000) {
    return new Promise((resolve, reject) => {
        const server = createServer();
        server.listen(startPort, () => {
            const { port } = server.address();
            server.close(() => resolve(port));
        });
        server.on('error', () => {
            resolve(findAvailableBackendPort(startPort + 1));
        });
    });
}

async function startApp() {
    console.log('🚀 Starting Task Management Dashboard...\n');

    // Find available ports
    const frontendPort = await findAvailablePort(8765);
    const backendPort = await findAvailableBackendPort(8000);

    console.log(`📱 Frontend will run on: http://localhost:${frontendPort}`);
    console.log(`🔧 Backend will run on: http://localhost:${backendPort}\n`);

    // Start backend
    const backend = spawn('npm', ['run', 'dev'], {
        cwd: './backend',
        stdio: 'pipe',
        env: { ...process.env, PORT: backendPort.toString() }
    });

    backend.stdout.on('data', (data) => {
        console.log(`[Backend] ${data.toString().trim()}`);
    });

    backend.stderr.on('data', (data) => {
        console.error(`[Backend Error] ${data.toString().trim()}`);
    });

    // Wait a bit for backend to start, then start frontend
    setTimeout(() => {
        const frontend = spawn('npm', ['start'], {
            cwd: './frontend',
            stdio: 'pipe',
            env: {
                ...process.env,
                PORT: frontendPort.toString(),
                BROWSER: 'open',
                REACT_APP_API_URL: `http://localhost:${backendPort}/api`
            }
        });

        frontend.stdout.on('data', (data) => {
            console.log(`[Frontend] ${data.toString().trim()}`);
        });

        frontend.stderr.on('data', (data) => {
            console.error(`[Frontend Error] ${data.toString().trim()}`);
        });

        frontend.on('close', (code) => {
            console.log(`[Frontend] Process exited with code ${code}`);
        });
    }, 2000);

    // Handle process termination
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down...');
        backend.kill('SIGINT');
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\n🛑 Shutting down...');
        backend.kill('SIGTERM');
        process.exit(0);
    });
}

startApp().catch(console.error); 