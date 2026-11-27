import { describe, expect, it } from "vitest";
import { isTest } from "./testspeler";

const winkel = { app: true, dev: false, testbuild: false, vlag: false };

describe("isTest", () => {
  it("een winkelversie is nooit een test, ook niet met de testvlag", () => {
    expect(isTest(winkel)).toBe(false);
    expect(isTest({ ...winkel, vlag: true })).toBe(false);
  });
  it("de gewone site is geen test zonder testvlag", () => {
    expect(isTest({ app: false, dev: false, testbuild: false, vlag: false })).toBe(false);
  });
  it("de gewone site met de testvlag is een test", () => {
    expect(isTest({ app: false, dev: false, testbuild: false, vlag: true })).toBe(true);
  });
  it("een ontwikkelversie en een debug-build zijn een test", () => {
    expect(isTest({ ...winkel, dev: true })).toBe(true);
    expect(isTest({ ...winkel, testbuild: true })).toBe(true);
  });
});
