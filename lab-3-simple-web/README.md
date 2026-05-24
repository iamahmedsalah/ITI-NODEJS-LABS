# Portfolio Site

A clean, minimal 4-page portfolio site built with Node.js and Express.

## Pages

| Route | Description |
|---|---|
| `/` | Home — bio + portrait |
| `/contact` | Contact form (name, email, message) |
| `/message-sent` | Thank-you confirmation after form submit |
| `/*` | 404 Not Found |

## Quick Start

```bash
# Install dependencies
npm install

# Run (production)
npm start

# Run with auto-reload (Node 18+)
npm run dev
```

The server starts at **http://localhost:3000** by default.  
Set `PORT=8080` (or any port) via environment variable to override.

## Add Your Photo

Replace the placeholder in `views/home.html`:

```html
<!-- Change this placeholder… -->
<div class="home-avatar-placeholder">PHOTO</div>

<!-- …to this, with your image in /public/images/ -->
<img src="/images/avatar.jpg" alt="Your Name" class="home-avatar" />
```

## Enable Email (Optional)

Uncomment the `nodemailer` block in `server.js` and set these env vars:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=you@example.com
```

> For Gmail, use an **App Password** (not your main password).  
> Google → Account → Security → 2FA → App Passwords.

## Customise

- **Name/brand**: search-replace `NAME` across the HTML views.
- **Bio copy**: edit `views/home.html`.
- **Contact intro**: edit `views/contact.html`.
- **Footer year**: edit the `© 2026` line in each view.
- **Colours / fonts**: tweak CSS variables at the top of `public/style.css`.
