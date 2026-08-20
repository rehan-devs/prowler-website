import crypto from "crypto";
import { supabaseAdmin } from "./supabase";

const SESSION_DURATION_HOURS = 24;

/**
 * Hash a password with SHA-256 + salt
 * For production use bcrypt — but this avoids native module issues on Vercel
 */
export function hashPassword(password: string, salt: string): string {
  return crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");
}

/**
 * Generate a random salt
 */
export function generateSalt(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Generate a secure session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

/**
 * Hash session token for storage
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Verify admin credentials and create session
 * Returns session token on success, null on failure
 */
export async function verifyAdminAndCreateSession(
  email: string,
  password: string
): Promise<string | null> {
  try {
    // Fetch admin user
    const { data: admin, error } = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .eq("is_active", true)
      .single();

    if (error || !admin) return null;

    // Verify password
    // password_hash is stored as "salt:hash"
    const [salt, storedHash] = admin.password_hash.split(":");
    if (!salt || !storedHash) return null;

    const inputHash = hashPassword(password, salt);
    if (inputHash !== storedHash) return null;

    // Create session
    const token = generateSessionToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(
      Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000
    ).toISOString();

    const { error: sessionError } = await supabaseAdmin
      .from("admin_sessions")
      .insert({
        admin_id: admin.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      });

    if (sessionError) return null;

    // Update last login
    await supabaseAdmin
      .from("admin_users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", admin.id);

    return token;
  } catch {
    return null;
  }
}

/**
 * Validate a session token
 * Returns admin email on success, null if invalid/expired
 */
export async function validateAdminSession(
  token: string
): Promise<{ id: string; email: string } | null> {
  try {
    const tokenHash = hashToken(token);

    const { data: session, error } = await supabaseAdmin
      .from("admin_sessions")
      .select("*, admin_users(id, email, is_active)")
      .eq("token_hash", tokenHash)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (error || !session) return null;

    const admin = session.admin_users as {
      id: string;
      email: string;
      is_active: boolean;
    };
    if (!admin?.is_active) return null;

    return { id: admin.id, email: admin.email };
  } catch {
    return null;
  }
}

/**
 * Delete a session (logout)
 */
export async function deleteAdminSession(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  await supabaseAdmin
    .from("admin_sessions")
    .delete()
    .eq("token_hash", tokenHash);
}

/**
 * Log an admin action to audit log
 */
export async function logAdminAction(
  adminEmail: string,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: Record<string, unknown>,
  ipAddress?: string
): Promise<void> {
  await supabaseAdmin.from("admin_audit_log").insert({
    admin_email: adminEmail,
    action,
    target_type: targetType,
    target_id: targetId,
    details,
    ip_address: ipAddress,
  });
}