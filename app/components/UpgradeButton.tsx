'use client'

export default function UpgradeButton({
  clinicId,
  clinicName,
}: {
  clinicId: string
  clinicName: string
}) {
  async function handleUpgrade() {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clinicId, clinicName }),
    })

    const data = await res.json()
    window.location.href = data.url
  }

  return (
    <button
      onClick={handleUpgrade}
      style={{
        padding: '6px 12px',
        cursor: 'pointer',
        background: '#0ea5e9',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
      }}
    >
      Upgrade to Featured
    </button>
  )
}