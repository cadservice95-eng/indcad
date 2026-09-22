"use client";

import { useRouter } from "next/navigation";
import { Download, Eye, Trash2 } from "lucide-react";
import { api } from "./api";
import { useConfirm, useToast } from "./feedback";
import { btn } from "./ui";

const PREVIEWABLE = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);

export function AttachmentActions({ id, name, mimeType }: { id: string; name: string; mimeType: string }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  async function remove() {
    if (!(await confirm({ title: `Delete ${name}?`, message: "The file is removed permanently from the enquiry.", confirmLabel: "Delete file", destructive: true }))) return;
    const result = await api(`/api/admin/attachments/${id}/`, { method: "DELETE" });
    if (!result.ok) return toast.error(result.error);
    toast.success("Attachment deleted.");
    router.refresh();
  }

  return (
    <div className="flex justify-end gap-1.5">
      {PREVIEWABLE.has(mimeType) ? (
        <a href={`/api/admin/attachments/${id}/download/?inline=1`} target="_blank" rel="noopener noreferrer" className={btn.small} aria-label={`Preview ${name}`}>
          <Eye className="h-3.5 w-3.5" aria-hidden /> Preview
        </a>
      ) : null}
      <a href={`/api/admin/attachments/${id}/download/`} className={btn.small} aria-label={`Download ${name}`}>
        <Download className="h-3.5 w-3.5" aria-hidden /> Download
      </a>
      <button type="button" onClick={remove} className={`${btn.small} text-red-700`} aria-label={`Delete ${name}`}>
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}
