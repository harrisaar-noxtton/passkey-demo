# Passkey Demo

This is a full-stack Passkey (WebAuthn) written in TypeScript using React and Node.js 

You can access the demo at https://infinite-sea-48162-fffc840315ed.herokuapp.com/

## Why Heroku?
Passkeys (WebAuthn) require a **Secure Context** (HTTPS) to function reliably. While browsers make an exception for `http://localhost`, mobile devices often fail to process passkeys correctly when testing via local network IPs or non-HTTPS connections. Deploying to Heroku provides a real HTTPS domain, which is the industry standard for stable cross-device (phone-to-computer) authentication.

## Environment Variables

The application requires the following environment variables to be defined. For local development, these should be placed in a `.env` file at the root. For production, these must be set as **Config Vars** in the Heroku dashboard.

| Variable | Description | Possible Values |
| :--- | :--- | :--- |
| **`RP_NAME`** | The human-readable name of your service displayed to the user on their phone/authenticator. | Any string (e.g., `"Passkey Demo"`, `"My Secure App"`). |
| **`RP_ID`** | The unique identifier for the domain the passkey is bound to; it must be the exact domain name. | `localhost` (local dev) or `your-app.herokuapp.com` (Heroku). |
| **`EXPECTED_ORIGIN`** | The full URL of your application that the browser uses to verify the source of the authentication request. | `http://localhost:3021` (local dev) or `https://your-app.herokuapp.com` (Heroku). |
| **`PORT`** | the port the server listens on. Heroku assigns this dynamically, so you don't need to set it in production. | `3021` (default local) or any valid port number. |

### Configuration Rules
1.  **Strict Origin**: `EXPECTED_ORIGIN` must match the URL in your browser exactly (including `http://` or `https://` and the port). It should **not** have a trailing slash.
2.  **RP ID Strictness**: `RP_ID` must be just the domain. Do **not** include the protocol (`https://`) or the port (e.g., use `google.com`, not `https://google.com:443`).
3.  **Heroku Deployment**: You **must** manually set `RP_ID` and `EXPECTED_ORIGIN` in the Heroku Settings tab. If these are missing, the server will throw an error and refuse to start to prevent insecure or broken authentication.

## Local Development
1. Create a `.env` file in the root based on `.env.example`.
2. Run `npm install`.
3. Run `npm run dev` to start the client and server concurrently.

## Data Persistence & Storage
For simplicity in this demonstration, user credentials and passkey data are stored in a local JSON file: `server-passkey/db.json`.

### ⚠️ Important Note for Heroku Deployment
Heroku uses an [ephemeral filesystem](https://devcenter.heroku.com/articles/dynos#ephemeral-filesystem). This means that any files created or modified at runtime—including the `db.json` file—will be **deleted** whenever the app is redeployed or the dyno restarts (which happens at least once every 24 hours).

If you are using this for more than a quick demo, you would need to replace this file-based storage with a persistent database solution such as PostgreSQL, MongoDB, or a cloud storage provider.

