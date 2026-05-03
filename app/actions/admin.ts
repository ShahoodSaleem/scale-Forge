"use server";

import { createClient } from "@supabase/supabase-js";

export async function createEmployeeAccount(data: { 
  email: string; 
  password?: string; 
  fullName: string; 
  role: string; 
  method: "email" | "manual";
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("❌ createEmployeeAccount failed: Missing SUPABASE_SERVICE_ROLE_KEY on server.");
    return { error: "Server missing Supabase credentials. Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file and RESTART your dev server." };
  }
  
  console.log("✅ createEmployeeAccount: Service key found, initializing admin client.");

  const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  if (data.method === "email") {
    // Send email invite
    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
      data: { full_name: data.fullName, role: data.role }
    });
    if (error) return { error: error.message };
    return { success: true, message: `Invite sent to ${data.email}!` };
  } else {
    // Create manually with auto-confirmed email
    const { error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // Auto-confirm so they can login immediately
      user_metadata: { full_name: data.fullName, role: data.role }
    });
    if (error) return { error: error.message };
    return { success: true, message: `Account created! They can now log in with the temporary password.` };
  }
}
