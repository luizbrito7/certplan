"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { useLocale, useTranslations } from "next-intl"
import { CalendarIcon, Loader2, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CertLogo } from "@/components/icons/cert-logo"
import { CertCombobox } from "./cert-combobox"
import { createExamPlan, updateExamPlan, deleteExamPlan } from "@/lib/actions/exam-plans"
import type { Certification, ExamPlan } from "@/lib/types"
import { VENDOR_COLORS, VENDOR_LABELS } from "@/lib/types"
import { toast } from "sonner"
import { getDateFnsLocale } from "@/lib/date"

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

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0"))

export function EventDialog({ state, certifications, onClose, onSuccess }: EventDialogProps) {
  const t = useTranslations("eventDialog")
  const tc = useTranslations("calendar")
  const locale = useLocale()
  const dateLocale = getDateFnsLocale(locale)

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
    if (error || !data) { toast.error(error ?? t("toastCreateError")); return }
    toast.success(t("toastCreated"))
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
    if (error || !data) { toast.error(error ?? t("toastUpdateError")); return }
    toast.success(t("toastUpdated"))
    onSuccess({ ...data, certification: selectedCert ?? plan.certification }, "update")
  }

  async function handleStatusChange(status: "done" | "canceled") {
    if (!plan) return
    setLoading(true)
    const { data, error } = await updateExamPlan(plan.id, { status })
    setLoading(false)
    if (error || !data) { toast.error(error ?? t("toastStatusError")); return }
    toast.success(status === "done" ? t("toastDone") : t("toastCanceled"))
    onSuccess({ ...data, certification: plan.certification }, "update")
  }

  async function handleDelete() {
    if (!plan) return
    setLoading(true)
    const { error } = await deleteExamPlan(plan.id)
    setLoading(false)
    if (error) { toast.error(error); return }
    toast.success(t("toastDeleted"))
    onSuccess(plan, "delete")
  }

  const isViewMode = mode === "view" && !editing
  const vendor = selectedCert?.vendor ?? plan?.certification?.vendor

  function formatDateTime(isoString: string) {
    const d = new Date(isoString)
    const datePart = format(d, "PPP", { locale: dateLocale })
    const timePart = format(d, "HH:mm")
    return `${datePart} ${tc("at")} ${timePart}`
  }

  function getScheduledDate() {
    return scheduledAt ? new Date(scheduledAt) : undefined
  }

  function updateScheduledDate(nextDate?: Date) {
    if (!nextDate) return
    const current = getScheduledDate()
    nextDate.setHours(current?.getHours() ?? 9, current?.getMinutes() ?? 0, 0, 0)
    setScheduledAt(format(nextDate, "yyyy-MM-dd'T'HH:mm"))
  }

  function updateScheduledTime(type: "hour" | "minute", value: string) {
    const current = getScheduledDate() ?? date ?? new Date()
    const next = new Date(current)
    if (type === "hour") next.setHours(Number(value))
    if (type === "minute") next.setMinutes(Number(value))
    next.setSeconds(0, 0)
    setScheduledAt(format(next, "yyyy-MM-dd'T'HH:mm"))
  }

  const selectedScheduledDate = getScheduledDate()

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? t("scheduleTitle") : isViewMode ? t("viewTitle") : t("editTitle")}
            {(selectedCert ?? plan?.certification) && vendor && (
              <Badge className={cn("flex items-center gap-1.5", VENDOR_COLORS[vendor])} variant="secondary">
                <CertLogo
                  cert={(selectedCert ?? plan?.certification)!}
                  className="h-4 w-4"
                />
                {VENDOR_LABELS[vendor]}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Certification */}
          <div className="space-y-1.5">
            <Label>{t("certification")}</Label>
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
            <Label>{t("titleLabel")}</Label>
            {isViewMode ? (
              <p className="text-sm">{plan?.title}</p>
            ) : (
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder={t("titlePlaceholder")} />
            )}
          </div>

          {/* Date & Time */}
          <div className="space-y-1.5">
            <Label>{t("dateTime")}</Label>
            {isViewMode ? (
              <p className="text-sm">
                {plan && formatDateTime(plan.scheduled_at)}
              </p>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start px-3 text-left font-normal",
                      !scheduledAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {selectedScheduledDate
                      ? formatDateTime(selectedScheduledDate.toISOString())
                      : t("dateTime")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="z-[60] w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedScheduledDate}
                    onSelect={updateScheduledDate}
                    locale={dateLocale}
                  />
                  <div className="flex items-center gap-2 border-t p-3">
                    <Select
                      value={selectedScheduledDate ? format(selectedScheduledDate, "HH") : "09"}
                      onValueChange={value => updateScheduledTime("hour", value)}
                    >
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[70] max-h-56">
                        {HOURS.map(hour => (
                          <SelectItem key={hour} value={hour} className="cursor-pointer">
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">:</span>
                    <Select
                      value={selectedScheduledDate ? format(selectedScheduledDate, "mm") : "00"}
                      onValueChange={value => updateScheduledTime("minute", value)}
                    >
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[70] max-h-56">
                        {MINUTES.map(minute => (
                          <SelectItem key={minute} value={minute} className="cursor-pointer">
                            {minute}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label>{t("notes")} <span className="text-muted-foreground">{t("notesOptional")}</span></Label>
            {isViewMode ? (
              <p className="text-sm text-muted-foreground">{plan?.notes || "-"}</p>
            ) : (
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={t("notesPlaceholder")}
                rows={3}
              />
            )}
          </div>

          {/* Status badge in view mode */}
          {isViewMode && plan && (
            <div className="flex items-center gap-2">
              <Badge variant={plan.status === "done" ? "default" : plan.status === "canceled" ? "destructive" : "outline"}>
                {tc(`status.${plan.status}`)}
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
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />{t("done")}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleStatusChange("canceled")} disabled={loading}>
                      <XCircle className="h-4 w-4 mr-1.5" />{t("cancelExam")}
                    </Button>
                  </>
                )}
              </div>
              <Button onClick={() => setEditing(true)} variant="default" size="sm">
                {t("edit")}
              </Button>
            </>
          ) : mode === "create" ? (
            <>
              <Button variant="outline" onClick={onClose}>{t("cancel")}</Button>
              <Button onClick={handleCreate} disabled={!selectedCert || !title || !scheduledAt || loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("schedule")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditing(false)}>{t("cancel")}</Button>
              <Button onClick={handleUpdate} disabled={!title || !scheduledAt || loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("save")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
