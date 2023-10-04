/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

export class HttpError extends Error {
  constructor(
    public status: number,
    public statusMessage: string,
    message?: string | undefined,
    options?: ErrorOptions | undefined
  ) {
    super(message, options);
  }
}
export type CloudinaryError = {
  error: Error;
};
