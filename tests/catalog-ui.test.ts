import test from "node:test";
import assert from "node:assert/strict";
import { services, serviceCategories } from "../data/services";
import { portfolioItems } from "../data/portfolio";
import { filterServices, servicesHref } from "../lib/catalog-ui";
import { similarRequestHref } from "../lib/portfolio-links";

test("service search combines words and matches listed materials without ignoring the category", () => {
  assert.deepEqual(filterServices(undefined, " pvc ").map(item => item.slug), ["sintra-board"]);
  assert.equal(filterServices("tshirt-printing", "PVC").length, 0);
  assert.equal(filterServices(undefined, "mug nonexistent").length, 0);
  assert.equal(filterServices(undefined, "   ").length, services.length);
  assert.deepEqual(filterServices(undefined, "T-SHIRT").map(item => item.slug), filterServices(undefined, "tshirt").map(item => item.slug));
});

test("search links preserve category and punctuation in the query", () => {
  const url = new URL(servicesHref("gifts-souvenirs", " mugs & gifts "), "http://localhost");
  assert.equal(url.searchParams.get("category"), "gifts-souvenirs");
  assert.equal(url.searchParams.get("q"), "mugs & gifts");
  assert.equal(servicesHref(undefined, " "), "/services");
});

test("every similar-project link points to real catalog data and carries its reference", () => {
  for (const item of portfolioItems) {
    const url = new URL(similarRequestHref(item), "http://localhost");
    assert.equal(url.pathname, "/quote");
    assert.equal(url.searchParams.get("project"), item.slug);
    const service = url.searchParams.get("service");
    const category = url.searchParams.get("category");
    assert.ok(service ? services.some(item => item.slug === service) : serviceCategories.some(item => item.slug === category));
  }
});

test("multi-product project references let the customer choose a product", () => {
  for (const slug of ["party-essentials-package", "wall-commercial-calendars", "personalized-party-favors-set"]) {
    const item = portfolioItems.find(item => item.slug === slug)!;
    const url = new URL(similarRequestHref(item), "http://localhost");
    assert.equal(url.searchParams.has("service"), false);
    assert.ok(url.searchParams.has("category"));
  }
});
