/* eslint-disable camelcase */
import cloudinaryBase from 'cloudinary';
import createDebug from 'debug';
import { cloudinary } from '../config.js';
import { CloudinaryError, HttpError } from '../types/http.error.js';
import { ImgData } from '../types/image.type.js';

const debug = createDebug('GL:Services:MediaFiles');

export class CloudinaryService {
  private cloudinary: typeof cloudinaryBase.v2;
  constructor() {
    this.cloudinary = cloudinaryBase.v2;
    this.cloudinary.config({
      secure: true,
      api_key: cloudinary.key,
      cloud_name: cloudinary.name,
      api_secret: cloudinary.secret,
    });
    debug('Instantiated');
    debug('key:', this.cloudinary.config().api_key);
  }

  async uploadImage(imagePath: string) {
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      const result = await this.cloudinary.uploader.upload(imagePath, options);

      const imageData: ImgData = {
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        url: result.url,
      };

      return imageData;
    } catch (error) {
      const httpError = new HttpError(
        406,
        'Not Acceptable',
        (error as CloudinaryError)?.error?.message
      );
      throw httpError;
    }
  }

  resizeImage(imageData: ImgData) {
    return this.cloudinary.url(imageData.publicId, {
      transformation: {
        width: 200,
        crop: 'scale',
      },
    });
  }
}
