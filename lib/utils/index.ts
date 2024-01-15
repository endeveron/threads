import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * The function `cn` is a TypeScript function that merges multiple class values into a single string.
 *
 * @param {ClassValue[]} inputs - The `inputs` parameter is a rest parameter that allows you to pass in
 * multiple arguments of type `ClassValue`. The `ClassValue` type represents a class name or an object
 * of class names.
 *
 * @returns The `cn` function is returning the result of merging the class values passed as arguments
 * using the `clsx` function.
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Checks if a given string is a valid base64 encoded image data.
 *
 * @param {string} imageData a string that represents the image data in base64 format.
 * @returns a boolean value indicating whether the provided imageData is a base64 encoded image.
 */
export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

/**
 * Takes a date string as input and returns a formatted string with the time and date.
 *
 * @param {string} dateString a string representing a date in a specific format.
 *
 * @returns a formatted string that includes the time and date.
 * The format of the string is "time - date", where the time is in the format "hour:minute" and the
 * date is in the format "month day, year".
 */
export const formatDateString = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${time} - ${formattedDate}`;
};

// /**
//  * Takes a number as input and returns a formatted string indicating the number of threads.
//  *
//  * @param {number} count a number that represents the number of threads.
//  *
//  * @returns a string that represents the formatted thread count.
//  */
// export const formatThreadCount = (count: number): string => {
//   if (count === 0) {
//     return 'No Threads';
//   } else {
//     const threadCount = count.toString().padStart(2, '0');
//     const threadWord = count === 1 ? 'Thread' : 'Threads';
//     return `${threadCount} ${threadWord}`;
//   }
// };
