// const fs = require('fs/promises');
// const path = require('path');

// class SimpleDb {
//   constructor(dirPath) {
//     this.dirPath = dirPath;
//   }

// }

// module.exports = SimpleDb;

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
    }
  }

  async getAll() {
    const allFiles = await fs.readdir(this.rootDir);
    const filePromise = await Promise.all(
      allFiles.map((fileName) =>
        fs.readFile(`${this.rootDir}/${fileName}`, JSON)
          .then((unstrungFile) => JSON.parse(unstrungFile))
          .catch((err => {
            if (err.code === 'ENOENT') {
              throw new Error(`${filePromise} not found!`);
            }
            throw err;
          }))
      )
    );
    return filePromise;
  }

  delete(id) {
    const filePath = this.getPath(id);
    return fs.rm(filePath, { force: true }).catch((err) => {
      if (err.code === 'ENOENT') {
        return null;
      }
      throw err;
    });
  }

}

module.exports = SimpleDB;
