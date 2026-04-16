import { expect, test } from "@playwright/test";

async function complete(page, optionIndex: number) {
  await page.getByRole("button", { name: "Start Assessment" }).click();
  for (let i = 0; i < 10; i += 1) {
    await page.getByRole("button", { name: `option-${optionIndex}` }).click();
    await page.getByRole("button", { name: i === 9 ? "See My Results" : "Next" }).click();
  }
}

test("low-maturity path renders Initial + results", async ({ page }) => {
  await page.goto("/");
  await complete(page, 1);
  await expect(page.getByText(/\/ 5\.0/)).toBeVisible();
  await expect(page.getByTestId("level-badge")).toContainText("Initial");
});

test("high-maturity path renders Leading + unlock flow", async ({ page }) => {
  await page.goto("/");
  await complete(page, 5);
  await expect(page.getByTestId("level-badge")).toContainText("Leading");
  await page.getByLabel("work-email").fill("cto@enterprise.com");
  await page.getByRole("button", { name: "Unlock your results" }).click();
  await expect(page.getByText("Detailed Findings", { exact: true })).toBeVisible();
  await expect(page.getByText("Talk to a CIAM Specialist")).toBeVisible();
});
