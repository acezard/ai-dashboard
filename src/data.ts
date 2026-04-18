import type { SupportRequest } from "./types";

export const initialRequests: SupportRequest[] = [
  {
    id: "req-1",
    requester: "Marie Dubois",
    source: "slack",
    title: "Lost access after SSO migration",
    rawText:
      "I lost access to the billing workspace right after the SSO migration this morning. I can still log into Slack, but the billing workspace gives me an authorization error.",
    status: "new",
    createdAt: "2026-04-17T08:30:00Z",
    triage: null,
    replyDraft: "",
  },
  {
    id: "req-2",
    requester: "Thomas Leroy",
    source: "manual",
    title: "Slack notifications stopped",
    rawText:
      "Notifications from the approvals workflow stopped appearing in Slack since yesterday afternoon.",
    status: "new",
    createdAt: "2026-04-17T08:45:00Z",
    triage: null,
    replyDraft: "",
  },
  {
    id: "req-3",
    requester: "Claire Martin",
    source: "email",
    title: "Need onboarding docs for new hire",
    rawText:
      "Can you send me the onboarding checklist and access documentation for our new hire starting Monday?",
    status: "triaged",
    createdAt: "2026-04-17T07:50:00Z",
    triage: {
      summary: "Requester needs onboarding documentation for a new employee.",
      category: "Knowledge Request",
      priority: "low",
      ownerTeam: "HR Ops",
      nextStep: "Share onboarding checklist and standard access package.",
      confidence: 91,
    },
    replyDraft:
      "Here are the onboarding documents and the standard access checklist for the new hire starting Monday.",
  },
  {
    id: "req-4",
    requester: "James Gouse",
    source: "slack",
    title: "Need help resetting laptop password",
    rawText:
      "Hello, can you help me reset the password on my laptop? I'm locked out after too many attempts.",
    status: "new",
    createdAt: "2026-04-17T09:00:00Z",
    triage: null,
    replyDraft: "",
  },
];
