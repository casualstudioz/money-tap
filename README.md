# Money Tap

A quick money tracker for iPhone. Double-tap the back of your phone, enter an amount, and you're done. It also gives you a report with your budget forecast, where your money went, savings growth and insights.

- Works in any browser and needs no account.
- Entries are saved on your phone. You can also back them up and sync them to a **Google Sheet** through a small Google Apps Script.

## 1. Publish on GitHub Pages
1. On GitHub, click **New repository**, name it `money-tap` and make it **Public**.
2. Click **Add file › Upload files** and drag in everything from this folder: `index.html`, `manifest.webmanifest`, the 3 icons, `README.md` and the `apps-script` folder. Click **Commit changes**.
3. Go to **Settings › Pages**, set Source to **Deploy from a branch**, choose Branch **main** and folder **/ (root)**, then click **Save**.
4. After about a minute, your app is live at `https://YOUR-USERNAME.github.io/money-tap/`.

## 2. Connect your Google Sheet (optional, recommended)
1. Open your **Money Tap Ledger** sheet, or any sheet. A tab named `Ledger` is created if it doesn't exist.
2. Go to **Extensions › Apps Script**, delete the sample code, and paste in everything from `apps-script/Code.gs`.
3. Change `KEY` at the top to a secret word of your own, then click **Save**.
4. Click **Deploy › New deployment**. Click ⚙ and choose **Web app**. Set Execute as **Me** and Who has access to **Anyone**. Click **Deploy** and allow access when Google asks.
5. Copy the **Web app URL**. It ends in `/exec`.
6. In Money Tap, tap ⚙ › paste the URL and your key › **Save settings** › **Upload all to sheet** (or **Load from sheet** if the sheet already has your entries).

From then on, every entry is copied to the sheet. When you open the app, it loads the latest entries from the sheet, so all your devices stay in step.

> If you edit `Code.gs` later, use **Deploy › Manage deployments › Edit › New version** so the URL stays the same.

## 3. iPhone Back Tap
1. Open the **Shortcuts** app › **+** › add the **Open URLs** action › paste your GitHub Pages link › name the shortcut **Money Tap**.
2. Go to **Settings › Accessibility › Touch › Back Tap › Double Tap** and choose **Money Tap**.
3. Optional: add `#report` to the end of the link in a second shortcut and set it as **Triple Tap** to open the report straight away.

Tip: In Safari, tap **Share › Add to Home Screen** to get a full-screen app icon as well.

## Privacy
- The code in this repository contains no personal data.
- Your entries live in your browser and in your own Google Sheet.
- The Apps Script URL and key are saved only on your phone, never in the code. Keep them private, because anyone with both can read and write your sheet.
