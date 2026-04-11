/**
 * Build form data
 * @param {unknown} data - Data to build form data
 * @returns {FormData} Form data
 */
export default function buildFormData(data: unknown): FormData {
  const formData = new FormData();
  // append all data to formData

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      }
      // Array of files
      else if (Array.isArray(value)) {
        value.forEach(file => {
          if (file instanceof File || file instanceof Blob) {
            formData.append(key, file);
          }
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-base-to-string
        formData.append(key, value.toString());
      }
    }
  });

  return formData;
}
