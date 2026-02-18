Remed is a small COD (pay-on-delivery) one-page landing built with Next.js.

## Getting Started

### 1) Install & run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Landing UI is in `app/components/Landing.tsx`.

### 2) Configure order storage (Google Sheets)

The API route `POST /api/orders` appends orders to a Google Sheet and sends an email notification.

- Create a Google Sheet (example name: "Remed Orders")
- Create a tab (sheet) named `Orders`
- Add a header row with these columns:
  - `createdAt`, `locale`, `packId`, `quantity`, `customerName`, `phone`, `address`, `utmSource`, `utmCampaign`, `referrer`
- Create a Google Service Account and share the sheet with the service account email as **Editor**

Notes:

- `GOOGLE_SHEET_ID` should ideally be the raw sheet ID (the part between `/d/` and `/edit`). A full Google Sheets URL also works.
- If you see a Sheets API `404 Requested entity was not found`, it almost always means the sheet wasn’t shared with the service account email (or the ID is wrong).

Create a `.env.local` file and fill in values (no spaces around `=` is best).

### 3) Configure email notifications (Resend)

- Create a Resend account + API key
- Set `RESEND_API_KEY` and `NOTIFY_EMAIL_TO`

Note: the sender is currently `Remed <onboarding@resend.dev>` (good for testing). For production, verify your domain/sender in Resend.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
