import {
  createUser,
  getUserByUsername,
  patchUser,
} from "./models/userModel.js";
import bcrypt from "bcryptjs";
import fastify from "./index.js";
import qrcode from "qrcode";
import { authenticator } from "otplib";

/**
 * Logs the user
 * @param {Object} data - Payload to evaluate
 * @returns {Object} - An object with the user and a JWT if successful,
 *                     false if the password is incorrect,
 *                     null if the user does not exist
 */
export async function loginUser(data) {
  const user = await getUserByUsername(data.username);
  if (!user) return null;
  const isAuthorized = await bcrypt.compare(data.password, user.password);
  if (!isAuthorized) return false;
  // if (user.is_2fa_enabled == true) 2faLogin(user);
  const token = fastify.jwt.sign({ user: user.id });
  const result = Object.assign({}, user, { token });
  delete result.password;
  await patchUser(user.id, { is_online: 1 });
  return result;
}

// TODO:
// Continue working on this 2FA
// currently it works, but needs
// further integration with the login system
//
// What happens when the user scans the QR?
// Check for scanning the QR so the next part
// of the verification process (asking for the code)
// can be achieved
export async function enable2fa(user) {
  const secret = authenticator.generateSecret();
  await patchUser(user.id, { pending_totp_secret: secret });
  const keyUri = authenticator.keyuri(user.username, "Transcendence", secret);
  const qr = await qrcode.toDataURL(keyUri);
  return { qr_code: qr };
}

/**
 * Finishes the 2FA initial handshake to enable it
 * @param {Object} user - User to work on
 * @param {String} totpCode - Code inputed from the user
 * @returns {Object} - Success or failure
 */
export async function verify2fa(user, totpCode) {
  const totpVerified = authenticator.verify({
    token: totpCode,
    secret: user.pending_totp_secret,
  });
  if (!totpVerified) return; //TODO: finish this
  const secret = user.pending_totp_secret;
  await patchUser(user.id, {
    pending_totp_secret: null,
    totp_secret: secret,
    is_2fa_enabled: true,
  });
  return {
    success: `2FA successfully enabled for user with ID ${user.id}`,
  };
}

/**
 * Registers a user, creating it and giving a JWT
 * @param {Object} data - Payload to evaluate
 * @returns {Object} - An object with the full user information and a JWT
 */
export async function registerUser(data) {
  const user = await createUser(data);
  const token = fastify.jwt.sign({ user: user.id });
  const result = Object.assign({}, user, { token });
  return result;
}
