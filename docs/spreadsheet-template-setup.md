# Free credentialing spreadsheet template — setup

Fase 5 of the spec: a free, no-email-required Google Sheet that circulates
on its own, carrying a link back to the product wherever it goes. This has
to be created under your own Google account (Claude has no Google Sheets
access in this session) — these are the exact contents to paste in. Should
take about 5 minutes.

## 1. Create the sheet

1. Go to [sheets.google.com](https://sheets.google.com) → Blank spreadsheet.
2. Rename it "Credentialing & Expiration Tracker — Free Template".
3. Rename "Sheet1" to **Credentials**.

## 2. Credentials tab

With the **Credentials** tab active: File → Import → Upload
[`spreadsheet-template.csv`](spreadsheet-template.csv) → Import location:
**Replace current sheet**. Columns A-F are plain data; G and H are
formulas you add next. Row 1 is headers, data starts row 2.

**G2** (Days Until Expiration) — fill down for every row:
```
=IF(F2="","",F2-TODAY())
```

**H2** (Status) — fill down for every row:
```
=IF(F2="","",IF(F2<TODAY(),"Expired",IF(F2<=TODAY()+30,"Expiring Soon","Active")))
```

**Conditional formatting** on column H (Format → Conditional formatting):
- Text is exactly "Expired" → red background
- Text is exactly "Expiring Soon" → yellow/orange background
- Text is exactly "Active" → green background

**Freeze row 1** (View → Freeze → 1 row) so headers stay visible.

**Row 2 note:** insert a new row 2 (pushing data to row 3+) with a single
merged cell across A:I reading:

> 🔗 Need more than a spreadsheet? Automatic status, payer enrollment
> tracking, and email alerts before things expire — sokndall-h110-credentialing.vercel.app
> (swap in the real domain once attached)

This is the "fixed row" the spec calls for — it travels with every copy,
not just the post that shares it.

## 3. Dashboard tab (new tab, name it "Dashboard")

```
A1: Already Expired    B1: =COUNTIF(Credentials!H:H,"Expired")
A2: Expiring in 30 days  B2: =COUNTIFS(Credentials!G:G,">=0",Credentials!G:G,"<=30")
A3: Expiring in 60 days  B3: =COUNTIFS(Credentials!G:G,">30",Credentials!G:G,"<=60")
A4: Expiring in 90 days  B4: =COUNTIFS(Credentials!G:G,">60",Credentials!G:G,"<=90")
```

## 4. Cover tab (new first tab, name it "Read me")

Move this tab to be first (drag its tab to the far left). Contents:

```
Free Credentialing & Expiration Tracker
Powered by Sokndall — sokndall-h110-credentialing.vercel.app

Copy this sheet (File → Make a copy) and it's yours. Track provider
credentials, licenses, and expiration dates in the "Credentials" tab, see
what's coming due in "Dashboard".

Outgrown a spreadsheet? Sokndall does this automatically — plus payer
enrollment tracking, CSV import for your whole roster, and email alerts
before anything expires. sokndall-h110-credentialing.vercel.app/pricing
```

## 5. Publish it

1. Share → General access → **Anyone with the link → Viewer**.
2. File → Share → **Publish to web** is not needed; "Anyone with the link"
   plus a public "File → Make a copy" is what lets people duplicate it
   without asking access or leaving an email — matches the spec
   ("copia libre, sin pedir email").
3. Copy the sheet's URL and give it to Claude to wire into
   `NEXT_PUBLIC_TEMPLATE_SHEET_URL` (Vercel env var + `.env.local`) — that's
   what `/credentialing-spreadsheet-template` links to.

## 6. Landing page

Already built: `app/credentialing-spreadsheet-template/page.jsx`. Shows a
"coming soon" placeholder until `NEXT_PUBLIC_TEMPLATE_SHEET_URL` is set.
