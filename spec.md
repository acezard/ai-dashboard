````md
# Exercise: AI Request Review Panel

## Goal

Build a small React + TypeScript interface for reviewing support requests enriched by AI.

The user can:
- select a request from a list
- analyze the request
- review and edit the AI triage
- generate a reply draft
- confirm the triage

This is a frontend exercise focused on:
- state modeling
- async UI states
- controlled inputs
- list/detail layout
- clean React fundamentals

---

## Constraints

Use:
- React
- TypeScript
- local component state
- fake async functions with `setTimeout`

Do not use:
- backend
- router
- TanStack Query
- React Hook Form
- external state libraries
- real LLM APIs
- Slack integration

A single page is enough.

---

## Functional requirements

## 1. Requests list
Display a list of support requests in a left column.

Each request item should show:
- title
- requester
- status
- priority if triage exists

When the user clicks a request, it becomes selected.

---

## 2. Request detail panel
Display the selected request in a right column.

The detail panel must show:
- title
- requester
- source
- status
- original request text

If no request is selected, show an empty state.

---

## 3. Analyze action
Add an `Analyze` button in the detail panel.

When clicked:
- show a loading state
- call a fake async function
- on success:
  - populate triage data
  - set status to `triaged`
- on failure:
  - show an error message

While analysis is running:
- disable relevant actions

---

## 4. Triage section
If triage data exists, display an editable form with:
- summary
- category
- priority
- owner team
- next step
- confidence

The fields should be editable by the user.

Edits must update the selected request in state.

---

## 5. Generate reply action
Add a `Generate reply` button.

When clicked:
- show a loading state
- call a fake async function
- populate a reply draft textarea

The reply draft should remain editable.

---

## 6. Confirm triage action
Add a `Confirm triage` button.

Behavior:
- only meaningful if triage exists
- updates status to `confirmed`

---

## 7. Async and UI states
Handle these states correctly:
- no selection
- loading analysis
- analysis error
- loading reply generation
- triage missing
- triage present

The UI should remain coherent while async actions are running.

---

## Data types

Use these types exactly or very close to them.

```ts
export type RequestStatus = "new" | "triaged" | "confirmed";
export type Priority = "low" | "medium" | "high" | "critical";

export type Triage = {
  summary: string;
  category: string;
  priority: Priority;
  ownerTeam: string;
  nextStep: string;
  confidence: number;
};

export type SupportRequest = {
  id: string;
  requester: string;
  source: "slack" | "email" | "manual";
  title: string;
  rawText: string;
  status: RequestStatus;
  createdAt: string;
  triage: Triage | null;
  replyDraft: string;
};
````

---

## Initial mock data

Use something like this:

```ts
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
      "Hello, can you help me reset the password on my laptop? I’m locked out after too many attempts.",
    status: "new",
    createdAt: "2026-04-17T09:00:00Z",
    triage: null,
    replyDraft: "",
  },
];
```

---

## Fake async functions

Use something like this:

```ts
import type { SupportRequest, Triage } from "./types";

export function analyzeRequest(request: SupportRequest): Promise<Triage> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (request.id === "req-2") {
        reject(new Error("AI analysis failed"));
        return;
      }

      resolve({
        summary: "User likely needs help related to access or workspace permissions.",
        category: "Access / Identity",
        priority: "high",
        ownerTeam: "IT Ops",
        nextStep: "Check recent auth changes, permissions, or workspace access rules.",
        confidence: 82,
      });
    }, 800);
  });
}

export function generateReply(request: SupportRequest): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        "Thanks for reporting this. We are reviewing the issue and checking the most likely cause. We will update you shortly with the next step."
      );
    }, 700);
  });
}
```

You may customize the returned content per request if you want.

---

## Expected layout

A simple 2-column layout is enough:

* left column: requests list
* right column: selected request details

Example structure:

```txt
App
├─ RequestList
│  └─ RequestListItem
└─ RequestDetail
   ├─ RequestHeader
   ├─ OriginalRequestCard
   ├─ TriageForm
   └─ ReplyDraftCard
```

You do not need routing.

---

## Recommended state approach

Recommended top-level state:

```ts
const [requests, setRequests] = useState<SupportRequest[]>(initialRequests);
const [selectedId, setSelectedId] = useState<string | null>(initialRequests[0]?.id ?? null);
const [analysisLoading, setAnalysisLoading] = useState(false);
const [analysisError, setAnalysisError] = useState("");
const [replyLoading, setReplyLoading] = useState(false);
```

Derive the selected request instead of storing it separately.

Example:

```ts
const selectedRequest = useMemo(
  () => requests.find((request) => request.id === selectedId) ?? null,
  [requests, selectedId]
);
```

---

## Important implementation expectations

### Store vs derive

Do:

* store `selectedId`
* derive `selectedRequest`

Do not:

* store both `selectedId` and a separate duplicated `selectedRequest`

---

### State updates

When updating one request:

* update the array immutably
* replace only the matching request

---

### Controlled inputs

For triage and reply draft:

* use controlled inputs or textareas
* changes should update app state

---

### Loading behavior

While analysis or reply generation is running:

* disable the relevant button
* avoid triggering duplicate requests

---

### Error behavior

If analysis fails:

* display the error in the detail panel
* do not wipe unrelated existing request data

---

## Bonus ideas

Only if the base version is complete:

* add a status badge color
* show source badges
* add a small search input for filtering requests
* add a “Reset triage” button
* show a small confidence badge
* format created date
* add a basic empty state when the request list is empty

Do not do bonuses before the core exercise is done.

---

## Success criteria

The exercise is complete when:

* selecting a request updates the detail panel
* analyze works for at least one request
* analyze fails for one request and shows an error
* triage fields are editable
* generate reply works
* reply draft is editable
* confirm triage updates status
* UI stays coherent during loading/error states

---

## Non-goals

This exercise is not about:

* beautiful design
* backend architecture
* real AI
* Slack integration
* production-ready patterns

It is about rebuilding clean React fundamentals.

---

## Deliverable

A single working React + TypeScript page is enough.

A short README is optional but useful:

* what you built
* key state decisions
* what you would improve next

```

If you want, next I can give you the **same exercise as a shorter interviewer-style prompt**, or a **starter file structure**.
```
