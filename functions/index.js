"use strict";

const crypto = require("crypto");
const admin = require("firebase-admin");
const { setGlobalOptions } = require("firebase-functions/v2");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");

admin.initializeApp();
setGlobalOptions({ region: process.env.FUNCTION_REGION || "us-central1", maxInstances: 10 });

const db = admin.firestore();
const auth = admin.auth();
const FieldValue = admin.firestore.FieldValue;
const APP_BASE_URL = process.env.APP_BASE_URL || "https://mka007-dev.github.io/squad-link/preview.html";

let cachedTransporter = null;
let cachedTransportKey = "";

function cleanText(value, fallback = "") {
  return String(value || "").trim() || fallback;
}

function firstName(user, profile = {}) {
  const profileName = cleanText(profile.displayName);
  if (profileName) return profileName;
  if (user?.displayName) return user.displayName;
  if (user?.email) return user.email.split("@")[0];
  return "player";
}

function emailHash(email) {
  return crypto.createHash("sha256").update(String(email || "").toLowerCase()).digest("hex");
}

function recipientDomain(email) {
  return String(email || "").split("@")[1] || "";
}

function mailConfig() {
  const host = cleanText(process.env.SMTP_HOST);
  const user = cleanText(process.env.SMTP_USER);
  const pass = cleanText(process.env.SMTP_PASS);
  const from = cleanText(process.env.MAIL_FROM, user);
  const port = Number(process.env.SMTP_PORT || 587);
  if (!host || !user || !pass || !from) return null;
  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    from
  };
}

function transporterFor(config) {
  const key = `${config.host}:${config.port}:${config.auth.user}`;
  if (cachedTransporter && cachedTransportKey === key) return cachedTransporter;
  cachedTransportKey = key;
  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth
  });
  return cachedTransporter;
}

async function logEmailEvent(event) {
  await db.collection("emailEvents").add({
    ...event,
    createdAt: FieldValue.serverTimestamp()
  });
}

async function sendEmail({ to, subject, text, html, template, uid }) {
  const config = mailConfig();
  const baseEvent = {
    uid: uid || "",
    template,
    subject,
    recipientHash: emailHash(to),
    recipientDomain: recipientDomain(to)
  };

  if (!config) {
    logger.warn("Email skipped because SMTP is not configured.", { template, uid });
    await logEmailEvent({ ...baseEvent, status: "skipped", reason: "smtp-not-configured" });
    return { sent: false, reason: "smtp-not-configured" };
  }

  try {
    await transporterFor(config).sendMail({
      from: config.from,
      to,
      subject,
      text,
      html
    });
    await logEmailEvent({ ...baseEvent, status: "sent" });
    return { sent: true };
  } catch (error) {
    logger.error("Email delivery failed.", { template, uid, error: error.message });
    await logEmailEvent({ ...baseEvent, status: "failed", reason: error.message.slice(0, 240) });
    return { sent: false, reason: error.message };
  }
}

async function getUser(uid) {
  try {
    return await auth.getUser(uid);
  } catch (error) {
    logger.warn("User lookup failed.", { uid, error: error.message });
    return null;
  }
}

async function getProfile(uid) {
  const snapshot = await db.collection("profiles").doc(uid).get();
  return snapshot.exists ? snapshot.data() : {};
}

async function addNotification(uid, title, body) {
  await db.collection("notifications").add({
    uid,
    title,
    body,
    unread: true,
    createdAt: FieldValue.serverTimestamp()
  });
}

function buttonHtml(label, href) {
  return `<a href="${href}" style="display:inline-block;padding:12px 18px;border-radius:12px;background:#ff4f7b;color:#ffffff;text-decoration:none;font-weight:700">${label}</a>`;
}

