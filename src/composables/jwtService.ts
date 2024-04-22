const TOKEN_KEY = 'accessToken' as string

/**
 * @description get token form localStorage
 */
export const getToken = (): string | null => {
  return window.localStorage.getItem(TOKEN_KEY)
}

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
  window.localStorage.setItem(TOKEN_KEY, token)
}

/**
 * @description save role into localStorage
 * @param user: unknown
 */
export const saveUser = (user) => {
  window.localStorage.setItem('user', JSON.stringify(user))
}

/**
 * @description get role from localstorage
 */
export const getUser = () => {
  return JSON.parse(window.localStorage.getItem('user') || '{}')
}

/**
 * @description remove token form localStorage
 */
export const destroyToken = (): void => {
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem('user')
}

export default { getToken, saveToken, destroyToken, saveUser, getUser }
