function parseJwt(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
  return JSON.parse(jsonPayload)
}

// Define a function to check if the user is authenticated
function isAuthenticated(): boolean {
  const token = localStorage.getItem('accessToken')
  return !!token
}

// Define a function to check if auth required
export function isAuthRequired(routeName): boolean {
  console.log(routeName)
  if (
    routeName === '/' ||
    routeName === '/explore' ||
    routeName.startsWith('/community/') ||
    routeName.startsWith('/event/')
  ) {
    return false
  }
  return true
}

// if JWT token is expired
export function isTokenExpired(token) {
  if (!token) return true
  const tokenData = parseJwt(token)
  const currentTime = Math.floor(Date.now() / 1000) // Get current time in seconds
  return tokenData.exp < currentTime
}
