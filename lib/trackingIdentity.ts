const VISITOR_KEY = 'tdh_visitor_id'
const SESSION_KEY = 'tdh_session_id'
const SESSION_ACTIVITY_KEY = 'tdh_session_last_activity'

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

function generateId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).substring(2)}`
}

export function getTrackingIdentity() {
  if (typeof window === 'undefined') {
    return {
      visitorId: null,
      sessionId: null,
    }
  }

  /*
   * VISITOR ID
   * Persists in this browser.
   */
  let visitorId = localStorage.getItem(VISITOR_KEY)

  if (!visitorId) {
    visitorId = generateId()
    localStorage.setItem(VISITOR_KEY, visitorId)
  }

  /*
   * SESSION ID
   * New session after 30 minutes of inactivity.
   */
  const now = Date.now()

  let sessionId = sessionStorage.getItem(SESSION_KEY)

  const lastActivityString =
    sessionStorage.getItem(SESSION_ACTIVITY_KEY)

  const lastActivity =
    lastActivityString
      ? Number(lastActivityString)
      : 0

  const sessionExpired =
    !lastActivity ||
    now - lastActivity > SESSION_TIMEOUT

  if (!sessionId || sessionExpired) {
    sessionId = generateId()
    sessionStorage.setItem(SESSION_KEY, sessionId)
  }

  sessionStorage.setItem(
    SESSION_ACTIVITY_KEY,
    now.toString()
  )

  return {
    visitorId,
    sessionId,
  }
}