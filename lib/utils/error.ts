/**
 * Throws an error with a message and additional information if provided.
 * @param {string} msg a string that represents the error message or
 * description.
 * @param {any} err an object that represents an error. It can be of any type,
 * but typically it is an instance of the `Error` class or one of its subclasses.
 */
export const handleActionError = (msg: string, err: any) => {
  const info = err?.message ? `. ${err.message}` : '.';
  throw new Error(msg + info);
};
