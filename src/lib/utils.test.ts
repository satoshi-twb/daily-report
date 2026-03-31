import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("単一クラス名をそのまま返す", () => {
    expect(cn("text-sm")).toBe("text-sm");
  });

  it("複数クラス名を結合する", () => {
    expect(cn("text-sm", "font-bold")).toBe("text-sm font-bold");
  });

  it("falsy な値を除外する", () => {
    expect(cn("text-sm", false, undefined, null, "font-bold")).toBe("text-sm font-bold");
  });

  it("Tailwind の競合クラスを後勝ちで解決する", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("条件式によるクラス切り替えができる", () => {
    const isActive = true;
    expect(cn("base", isActive && "active")).toBe("base active");

    const isDisabled = false;
    expect(cn("base", isDisabled && "disabled")).toBe("base");
  });
});
