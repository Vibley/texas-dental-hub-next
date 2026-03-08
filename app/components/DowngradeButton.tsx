"use client"

export default function DowngradeButton({
  clinicId,
}: {
  clinicId: string
}) {
  async function downgrade() {
    if (!confirm("Remove featured status from this clinic?")) return

    await fetch("/api/admin/downgrade-clinic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clinicId }),
    })

    location.reload()
  }

  return (
    <button
      onClick={downgrade}
      style={{
        background: "#ef4444",
        color: "white",
        padding: "6px 12px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Downgrade
    </button>
  )
}