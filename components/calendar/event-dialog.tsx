"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Loader2, Trash2, CheckCircle2, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CertCombobox } from "./cert-combobox"
import { createExamPlan, updateExamPlan, deleteExamPlan } from "@/lib/actions/exam-plans"
import type { Certification, ExamPlan } from "@/lib/types"
import { VENDOR_COLORS } from "@/lib/types"
import { toast } from "sonner"

export interface DialogState {
  open: boolean
  mode: "create" | "view"
  date?: Date
  plan?: ExamPlan
}

interface EventDialogProps {
  state: DialogState
  certifications: Certification[]
  onClose: () => void
  onSuccess: (plan: ExamPlan, action: "create" | "update" | "delete") => void
}

export function EventDialog({ state, certifications, onClose, onSuccess }: EventDialogProps) {
  const { open, mode, date, plan } = state

  const [selectedCert, setSelectedCert] = useState<Certification | null>(null)
  const [title, setTitle] = useState("")
  const [scheduledAt, setScheduledAt] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!open) return
    if (mode === "create") {
      setSelectedCert(null)
      setTitle("")
      setScheduledAt(date ? format(date, "yyyy-MM-dd") + "T09:00" : "")
      setNotes("")
      setEditing(false)
    } else if (plan) {
      const cert = certifications.find(c => c.id === plan.certification_id) ?? plan.certification ?? null
      setSelectedCert(cert)
      setTitle(plan.title)
      setScheduledAt(format(new Date(plan.scheduled_at), "yyyy-MM-dd'T'HH:mm"))
      setNotes(plan.notes ?? "")
      setEditing(false)
    }
  }, [open, mode, date, plan, certifications])

  function handleCertSelect(cert: Certification) {
    setSelectedCert(cert)
    if (!title || title === selectedCert?.name) {
      setTitle(cert.name)
    }
  }

  async function handleCreate() {
    if (!selectedCert || !title || !scheduledAt) return
    setLoading(true)
    const { data, error } = await createExamPlan({
      certification_id: selectedCert.id,
      title,
      scheduled_at: new Date(scheduledAt).toISOString(),
      notes: notes || undefined,
    })
    setLoading(false)
    if (error || !data) { toast.error(error ?? "Failed to create exam"); return }
    toast.success("Exam scheduled!")
    onSuccess({ ...data, certification: selectedCert }, "create")
  }

  async function handleUpdate() {
    if (!plan || !title || !scheduledAt) return
    setLoading(true)
    const { data, error } = await updateExamPlan(plan.id, {
      title,
      scheduled_at: new Date(scheduledAt).toISOString(),
      notes: notes || undefined,
    })
    setLoading(false)
    if (error || !data) { toast.error(error ?? "Failed to update"); return }
    toast.success("Exam updated")
    onSuccess({ ...data, certification: selectedCert ?? plan.certification }, "update")
  }

  async function handleStatusChange(status: "done" | "canceled") {
    if (!plan) return
    setLoading(true)
    const { data, error } = await updateExamPlan(plan.id, { status })
    setLoading(false)
    if (error || !data) { toast.error(error ?? "Failed to update status"); return }
    toast.success(status === "done" ? "Marked as done!" : "Exam canceled")
    onSuccess({ ...data, certification: plan.certification }, "update")
  }

  async function handleDelete() {
    if (!plan) return
    setLoading(true)
    const { error } = await deleteExamPlan(plan.id)
    setLoading(false)
    if (error) { toast.error(error); return }
    toast.success("Exam removed")
    onSuccess(plan, "delete")
  }

  const isViewMode = mode === "view" && !editing
  const vendor = selectedCert?.vendor ?? plan?.certification?.vendor

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? "Schedule Exam" : isViewMode ? "Exam Details" : "Edit Exam"}
            {vendor && (
              <Badge className={VENDOR_COLORS[vendor]} variant="secondary">
                {selectedCert?.vendor?.toUpperCase() ?? plan?.certification?.vendor?.toUpperCase()}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Certification */}
          <div className="space-y-1.5">
            <Label>Certification</Label>
            {isViewMode ? (
              <p className="text-sm font-medium">
                {plan?.certification?.name ?? plan?.title}
                {plan?.certification?.code && (
                  <span className="ml-1.5 text-muted-foreground text-xs">({plan.certification.code})</span>
                )}
              </p>
            ) : (
              <CertCombobox
                certifications={certifications}
                value={selectedCert?.id}
                onChange={handleCertSelect}
              />
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label>Title</Label>
            {isViewMode ? (
              <p className="text-sm">{plan?.title}</p>
            ) : (
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Exam title" />
            )}
          </div>

          {/* Date & Time */}
          <div className="space-y-1.5">
            <Label>Date & Time</Label>
            {isViewMode ? (
              <p className="text-sm">
                {plan && format(new Date(plan.scheduled_at), "PPP 'at' HH:mm")}
              </p>
            ) : (
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
              />
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label>Notes <span className="text-muted-foreground">(optional)</span></Label>
            {isViewMode ? (
              <p className="text-sm text-muted-foreground">{plan?.notes || "—"}</p>
            ) : (
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Study materials, exam center, etc."
                rows={3}
              />
            )}
          </div>

          {/* Status badge in view mode */}
          {isViewMode && plan && (
            <div className="flex items-center gap-2">
              <Badge variant={plan.status === "done" ? "default" : plan.status === "canceled" ? "destructive" : "outline"}>
                {plan.status}
              </Badge>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          {isViewMode ? (
            <>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleDelete} disabled={loading} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
                {plan?.status === "planned" && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleStatusChange("done")} disabled={loading}>
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />Done
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleStatusChange("canceled")} disabled={loading}>
                      <XCircle className="h-4 w-4 mr-1.5" />Cancel
                    </Button>
                  </>
                )}
              </div>
              <Button onClick={() => setEditing(true)} variant="default" size="sm">
                Edit
              </Button>
            </>
          ) : mode === "create" ? (
            <>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!selectedCert || !title || !scheduledAt || loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Schedule
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              <Button onClick={handleUpdate} disabled={!title || !scheduledAt || loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
