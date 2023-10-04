import cloudinaryBase from 'cloudinary';
import { ImgData } from '../types/image.type.js';
import { CloudinaryService } from './files.js';

jest.mock('cloudinary');

describe('Given CloudinaryService', () => {
  cloudinaryBase.v2 = {
    config: jest.fn().mockReturnValue({}),
    uploader: {},
    url: jest.fn().mockReturnValueOnce(''),
  } as unknown as typeof cloudinaryBase.v2;

  describe('When we instantiate it without errors', () => {
    const cloudinary = new CloudinaryService();
    beforeEach(() => {
      cloudinaryBase.v2.uploader.upload = jest.fn().mockResolvedValue(
        // eslint-disable-next-line camelcase
        { public_id: 'Test image' }
      );
    });
    test('Then its method uploadImage should be used', async () => {
      const imdData = await cloudinary.uploadImage('');
      expect(imdData).toHaveProperty('publicId', 'Test image');
    });
    test('Then its method resizeImage should be used', async () => {
      const mockImage = {} as ImgData;
      const imdData = cloudinary.resizeImage(mockImage);
      expect(imdData).toBe('');
    });
  });

  describe('When we instantiate it WITH errors', () => {
    const cloudinary = new CloudinaryService();
    beforeEach(() => {
      cloudinaryBase.v2.uploader.upload = jest.fn().mockRejectedValue({
        error: new Error('Upload error'),
      });
    });
    test('Then its method uploadImage should reject an error', async () => {
      expect(cloudinary.uploadImage('')).rejects.toThrow();
    });
  });
});
