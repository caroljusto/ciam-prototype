import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "../../src/App";
import ContactPage from "../../src/ContactPage";

function renderWithRoutes() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function completeAssessment(user, optionLabel = "option-3") {
  await user.click(screen.getByRole("button", { name: "Start Assessment" }));
  for (let i = 0; i < 10; i += 1) {
    await user.click(screen.getByRole("button", { name: optionLabel }));
    await user.click(screen.getByRole("button", { name: i === 9 ? "See My Results" : "Next" }));
  }
}

describe("Navigation & Flow", () => {
  test("renders intro, then starts question flow", async () => {
    const user = userEvent.setup();
    renderWithRoutes();

    expect(screen.getByText(/How Healthy Is Your/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start Assessment" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Start Assessment" }));
    expect(screen.getByTestId("question-step-label")).toHaveTextContent("Question 1 of 10");
  });

  test("next disabled until option selected, then advances", async () => {
    const user = userEvent.setup();
    renderWithRoutes();
    await user.click(screen.getByRole("button", { name: "Start Assessment" }));

    const next = screen.getByRole("button", { name: "Next" });
    expect(next).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "option-2" }));
    expect(next).not.toBeDisabled();
    await user.click(next);
    expect(screen.getByTestId("question-step-label")).toHaveTextContent("Question 2 of 10");
  });

  test("back works and preserves selected answer", async () => {
    const user = userEvent.setup();
    renderWithRoutes();
    await user.click(screen.getByRole("button", { name: "Start Assessment" }));
    await user.click(screen.getByRole("button", { name: "option-3" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("button", { name: "option-3" })).toBeInTheDocument();
  });

  test("progress bar updates from 10% to 50%", async () => {
    const user = userEvent.setup();
    renderWithRoutes();
    await user.click(screen.getByRole("button", { name: "Start Assessment" }));
    expect(screen.getByTestId("progress-bar")).toHaveStyle({ width: "10%" });

    for (let i = 0; i < 4; i += 1) {
      await user.click(screen.getByRole("button", { name: "option-2" }));
      await user.click(screen.getByRole("button", { name: "Next" }));
    }
    expect(screen.getByTestId("question-step-label")).toHaveTextContent("Question 5 of 10");
    expect(screen.getByTestId("progress-bar")).toHaveStyle({ width: "50%" });
  });
});

describe("Results & Email Gate", () => {
  test("results render after question 10", async () => {
    const user = userEvent.setup();
    renderWithRoutes();
    await completeAssessment(user, "option-3");
    expect(screen.getByText(/perception/i)).toBeInTheDocument();
    expect(screen.getByText(/\/ 5\.0/)).toBeInTheDocument();
    expect(screen.getByTestId("unlock-gate-heading")).toHaveTextContent("See your full results");
    expect(screen.getByText(/Where You're Most Exposed/i)).toBeInTheDocument();
    expect(screen.getByText(/does not constitute a professional assessment/i)).toBeInTheDocument();
  });

  test("email validation rejects invalid and personal domains, accepts work email", async () => {
    const user = userEvent.setup();
    renderWithRoutes();
    await completeAssessment(user, "option-3");

    await user.click(screen.getByRole("button", { name: "Unlock your results" }));
    expect(screen.getByText("Please enter a valid work email")).toBeInTheDocument();

    await user.type(screen.getByLabelText("work-email"), "user@gmail.com");
    await user.click(screen.getByRole("button", { name: "Unlock your results" }));
    expect(screen.getByText(/personal domains are not allowed/i)).toBeInTheDocument();

    await user.clear(screen.getByLabelText("work-email"));
    await user.type(screen.getByLabelText("work-email"), "user@company.com");
    await user.click(screen.getByRole("button", { name: "Unlock your results" }));
    expect(screen.getByText("Detailed Findings", { exact: true })).toBeInTheDocument();
    expect(screen.getByText("What Would a Real Assessment Find?")).toBeInTheDocument();
  });

  test("cta navigates to dedicated contact page", async () => {
    const user = userEvent.setup();
    renderWithRoutes();
    await completeAssessment(user, "option-4");
    await user.type(screen.getByLabelText("work-email"), "qa@company.com");
    await user.click(screen.getByRole("button", { name: "Unlock your results" }));
    await user.click(screen.getByRole("button", { name: "Talk to a CIAM Specialist" }));
    expect(await screen.findByRole("heading", { name: /Book your intro call/i })).toBeInTheDocument();
  });

  test("platform dropdown contains expected options", async () => {
    const user = userEvent.setup();
    renderWithRoutes();
    await completeAssessment(user, "option-3");
    await user.click(screen.getByLabelText("platform"));

    const expectedPlatforms = [
      "Auth0 / Okta CIC",
      "Okta WIC",
      "Ping Identity / ForgeRock",
      "AWS Cognito",
      "Microsoft Entra External ID",
      "Akamai Identity Cloud",
      "SAP CDC (Gigya)",
      "LoginRadius",
      "Custom / In-house",
      "Multiple platforms",
      "Other",
    ];

    expectedPlatforms.forEach((label) => {
      expect(screen.getByRole("option", { name: label })).toBeInTheDocument();
    });
  });

  test("gate form has only current fields (email, role, platform)", async () => {
    const user = userEvent.setup();
    renderWithRoutes();
    await completeAssessment(user, "option-3");

    expect(screen.getByLabelText("work-email")).toBeInTheDocument();
    expect(screen.getByLabelText("role")).toBeInTheDocument();
    expect(screen.getByLabelText("platform")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Company")).not.toBeInTheDocument();
  });
});
