import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generic file storage functions
export class FileStorage<T> {
  private filePath: string;

  constructor(fileName: string) {
    this.filePath = path.join(DATA_DIR, fileName);
  }

  async read(): Promise<T[]> {
    try {
      await ensureDataDir();
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is empty, return empty array
      return [];
    }
  }

  async write(data: T[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async findById(id: string, idField: keyof T = 'id' as keyof T): Promise<T | null> {
    const items = await this.read();
    return items.find(item => item[idField] === id) || null;
  }

  async findByField<K extends keyof T>(field: K, value: T[K]): Promise<T | null> {
    const items = await this.read();
    return items.find(item => item[field] === value) || null;
  }

  async findAllByField<K extends keyof T>(field: K, value: T[K]): Promise<T[]> {
    const items = await this.read();
    return items.filter(item => item[field] === value);
  }

  async create(item: T): Promise<T> {
    const items = await this.read();
    items.push(item);
    await this.write(items);
    return item;
  }

  async update(id: string, updates: Partial<T>, idField: keyof T = 'id' as keyof T): Promise<T | null> {
    const items = await this.read();
    const index = items.findIndex(item => item[idField] === id);
    
    if (index === -1) {
      return null;
    }

    items[index] = { ...items[index], ...updates };
    await this.write(items);
    return items[index];
  }

  async delete(id: string, idField: keyof T = 'id' as keyof T): Promise<boolean> {
    const items = await this.read();
    const index = items.findIndex(item => item[idField] === id);
    
    if (index === -1) {
      return false;
    }

    items.splice(index, 1);
    await this.write(items);
    return true;
  }

  async count(): Promise<number> {
    const items = await this.read();
    return items.length;
  }
}

// Utility function to generate IDs
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
