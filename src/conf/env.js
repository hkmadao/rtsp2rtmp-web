let env = process.env.NODE_ENV
let serverURL
 
if (env === 'development') {
    serverURL = "http://127.0.0.1:8080"
} else if (env === 'production') {
    serverURL = window.location.origin
}

export default {serverURL:serverURL}