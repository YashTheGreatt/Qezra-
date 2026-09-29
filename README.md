# QezraTheGreat Portfolio (Express backend)

A responsive Minecraft developer portfolio with:
- Express backend and `/api/portfolio` endpoint
- Contact form posting to `/api/contact`
- Server-side validation, 30-second per-IP cooldown, and a honeypot field
- Contact messages stored in `data/contacts.json`
- Responsive layout and mobile navigation

## Run locally
1. Install Node.js 18 or newer.
2. Extract this folder and open a terminal inside it.
3. Run `npm install`
4. Run `npm start`
5. Visit `http://localhost:3000`

For development with Node's watch mode: `npm run dev`.

## Customize
Edit the `portfolio` object near the top of `server.js` to change your bio, availability, skills, projects, services, Discord, and email. Avoid publishing private contact information unless you want it public.

## Deployment
Deploy to a Node.js host that supports Express. Set `PORT` if required. The `data/` directory must be writable and persistent if you want contact submissions retained between restarts. For a public production deployment, use a persistent database or managed form/email service, HTTPS, and appropriate abuse protection. Do not commit `data/contacts.json` containing personal messages.


## Deploy from GitHub with Render
1. Create a GitHub repository and upload the project files (the contents of this folder, not the ZIP itself).
2. Sign in to Render and choose **New + → Web Service**.
3. Connect the GitHub repository.
4. Set **Runtime** to Node, **Build Command** to `npm install`, and **Start Command** to `npm start`.
5. Deploy. Render will provide a public website URL.
6. If you want contact submissions to persist, configure a persistent disk or use a managed database. The included JSON file is suitable for local testing, not durable production storage on many hosting platforms.

The project is already configured to listen on `process.env.PORT`, as required by common Node.js hosts.
