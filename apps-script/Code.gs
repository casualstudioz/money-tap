/**
 * Money Tap: Google Sheet backend.
 *
 * Paste this into Extensions › Apps Script on your Money Tap Ledger sheet.
 * 1. Change KEY below to your own secret word (no spaces).
 * 2. Deploy › New deployment › Web app.
 *    Execute as: Me. Who has access: Anyone.
 * 3. Copy the Web app URL and paste it, with the same KEY, into Money Tap › Settings.
 *
 * Anyone who has both the URL and the KEY can read and write this sheet,
 * so keep them private.
 */
const KEY = 'change-me-to-a-secret';
const SHEET = 'Ledger';
const HEADER = ['Date', 'Month', 'Type', 'Category', 'Amount', 'Note', 'Entry ID'];
const SETTINGS_SHEET = 'App Settings';
const SETTING_KEYS = ['currency', 'budget', 'goal'];

function readSettings_() {
  const sh = SpreadsheetApp.getActive().getSheetByName(SETTINGS_SHEET);
  if (!sh || sh.getLastRow() < 1) return null;
  const out = {};
  sh.getRange(1, 1, sh.getLastRow(), 2).getValues().forEach(r => { if (SETTING_KEYS.indexOf(String(r[0])) >= 0) out[r[0]] = r[1]; });
  return Object.keys(out).length ? out : null;
}

function writeSettings_(obj) {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SETTINGS_SHEET) || ss.insertSheet(SETTINGS_SHEET);
  sh.clearContents();
  sh.getRange(1, 1, SETTING_KEYS.length, 2).setValues(SETTING_KEYS.map(k => [k, obj[k] === undefined ? '' : obj[k]]));
}

function sheet_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) sh = ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) sh.appendRow(HEADER);
  sh.getRange('A:B').setNumberFormat('@'); // keep dates as plain text
  return sh;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if ((e.parameter.key || '') !== KEY) return out_({ ok: false, error: 'bad key' });
  const sh = sheet_();
  const last = sh.getLastRow();
  const rows = last < 2 ? [] : sh.getRange(2, 1, last - 1, 7).getDisplayValues().filter(r => r[0]);
  return out_({ ok: true, rows: rows, settings: readSettings_() });
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: 'bad json' }); }
  if ((body.key || '') !== KEY) return out_({ ok: false, error: 'bad key' });
  const rows = (body.rows || []).map(r => [String(r[0]), String(r[1]), String(r[2]), String(r[3]), Number(r[4]) || 0, String(r[5] || ''), String(r[6] || '')]);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_();
    if (body.action === 'settings') {
      writeSettings_(body.settings || {});
      return out_({ ok: true });
    }
    if (body.action === 'replace') {
      const last = sh.getLastRow();
      if (last > 1) sh.getRange(2, 1, last - 1, 7).clearContent();
      if (rows.length) sh.getRange(2, 1, rows.length, 7).setValues(rows);
    } else if (body.action === 'append') {
      if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, 7).setValues(rows);
    } else {
      return out_({ ok: false, error: 'unknown action' });
    }
    return out_({ ok: true, count: rows.length });
  } finally {
    lock.releaseLock();
  }
}
