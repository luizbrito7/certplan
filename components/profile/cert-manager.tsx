"use client"

import { useState } from "react"
import { PlusCircle, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { CertBadge } from "./cert-badge"
import { CertCombobox } from "@/components/calendar/cert-combobox"
import { addUserCertification, removeUserCertification } from "@/lib/actions/user-certifications"
import type { Certification, CertStatus, UserCertification } from "@/lib/types"
import { toast } from "sonner"

interface CertManagerProps {
  status: CertStatus
  userCerts: UserCertification[]
  certifications: Certification[]
  label: string
}

export function CertManager({ status, userCerts: initial, certifications, label }: CertManagerProps) {
  const t = useTranslations("profile")
  const tCommon = useTranslations("common")
  const [certs, setCerts] = useState<UserCertification[]>(initial)
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null)

  async function handleAdd() {
    if (!selectedCert) return
    setLoading(true)
    const { data, error } = await addUserCertification({
      certification_id: selectedCert.id,
      status,
    })
    setLoading(false)
    if (error || !data) { toast.error(error ?? t("toastCertError")); return }
    setCerts(prev => [...prev, { ...data, certification: selectedCert }])
    setAdding(false)
    setSelectedCert(null)
    toast.success(t("toastCertAdded"))
  }

  async function handleRemove(id: string) {
    const { error } = await removeUserCertification(id)
    if (error) { toast.error(error); return }
    setCerts(prev => prev.filter(c => c.id !== id))
  }

  const alreadyHaveIds = new Set(certs.map(c => c.certification_id))
  const available = certifications.filter(c => !alreadyHaveIds.has(c.id))

  return (
    <div className="space-y-3">
      {label && (
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{label}</h3>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {certs.map(uc => (
          <CertBadge
            key={uc.id}
            userCert={uc}
            onRemove={handleRemove}
            removeLabel={t("removeCert")}
            muted={status === "seeking"}
          />
        ))}
        {certs.length === 0 && !adding && (
          <p className="text-sm text-muted-foreground sm:col-span-2">{t("noneYet")}</p>
        )}
      </div>

      {adding ? (
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <CertCombobox
              certifications={available}
              value={selectedCert?.id}
              onChange={setSelectedCert}
            />
          </div>
          <Button size="sm" onClick={handleAdd} disabled={!selectedCert || loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("add")}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setSelectedCert(null) }}>
            {tCommon("cancel")}
          </Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
          <PlusCircle className="h-4 w-4 mr-1.5" />
          {t("add")}
        </Button>
      )}
    </div>
  )
}
