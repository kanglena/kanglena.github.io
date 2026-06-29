import { describe, it, expect } from "vitest";
import { getContent, getOne, validateFrontmatter } from "./content";

describe("getContent", () => {
  it("날짜 내림차순으로 프로젝트를 반환한다", () => {
    const items = getContent("projects");
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items[0].date >= items[1].date).toBe(true);
  });
  it("date는 YYYY-MM-DD 형식이어야 한다", () => {
    const items = getContent("projects");
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it("본문을 html로 변환한다", () => {
    const items = getContent("posts");
    expect(items[0].html).toContain("<p>");
  });
});

describe("getOne", () => {
  it("slug로 하나를 찾는다", () => {
    const doc = getOne("projects", "typing-game");
    expect(doc.title).toBe("미니 타자 게임");
  });
});

describe("validateFrontmatter", () => {
  it("date 누락 시 한국어 에러를 던진다", () => {
    expect(() =>
      validateFrontmatter("content/posts/x.md", "posts", { title: "t", category: "dev-log" })
    ).toThrow(/date/);
  });
  it("잘못된 category는 에러를 던진다", () => {
    expect(() =>
      validateFrontmatter("content/posts/x.md", "posts", { title: "t", date: "2026-01-01", category: "wrong" })
    ).toThrow(/category/);
  });
});
