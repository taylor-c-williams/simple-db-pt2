const { captureRejections } = require('events');
const { copyFile } = require('fs');
const fs = require('fs/promises');
const path = require('path');
const SimpleDB = require('../lib/simple-db');


const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

describe('simple database', () => {
  const rootDir = './__tests__/test-dir';
  const newDB = new SimpleDB(rootDir);

  beforeEach(async () => {
    await fs.rm(TEST_DIR, { force: true, recursive: true });
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  it('Creates and saves an object', () => {
    const object = { words: 'this is a string' };
    return newDB
      .save(object)
      .then(() => newDB.get(object.id))
      .then((newObj) => {
        expect(newObj).toEqual(object);
      });
  });

  it('Returns error message if enoent', () => {
    const wrongId = 1;
    try {
      return newDB.get(wrongId);
    } catch (err){
      expect(err.message).toMatch('not found!');}
  });


});
