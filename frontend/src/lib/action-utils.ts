export type ServerActionResult<T> =
  | { success: true; value: T; details: unknown }
  | { success: false; error: string; details: unknown };

export class ServerActionError extends Error {
  public details: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = "ServerActionError";
    this.details = details;
  }
}

export function createServerAction<Return, Args extends unknown[] = []>(
  callback: (...args: Args) => Promise<Return>
): (...args: Args) => Promise<ServerActionResult<Return>> {
  return async (...args: Args) => {
    try {
      const value = await callback(...args);
      return { success: true, value, details: null };
    } catch (error: any) {
      if (error instanceof ServerActionError) {
        return {
          success: false,
          error: error.message,
          details: error.details,
        };
      }
      console.error("Unexpected error in ServerAction:", error);
      return {
        success: false,
        error: "Unexpected server error",
        details: { message: error.message },
      };
    }
  };
}
