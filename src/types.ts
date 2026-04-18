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
