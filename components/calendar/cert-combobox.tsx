"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, PlusCircle, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createCustomCertification } from "@/lib/actions/certifications"
import type { Certification, Vendor } from "@/lib/types"
import { VENDOR_LABELS } from "@/lib/types"
import { VendorIcon } from "@/components/icons/vendor-icon"
import { CertLogo } from "@/components/icons/cert-logo"
import { toast } from "sonner"

interface CertComboboxProps {
  certifications: Certification[]
  value?: string
  onChange: (cert: Certification) => void
}

export function CertCombobox({ certifications, value, onChange }: CertComboboxProps) {
  const t = useTranslations("certCombobox")
  const tCommon = useTranslations("common")
  const [open, setOpen] = useState(false)
  const [customOpen, setCustomOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [certs, setCerts] = useState(certifications)
  const [customName, setCustomName] = useState("")
  const [customVendor, setCustomVendor] = useState<Vendor>("other")
  const [customCode, setCustomCode] = useState("")

  const selected = certs.find(c => c.id === value)

  async function handleCreateCustom() {
    if (!customName.trim()) return
    setLoading(true)
    const { data, error } = await createCustomCertification({
      name: customName.trim(),
      vendor: customVendor,
      code: customCode.trim() || undefined,
    })
    setLoading(false)
    if (error || !data) {
      toast.error(error ?? t("toastError"))
      return
    }
    setCerts(prev => [...prev, data])
    onChange(data)
    setCustomOpen(false)
    setOpen(false)
    setCustomName("")
    setCustomCode("")
    setCustomVendor("other")
    toast.success(t("toastAdded"))
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <span className="flex items-center gap-1.5 truncate">
              {selected ? (
                <>
                  <CertLogo cert={selected} className="h-4 w-4 shrink-0" />
                  {selected.name}{selected.code ? ` (${selected.code})` : ""}
                </>
              ) : (
                t("selectPlaceholder")
              )}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[460px] p-0" align="start">
          <Command>
            <CommandInput placeholder={t("searchPlaceholder")} />
            <CommandList className="max-h-[320px]">
              <CommandEmpty>{t("noResults")}</CommandEmpty>
              {(["aws", "azure", "cisco", "kubernetes", "gcp", "other"] as Vendor[]).map(vendor => {
                const group = certs.filter(c => c.vendor === vendor)
                if (!group.length) return null
                return (
                  <CommandGroup
                    key={vendor}
                    heading={
                      <span className="flex items-center gap-1.5">
                        <VendorIcon vendor={vendor} className="h-3 w-3" />
                        {VENDOR_LABELS[vendor]}
                      </span>
                    }
                  >
                    {group.map(cert => (
                      <CommandItem
                        key={cert.id}
                        value={`${cert.name} ${cert.code ?? ""}`}
                        onSelect={() => {
                          onChange(cert)
                          setOpen(false)
                        }}
                        className="py-2.5"
                      >
                        <Check className={cn("mr-2 h-4 w-4 shrink-0", value === cert.id ? "opacity-100" : "opacity-0")} />
                        <span className="flex-1">{cert.name}</span>
                        {cert.code && (
                          <span className="ml-4 text-xs text-muted-foreground tabular-nums">{cert.code}</span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )
              })}
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => { setCustomOpen(true); setOpen(false) }}
                  className="text-primary"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("addCustom")}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("customTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t("customNameRequired")}</Label>
              <Input
                placeholder={t("customNamePlaceholder")}
                value={customName}
                onChange={e => setCustomName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("customVendorLabel")}</Label>
              <Select value={customVendor} onValueChange={v => setCustomVendor(v as Vendor)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(VENDOR_LABELS) as [Vendor, string][]).map(([v, label]) => (
                    <SelectItem key={v} value={v}>
                      <span className="flex items-center gap-1.5">
                        <VendorIcon vendor={v} className="h-3.5 w-3.5 shrink-0" />
                        {label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("customCodeLabel")} <span className="text-muted-foreground">{t("customCodeOptional")}</span></Label>
              <Input
                placeholder={t("customCodePlaceholder")}
                value={customCode}
                onChange={e => setCustomCode(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomOpen(false)}>{tCommon("cancel")}</Button>
            <Button onClick={handleCreateCustom} disabled={!customName.trim() || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("customAddButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