exports.sendWelcomeEmail = onDocumentCreated("profiles/{uid}", async (event) => {
  const uid = event.params.uid;
  const profile = event.data?.data() || {};
  const user = await getUser(uid);
  if (!user?.email || user.disabled || user.providerData.length === 0) return;

  const name = firstName(user, profile);
  await sendEmail({
    uid,
    to: user.email,
    template: "welcome",
    subject: "Welcome to LobbyRush",
    text: `Welcome to LobbyRush, ${name}. Your player card is live. Open ${APP_BASE_URL} to find squads, matches, events, and gaming crews.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#101827">
        <h1 style="margin:0 0 12px">Welcome to LobbyRush, ${name}</h1>
        <p>Your player card is live. You can now match with FIFA, GTA, and Warzone players, join squads, create posts, and get event updates.</p>
        <p>${buttonHtml("Open LobbyRush", APP_BASE_URL)}</p>
      </div>
    `
  });
});

exports.notifyMutualMatch = onDocumentCreated("playerActions/{actionId}", async (event) => {
  const action = event.data?.data() || {};
  if (action.action !== "like") return;

  const uid = cleanText(action.uid);
  const targetId = cleanText(action.targetId);
  if (!uid || !targetId || uid === targetId || targetId.startsWith("player-")) return;

  const reciprocal = await db.collection("playerActions")
    .where("uid", "==", targetId)
    .where("targetId", "==", uid)
    .where("action", "==", "like")
    .limit(1)
    .get();
  if (reciprocal.empty) return;

  const participants = [uid, targetId].sort();
  const matchId = participants.join("_");
  const matchRef = db.collection("matches").doc(matchId);
  let shouldNotify = false;

  await db.runTransaction(async (transaction) => {
    const existing = await transaction.get(matchRef);
    if (existing.exists && existing.data()?.emailQueuedAt) return;
    transaction.set(matchRef, {
      participants,
      game: cleanText(action.game, "warzone"),
      sourceActionId: event.params.actionId,
      createdAt: existing.exists ? existing.data().createdAt || FieldValue.serverTimestamp() : FieldValue.serverTimestamp(),
      emailQueuedAt: FieldValue.serverTimestamp()
    }, { merge: true });
    shouldNotify = true;
  });

  if (!shouldNotify) return;

  const [userA, userB, profileA, profileB] = await Promise.all([
    getUser(uid),
    getUser(targetId),
    getProfile(uid),
    getProfile(targetId)
  ]);

  const nameA = firstName(userA, profileA);
  const nameB = firstName(userB, profileB);
  const title = "New mutual match";

  await Promise.all([
    addNotification(uid, title, `${nameB} matched with you. Send a message or start a voice room.`),
    addNotification(targetId, title, `${nameA} matched with you. Send a message or start a voice room.`)
  ]);

  const results = await Promise.all([
    userA?.email ? sendEmail({
      uid,
      to: userA.email,
      template: "match",
      subject: `You matched with ${nameB} on LobbyRush`,
      text: `You and ${nameB} both tapped Squad Up. Open ${APP_BASE_URL} to message them or start a voice room.`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#101827">
          <h1 style="margin:0 0 12px">You matched with ${nameB}</h1>
          <p>You both tapped Squad Up. Open LobbyRush to message them or start a voice room.</p>
          <p>${buttonHtml("Open match", APP_BASE_URL)}</p>
        </div>
      `
    }) : Promise.resolve({ sent: false, reason: "missing-email" }),
    userB?.email ? sendEmail({
      uid: targetId,
      to: userB.email,
      template: "match",
      subject: `You matched with ${nameA} on LobbyRush`,
      text: `You and ${nameA} both tapped Squad Up. Open ${APP_BASE_URL} to message them or start a voice room.`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#101827">
          <h1 style="margin:0 0 12px">You matched with ${nameA}</h1>
          <p>You both tapped Squad Up. Open LobbyRush to message them or start a voice room.</p>
          <p>${buttonHtml("Open match", APP_BASE_URL)}</p>
        </div>
      `
    }) : Promise.resolve({ sent: false, reason: "missing-email" })
  ]);

  await matchRef.set({
    emailProcessedAt: FieldValue.serverTimestamp(),
    emailResults: results.map((result) => ({ sent: Boolean(result.sent), reason: result.reason || "" }))
  }, { merge: true });
});
