export async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3, baseDelayMs = 250): Promise<T> {
  let attempt = 0;
  let lastError: unknown;
  while (attempt < maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
      attempt += 1;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Unknown error after retries");
}


