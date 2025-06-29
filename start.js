#!/usr/bin/env node

const { spawn } = require('child_process');
const { createServer } = require('net');
const config = require('./config');

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

async function startApp() {
    console.log('🚀 Starting Task Management Dashboard...\n');

    // Find available port for frontend
    const frontendPort = await findAvailablePort(8765);

    // Use deployed backend URL from config
    const deployedBackendUrl = config.deployedBackendUrl;

    console.log(`📱 Frontend will run on: http://localhost:${frontendPort}`);
    console.log(`🔧 Backend will use deployed version: ${deployedBackendUrl}\n`);

    // Start frontend only
    const frontend = spawn('npm', ['start'], {
        cwd: './frontend',
        stdio: 'pipe',
        env: {
            ...process.env,
            PORT: frontendPort.toString(),
            BROWSER: 'open',
            REACT_APP_API_URL: `${deployedBackendUrl}/api`
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

    // Handle process termination
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down...');
        frontend.kill('SIGINT');
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\n🛑 Shutting down...');
        frontend.kill('SIGTERM');
        process.exit(0);
    });
}

startApp().catch(console.error); 