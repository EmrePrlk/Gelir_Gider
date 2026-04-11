/**
 * Serialize params for a URL
 * @param params {Record<string, unknown>} - The params to serialize
 * @returns {string} The serialized params
 */
export const serializeParams = (params: Record<string, unknown>): string => {
  const serialized = Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== '',
    )
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(
          v => `${encodeURIComponent(key)}[]=${encodeURIComponent(String(v))}`,
        );
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .join('&');
  return serialized ? `?${serialized}` : '';
};
