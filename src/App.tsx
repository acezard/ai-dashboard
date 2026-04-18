import { useCallback, useMemo, useState } from "react"
import { analyzeRequest, generateReply } from "./api"
import { initialRequests } from "./data"
import type { Priority, SupportRequest, Triage } from "./types"

const RequestLists = ({
  requests,
  selectedId,
  onSelect,
  analysisLoading,
}: {
  requests: SupportRequest[]
  selectedId: string | null
  onSelect: (id: string) => void
  analysisLoading: boolean
}) => {
  return (
    <section
      className={`flex flex-col gap-2 ${analysisLoading ? "pointer-events-none opacity-50" : ""}`}
    >
      {requests.map((req) => (
        <button
          key={req.id}
          onClick={() => {
            onSelect(req.id)
          }}
          className={`cursor-pointer text-left rounded-xl border p-3 transition-colors ${
            req.id === selectedId
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <p className="text-sm font-medium text-gray-900 truncate">
            {req.title}
          </p>
          <p className="text-xs text-gray-500">{req.requester}</p>
          <p className="text-xs text-gray-500">{req.source}</p>
          <span className="text-xs text-gray-400 capitalize">{req.status}</span>
        </button>
      ))}
    </section>
  )
}

type RequestDetailProps = {
  request: SupportRequest | null
  analysisLoading: boolean
  analysisError: string
  replyLoading: boolean
  handleAnalyze: () => void
  handleGenerateReply: () => void
  updateSelectedTriage: <K extends keyof Triage>(
    field: K,
    value: Triage[K],
  ) => void
  updateReplyDraft: (value: string) => void
  handleConfirmTriage: () => void
}

const RequestDetail = ({
  request,
  analysisLoading,
  analysisError,
  replyLoading,
  handleAnalyze,
  handleGenerateReply,
  updateSelectedTriage,
  updateReplyDraft,
  handleConfirmTriage,
}: RequestDetailProps) => {
  if (!request)
    return <p className="text-gray-400 text-sm">No request selected.</p>

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{request.title}</h2>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {request.requester} · {request.source}
          </span>
          <span className="capitalize">{request.status}</span>
        </div>
      </div>
      <p className="text-sm text-gray-700 whitespace-pre-wrap">
        {request.rawText}
      </p>
      {request.triage && (
        <form className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Summary</label>
            <textarea
              value={request.triage.summary}
              onChange={(e) => {
                updateSelectedTriage("summary", e.target.value)
              }}
              rows={2}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Category
              </label>
              <input
                value={request.triage.category}
                onChange={(e) => {
                  updateSelectedTriage("category", e.target.value)
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Priority
              </label>
              <select
                value={request.triage.priority}
                onChange={(e) => {
                  updateSelectedTriage("priority", e.target.value as Priority)
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Owner Team
              </label>
              <input
                value={request.triage.ownerTeam}
                onChange={(e) => {
                  updateSelectedTriage("ownerTeam", e.target.value)
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Confidence
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={request.triage.confidence}
                onChange={(e) => {
                  updateSelectedTriage("confidence", Number(e.target.value))
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Next Step
            </label>
            <textarea
              value={request.triage.nextStep}
              onChange={(e) => {
                updateSelectedTriage("nextStep", e.target.value)
              }}
              rows={2}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      )}
      {analysisError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-5.25a.75.75 0 001.5 0v-4.5a.75.75 0 00-1.5 0v4.5zm.75-7a.75.75 0 100 1.5.75.75 0 000-1.5z"
              clipRule="evenodd"
            />
          </svg>
          {analysisError}
        </div>
      )}
      <div className="flex justify-end gap-2">
        {request.triage && (
          <button
            type="button"
            onClick={handleConfirmTriage}
            disabled={
              analysisLoading || replyLoading || request.status === "confirmed"
            }
            className="flex items-center gap-2 rounded-xl border border-green-600 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-50 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {request.status === "confirmed" ? "Confirmed" : "Confirm triage"}
          </button>
        )}
        {request.triage && (
          <button
            onClick={handleGenerateReply}
            disabled={replyLoading || analysisLoading}
            className="flex items-center gap-2 rounded-xl border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {replyLoading && (
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {replyLoading ? "Generating…" : "Generate reply"}
          </button>
        )}
        <button
          onClick={handleAnalyze}
          disabled={analysisLoading || !!request.triage}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {analysisLoading && (
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {analysisLoading ? "Analyzing…" : "Analyze"}
        </button>
      </div>
      {(request.replyDraft !== undefined && request.replyDraft !== "") ||
      replyLoading ? (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">
            Reply draft
          </label>
          <textarea
            value={request.replyDraft}
            onChange={(e) => updateReplyDraft(e.target.value)}
            rows={4}
            placeholder="Reply draft will appear here…"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ) : null}
    </section>
  )
}

export default function App() {
  const [requests, setRequests] = useState<SupportRequest[]>(initialRequests)
  const [selectedId, setSelectedId] = useState<string | null>(
    initialRequests[0]?.id ?? null,
  )
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisError, setAnalysisError] = useState("")
  const [replyLoading, setReplyLoading] = useState(false)

  const selectedRequest = useMemo(
    () => requests?.find((request) => request.id === selectedId) ?? null,
    [requests, selectedId],
  )

  const handleAnalyze = useCallback(() => {
    const run = async () => {
      setAnalysisError("")
      setAnalysisLoading(true)

      try {
        if (!selectedRequest) return

        const triage = await analyzeRequest(selectedRequest)

        setAnalysisError("")

        setRequests((prev) =>
          prev.map((r) =>
            r.id === selectedRequest.id
              ? { ...r, triage, status: "triaged" }
              : r,
          ),
        )
      } catch (error: unknown) {
        if (error instanceof Error) {
          setAnalysisError(error.message)
        } else {
          setAnalysisError("Something bad happened")
        }
      } finally {
        setAnalysisLoading(false)
      }
    }

    void run()
  }, [selectedRequest])

  const handleGenerateReply = useCallback(() => {
    const run = async () => {
      if (!selectedRequest) return
      setReplyLoading(true)
      try {
        const reply = await generateReply(selectedRequest)
        setRequests((prev) =>
          prev.map((r) =>
            r.id === selectedRequest.id ? { ...r, replyDraft: reply } : r,
          ),
        )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: unknown) {
        // silent at this point
      }
        finally {
        setReplyLoading(false)
      }
    }
    void run()
  }, [selectedRequest])

  const handleConfirmTriage = useCallback(() => {
    if (!selectedId) return
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedId && r.triage ? { ...r, status: "confirmed" } : r,
      ),
    )
  }, [selectedId])

  const updateReplyDraft = useCallback(
    (value: string) => {
      if (!selectedId) return
      setRequests((prev) =>
        prev.map((r) =>
          r.id === selectedId ? { ...r, replyDraft: value } : r,
        ),
      )
    },
    [selectedId],
  )

  const updateSelectedTriage = <K extends keyof Triage>(
    field: K,
    value: Triage[K],
  ) => {
    if (!selectedId) return

    setRequests((currentRequests) =>
      currentRequests.map((request) => {
        if (request.id !== selectedId || !request.triage) return request

        return {
          ...request,
          triage: {
            ...request.triage,
            [field]: value,
          },
        }
      }),
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="grid grid-cols-[320px_1fr] gap-6 items-start">
        <div className="rounded-2xl bg-white p-4 shadow">
          <RequestLists
            requests={requests}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id)
              setAnalysisError("")
            }}
            analysisLoading={analysisLoading}
          />
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <RequestDetail
            request={selectedRequest}
            analysisLoading={analysisLoading}
            analysisError={analysisError}
            replyLoading={replyLoading}
            handleAnalyze={handleAnalyze}
            handleGenerateReply={handleGenerateReply}
            updateSelectedTriage={updateSelectedTriage}
            updateReplyDraft={updateReplyDraft}
            handleConfirmTriage={handleConfirmTriage}
          />
        </div>
      </div>
    </div>
  )
}
