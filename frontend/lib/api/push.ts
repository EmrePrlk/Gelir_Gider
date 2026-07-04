import { api } from './client'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const pushApi = {
  getVapidPublicKey: () =>
    api.get<{ vapid_public_key: string }>('/api/v1/auth/push/subscribe/'),

  subscribe: async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false

    const registration = await navigator.serviceWorker.ready
    const { vapid_public_key } = await pushApi.getVapidPublicKey()
    if (!vapid_public_key) return false

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapid_public_key),
    })

    const json = subscription.toJSON()
    await api.post('/api/v1/auth/push/subscribe/', {
      endpoint: json.endpoint,
      p256dh: json.keys?.p256dh,
      auth: json.keys?.auth,
    })

    localStorage.setItem('push_subscribed', '1')
    return true
  },

  unsubscribe: async (): Promise<void> => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        const sub = await registration.pushManager.getSubscription()
        if (sub) await sub.unsubscribe()
      }
      await api.delete('/api/v1/auth/push/subscribe/')
    } finally {
      localStorage.removeItem('push_subscribed')
    }
  },

  isSubscribed: (): boolean => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('push_subscribed') === '1'
  },
}
