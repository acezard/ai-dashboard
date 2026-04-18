import type { SupportRequest, Triage } from "./types";

export function analyzeRequest(request: SupportRequest): Promise<Triage> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (request.id === "req-2") {
        reject(new Error("AI analysis failed"));
        return;
      }

      resolve({
        summary:
          "User likely needs help related to access or workspace permissions.",
        category: "Access / Identity",
        priority: "high",
        ownerTeam: "IT Ops",
        nextStep:
          "Check recent auth changes, permissions, or workspace access rules.",
        confidence: 82,
      });
    }, 800);
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function generateReply(_request: SupportRequest): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        "Thanks for reporting this. We are reviewing the issue and checking the most likely cause. We will update you shortly with the next step.",
      );
    }, 700);
  });
}
