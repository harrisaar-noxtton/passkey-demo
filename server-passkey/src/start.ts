import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import express from 'express';
import passkeyRoutes from './passkeyRoutes';

import { rpID, origin } from './authConfig';
import os from 'os';


const app = express();
const port = process.env.PORT || 3021;

app.use(express.json());

// Note: __dirname in ES modules / ts-node can behave differently.
// For consistency with CommonJS and ts-node:
const clientBuildPath = path.resolve(__dirname, '../../client-passkey/dist');
app.use(express.static(clientBuildPath));

app.use('/passkey', passkeyRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// For any other request, serve the index.html from the client build
app.get('*', (req, res) => {
    const indexPath = path.join(clientBuildPath, 'index.html');
    res.sendFile(indexPath);
});



function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]!) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

app.listen(port, () => {
    const localIP = getLocalIP();
    console.log('\n---------------------------------------------------');
    console.log(`🚀 Passkey Server running on port ${port}`);
    console.log(`🔗 Local URL:    http://localhost:${port}`);
    console.log(`🌐 Network URL:  http://${localIP}:${port}`);
    console.log(`🛡️  RP ID:        ${rpID}`);
    console.log(`🌈 Expected Origin: ${origin}`);
    console.log('---------------------------------------------------\n');
    console.log(`Serving client from: ${clientBuildPath}`);
});
