import { useMemo, useState } from "react"
import { analyzeRequest, generateReply } from "./api"
import { initialRequests } from "./data"
import type { SupportRequest, Triage } from "./types"

const RequestLists = ({
  requests,
  selectedId,
  onSelect,
}: {
  requests: SupportRequest[]
  selectedId: string | null
  onSelect: (id: string) => void
}) => {
  return (
    <section className="flex flex-col gap-2">
      {requests.map((req) => (
        <button
          key={req.id}
          onClick={() => onSelect(req.id)}
          className={`text-left rounded-xl border p-3 transition-colors ${
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

const RequestDetail = ({ request }: { request: SupportRequest | null }) => {
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
    () => requests.find((request) => request.id === selectedId) ?? null,
    [requests, selectedId],
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="grid grid-cols-[320px_1fr] gap-6 items-start">
        <div className="rounded-2xl bg-white p-4 shadow">
          <RequestLists
            requests={requests}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="rounded-2xl bg-white p-6 shadow min-h-[400px]">
          <RequestDetail request={selectedRequest} />
        </div>
      </div>
    </div>
  )
}
