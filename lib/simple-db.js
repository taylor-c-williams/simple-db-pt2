const fs = require('fs/promises');
const path = require('path');
const shortid = require('shortid');

class SimpleDB {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  getPath(id) {
    return path.join(this.rootDir, `${id}.json`);
  }

  save(file) {
    this.id = `${shortid.generate()}`;
    file.id = this.id;
    const fileName = `${file.id}.json`;
    this.newFile = path.join(this.rootDir, fileName);
    const stringyObject = JSON.stringify(file);
    return fs.writeFile(this.newFile, stringyObject);
  }

  async get(id) {
    const filePath = this.getPath(id);
    try { 
      const gotFile = await fs.readFile(filePath, JSON);
      return JSON.parse(gotFile);
    } catch(err){
      if (err.code === 'ENOENT') {
        throw new Error(`${id.json} not found!`);
      }
      throw err;
    }}

  // Get all
  async getAll() {
    try {
      const allFiles = await fs.readdir(this.rootDir);
      return await Promise.all(
        allFiles.map(async (filename) => {
          const grabFile = await fs.readFile(
            `${this.rootDir}/${filename}`,
            'utf-8'
          );
          return JSON.parse(grabFile);
        })
      );
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error('Files not found!');
      }
      throw err;
    }
  }

  async delete(id) {
    const filePath = this.getPath(id);
    try{
      return await fs.rm(filePath, { force: true });
    }catch(err){ 
      if (err.code === 'ENOENT') {
        return null;
      }
      throw err;
    }
  }

}

module.exports = SimpleDB;
