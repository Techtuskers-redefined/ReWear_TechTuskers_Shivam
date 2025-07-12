const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Auth token management
let authToken: string | null = null

export const setAuthToken = (token: string) => {
  authToken = token
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

export const getAuthToken = () => {
  if (typeof window !== "undefined" && !authToken) {
    authToken = localStorage.getItem("authToken")
  }
  return authToken
}

export const removeAuthToken = () => {
  authToken = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
  }
}

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getAuthToken()

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "API request failed")
    }

    return data
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Auth API
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getProfile: () => apiRequest("/auth/me"),

  updateProfile: (profileData: any) =>
    apiRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  changePassword: (passwordData: { currentPassword: string; newPassword: string }) =>
    apiRequest("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    }),
}

// Items API
export const itemsAPI = {
  getItems: (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return apiRequest(`/items${queryString ? `?${queryString}` : ""}`)
  },

  getItem: (id: string) => apiRequest(`/items/${id}`),

  createItem: (formData: FormData) =>
    apiRequest("/items", {
      method: "POST",
      headers: {
        // Don't set Content-Type for FormData, but keep Authorization
        Authorization: getAuthToken() ? `Bearer ${getAuthToken()}` : "",
      },
      body: formData,
    }),

  updateItem: (id: string, itemData: any) =>
    apiRequest(`/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    }),

  deleteItem: (id: string) =>
    apiRequest(`/items/${id}`, {
      method: "DELETE",
    }),

  likeItem: (id: string) =>
    apiRequest(`/items/${id}/like`, {
      method: "POST",
    }),

  getMyItems: (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return apiRequest(`/items/my-items${queryString ? `?${queryString}` : ""}`)
  },
}

// Swaps API
export const swapsAPI = {
  // New item-to-item swap endpoints
  createSwap: (swapData: { offeredItemId: string; requestedItemId: string; message?: string }) =>
    apiRequest("/swaps/create", {
      method: "POST",
      body: JSON.stringify(swapData),
    }),

  respondToSwap: (swapId: string, responseData: { action: "accept" | "reject" | "counter"; counterOffer?: { pointDifference: number; message?: string } }) =>
    apiRequest(`/swaps/${swapId}/respond`, {
      method: "PUT",
      body: JSON.stringify(responseData),
    }),

  respondToCounterOffer: (swapId: string, action: "accept" | "reject") =>
    apiRequest(`/swaps/${swapId}/counter-response`, {
      method: "PUT",
      body: JSON.stringify({ action }),
    }),

  getPendingSwaps: () => apiRequest("/swaps/pending"),

  // Legacy endpoints (for backward compatibility)
  requestSwap: (itemId: string, message?: string) =>
    apiRequest(`/swaps/${itemId}/request`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  respondToLegacySwap: (itemId: string, requestId: string, action: "accept" | "reject") =>
    apiRequest(`/swaps/${itemId}/respond/${requestId}`, {
      method: "PUT",
      body: JSON.stringify({ action }),
    }),

  redeemWithPoints: (itemId: string) =>
    apiRequest(`/swaps/${itemId}/redeem`, {
      method: "POST",
    }),

  getSwapHistory: (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return apiRequest(`/swaps/history${queryString ? `?${queryString}` : ""}`)
  },
}

// Notifications API
export const notificationsAPI = {
  getNotifications: (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return apiRequest(`/notifications${queryString ? `?${queryString}` : ""}`)
  },

  markAsRead: (id: string) =>
    apiRequest(`/notifications/${id}/read`, {
      method: "PUT",
    }),

  markAllAsRead: () =>
    apiRequest("/notifications/mark-all-read", {
      method: "PUT",
    }),

  deleteNotification: (id: string) =>
    apiRequest(`/notifications/${id}`, {
      method: "DELETE",
    }),

  getStats: () => apiRequest("/notifications/stats"),
}

// Admin API
export const adminAPI = {
  getPendingItems: (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return apiRequest(`/admin/items/pending${queryString ? `?${queryString}` : ""}`)
  },

  approveItem: (id: string) =>
    apiRequest(`/admin/items/${id}/approve`, {
      method: "PUT",
    }),

  rejectItem: (id: string, reason: string) =>
    apiRequest(`/admin/items/${id}/reject`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    }),

  getUsers: (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return apiRequest(`/admin/users${queryString ? `?${queryString}` : ""}`)
  },

  getStats: () => apiRequest("/admin/stats"),
}
