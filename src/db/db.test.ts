import mongoose from 'mongoose';
import { dbConnect } from './db';
jest.mock('mongoose');
describe('When we call dbConnect function', () => {
  test('Then ', async () => {
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(typeof mongoose);

    expect(await dbConnect()).toBe('object');
  });
});
