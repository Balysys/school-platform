"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = __importDefault(require("./routes/auth"));
const eleves_1 = __importDefault(require("./routes/eleves"));
const notes_1 = __importDefault(require("./routes/notes"));
const classes_1 = __importDefault(require("./routes/classes"));
const matieres_1 = __importDefault(require("./routes/matieres"));
const periodes_1 = __importDefault(require("./routes/periodes"));
const utilisateurs_1 = __importDefault(require("./routes/utilisateurs"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '3001', 10);
// Simple CORS - Allow all origins (development only)
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/eleves', eleves_1.default);
app.use('/api/notes', notes_1.default);
app.use('/api/classes', classes_1.default);
app.use('/api/matieres', matieres_1.default);
app.use('/api/periodes', periodes_1.default);
app.use('/api/utilisateurs', utilisateurs_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});
// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'School Platform API' });
});
// Health check at root too (for backward compatibility)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Start server - listen on all interfaces
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log('CORS enabled for all origins (development mode)');
});
exports.default = app;
