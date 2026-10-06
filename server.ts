import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'cutelaria_database.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

app.use(express.json({ limit: '20mb' }));

// Helper to read server database
function readDatabase(): any {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }
  return null;
}

// Helper to write server database
function writeDatabase(data: any): boolean {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

// API Routes
app.get('/api/status', (_req: Request, res: Response) => {
  const db = readDatabase();
  res.json({
    status: 'online',
    hasDatabase: !!db,
    lastUpdated: db?.updatedAt || null,
    salesCount: db?.sales?.length || 0,
    timestamp: Date.now(),
  });
});

app.get('/api/data', (_req: Request, res: Response) => {
  const db = readDatabase();
  if (!db) {
    return res.json({ initialized: false, data: null });
  }
  res.json({ initialized: true, data: db });
});

app.post('/api/data', (req: Request, res: Response) => {
  const payload = req.body;
  if (!payload) {
    return res.status(400).json({ error: 'Payload inválido' });
  }

  const updatedData = {
    ...payload,
    updatedAt: Date.now(),
  };

  const success = writeDatabase(updatedData);
  if (!success) {
    return res.status(500).json({ error: 'Falha ao salvar no banco de dados' });
  }

  res.json({ success: true, updatedAt: updatedData.updatedAt });
});

// Start server
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fronteira Cutelaria server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
