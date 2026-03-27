import { HelloMessage } from "@/hello/domain/hello-message";

describe("HelloMessage", () => {
  describe("create", () => {
    it("should create a HelloMessage with the given value", () => {
      const helloMessage = HelloMessage.create("Hello World");
      expect(helloMessage.value()).toBe("Hello World");
    });

    it("should throw when given an empty string", () => {
      expect(() => HelloMessage.create("")).toThrow(
        "HelloMessage must be a non-empty string",
      );
    });
  });

  describe("value", () => {
    it("should return the message value", () => {
      const helloMessage = HelloMessage.create("Hello World");
      expect(helloMessage.value()).toBe("Hello World");
    });
  });
});
