const fs = require('fs/promises');
const path = require('path');
const SimpleDB = require('../lib/simple-db');


const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

describe('simple database', () => {
  const newDB = new SimpleDB(TEST_DIR);

  beforeEach(async () => {
    await fs.rm(TEST_DIR, { force: true, recursive: true });
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  // Save & Get by ID
  it('Saves an object, then gets that object by id', async () => {
    const object = { words: 'this is a string' };
    await newDB.save(object);
    const file =  await newDB.get(object.id);
    expect(file).toEqual(object);
  });

  // Error Handling
  it('Uses custom error handling message', async () => {
    try {
      await newDB.get(1);
    } catch (err) {
      expect(err.message).toContain('not found!');
    }
  });

  // Get All
  it('Returns an array of all objects within the directory', async () => {
    const expected = [
      { anArray: 'of objects', id: expect.any(String) },
      { likeSo: 'another object', id: expect.any(String) },
    ];
    await newDB.save({ anArray: 'of objects' })
      .then(() => newDB.save({ likeSo: 'another object' }))
      .then(() => newDB.getAll())
      .then((arrayOfObjects) =>
        expect(arrayOfObjects).toEqual(expect.arrayContaining(expected))
      );
  });

  // Delete(id)
  it('Removes a file by id', () => {
    const object = { words: 'this is a string' };
    return newDB
      .save(object)
      .then(() => newDB.delete(object.id))
      .then(() => fs.readdir(TEST_DIR))
      .then((fileDir) => {
        expect(fileDir).not.toEqual(object);
      });
  });

  it('Does not throw an error if no such file exists', () => {
    const object = { 
      words: 'this is a string' };
    const wrongId = `${object.id}1`;
    return newDB
      .save(object)
      .then(() => newDB.delete(wrongId))
      .then(() => fs.readdir(TEST_DIR))
      .then((fileDir) => {
        expect(fileDir).not.toThrowError;
      });
      
  });

});
