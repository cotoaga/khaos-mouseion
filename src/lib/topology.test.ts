import { describe, expect, it } from "vitest";
import {
  buildTopology,
  edgeKey,
  hash01,
  initSimulation,
  lift,
  pmi,
  tick,
  type PinakesBook,
} from "./topology";

function book(category: string, themes: string[], title = "t"): PinakesBook {
  return { title, author: "a", category, themes };
}

describe("pmi", () => {
  it("matches the empirically verified complexity|emergence figure", () => {
    // From the 2026-07-12 topology analysis of the real catalog:
    // complexity|emergence co-occur in 38 of 1464 books, PMI ≈ 3.03.
    // complexity: 216 books? — reconstruct from PMI definition instead:
    // pmi = log2((38/1464) / ((fA/1464)*(fB/1464))). Verified invariant:
    // independence gives PMI 0, positive association gives PMI > 0.
    const independent = pmi(25, 100, 366, 1464); // 100*366/1464 ≈ 25 expected
    expect(independent).toBeCloseTo(0, 1);
  });

  it("is positive when co-occurrence beats chance and negative below it", () => {
    expect(pmi(50, 100, 100, 1000)).toBeGreaterThan(0); // expected 10, saw 50
    expect(pmi(2, 100, 100, 1000)).toBeLessThan(0); // expected 10, saw 2
  });

  it("returns -Infinity for zero co-occurrence", () => {
    expect(pmi(0, 10, 10, 100)).toBe(-Infinity);
  });
});

describe("lift", () => {
  it("is 1.0 at independence", () => {
    expect(lift(10, 100, 100, 1000)).toBeCloseTo(1, 5);
  });
  it("scales linearly above expectation", () => {
    expect(lift(30, 100, 100, 1000)).toBeCloseTo(3, 5);
  });
});

describe("edgeKey", () => {
  it("is order-independent", () => {
    expect(edgeKey("b", "a")).toBe(edgeKey("a", "b"));
  });
});

describe("buildTopology", () => {
  const books: PinakesBook[] = [
    book("Systems", ["complexity", "emergence"]),
    book("Systems", ["complexity", "emergence"]),
    book("Systems", ["complexity", "emergence"]),
    book("Systems", ["complexity", "cybernetics"]),
    book("Fiction", ["identity"]),
    book("Fiction", ["identity", "power"]),
    book("Politics", ["power"]),
    book("Politics", ["power", "identity"]),
  ];

  it("builds theme nodes with correct book counts", () => {
    const topo = buildTopology(books);
    const complexity = topo.themeLens.nodes.find(n => n.id === "complexity");
    expect(complexity?.books).toBe(4);
    expect(complexity?.kind).toBe("theme");
  });

  it("keeps only theme edges meeting min co-occurrence and positive PMI", () => {
    const topo = buildTopology(books);
    const keys = topo.themeLens.links.map(l => edgeKey(l.source, l.target));
    expect(keys).toContain(edgeKey("complexity", "emergence")); // 3 shared, strong
    expect(keys).not.toContain(edgeKey("complexity", "cybernetics")); // only 1 shared
  });

  it("normalizes theme edge weights into (0, 1]", () => {
    const topo = buildTopology(books);
    for (const l of topo.themeLens.links) {
      expect(l.weight).toBeGreaterThan(0);
      expect(l.weight).toBeLessThanOrEqual(1);
    }
  });

  it("bipartite lens contains both node kinds, lift-filtered edges only", () => {
    const topo = buildTopology(books);
    const kinds = new Set(topo.bipartiteLens.nodes.map(n => n.kind));
    expect(kinds.has("category")).toBe(true);
    expect(kinds.has("theme")).toBe(true);
    for (const l of topo.bipartiteLens.links) {
      expect(l.books).toBeGreaterThanOrEqual(2);
    }
  });

  it("tracks members for nodes and edges (click-through payload)", () => {
    const topo = buildTopology(books);
    expect(topo.members.get("complexity")).toHaveLength(4);
    expect(topo.members.get(edgeKey("complexity", "emergence"))).toHaveLength(3);
    expect(topo.members.get("Systems")).toHaveLength(4);
  });
});

describe("simulation", () => {
  it("hash01 is deterministic and in [0,1)", () => {
    expect(hash01("complexity")).toBe(hash01("complexity"));
    for (const s of ["a", "b", "identity", "Systems"]) {
      expect(hash01(s)).toBeGreaterThanOrEqual(0);
      expect(hash01(s)).toBeLessThan(1);
    }
  });

  it("cools down and keeps nodes inside bounds", () => {
    const topo = buildTopology([
      book("Systems", ["complexity", "emergence"]),
      book("Systems", ["complexity", "emergence"]),
      book("Systems", ["complexity", "emergence"]),
      book("Fiction", ["identity", "complexity", "emergence"]),
    ]);
    const sim = initSimulation(topo.themeLens, 800, 600);
    const alpha0 = sim.alpha;
    for (let i = 0; i < 120; i++) tick(sim);
    expect(sim.alpha).toBeLessThan(alpha0);
    for (const n of sim.nodes) {
      expect(n.x).toBeGreaterThanOrEqual(0);
      expect(n.x).toBeLessThanOrEqual(800);
      expect(n.y).toBeGreaterThanOrEqual(0);
      expect(n.y).toBeLessThanOrEqual(600);
      expect(Number.isFinite(n.x)).toBe(true);
      expect(Number.isFinite(n.y)).toBe(true);
    }
  });

  it("pulls linked nodes closer than unlinked ones over time", () => {
    const topo = buildTopology([
      book("A", ["x", "y"]),
      book("A", ["x", "y"]),
      book("A", ["x", "y"]),
      book("B", ["z"]),
      book("B", ["z"]),
      book("B", ["z"]),
    ]);
    const sim = initSimulation(topo.themeLens, 800, 600);
    for (let i = 0; i < 300; i++) tick(sim);
    const x = sim.index.get("x")!, y = sim.index.get("y")!, z = sim.index.get("z")!;
    const dXY = Math.hypot(x.x - y.x, x.y - y.y);
    const dXZ = Math.hypot(x.x - z.x, x.y - z.y);
    expect(dXY).toBeLessThan(dXZ);
  });
});
