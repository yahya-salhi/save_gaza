import { describe, it, expect } from "vitest";
import { NotFoundError, ValidationError } from "./DomainError.js";

describe("domain errors", () => {
  it("NotFoundError carries correct code and status", () => {
    const err = new NotFoundError();
    expect(err.code).toBe("NOT_FOUND");
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Resource not found");
  });

  it("ValidationError carries VALIDATION_ERROR", () => {
    const err = new ValidationError("Bad input");
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe("Bad input");
  });
});
