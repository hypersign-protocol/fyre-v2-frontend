import auth0 from 'auth0-js'

// //(config);
export const webAuth = new auth0.WebAuth({
  domain: import.meta.env.VITE_APP_AUTH0_DOMAIN,
  clientID: import.meta.env.VITE_APP_AUTH0_CLIENT_ID,
  responseType: 'token id_token',
  scope: 'openid profile email',
  redirectUri: 'http://172.20.10.8:9002/connectwithtwitter'
})
