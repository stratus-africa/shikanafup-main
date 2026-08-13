import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const createAuthAccountInput = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string(),
  lastName: z.string(),
  applicationId: z.string().uuid(),
});

/**
 * Creates a Supabase auth account for a new member after they submit their application
 * This allows them to log in immediately while their membership is pending approval
 */
export const createMemberAuthAccount = createServerFn({ method: "POST" })
  .inputValidator(createAuthAccountInput)
  .handler(async ({ data }) => {
    const { email, password, firstName, lastName, applicationId } = data;

    // Since this runs on the server, we need to use the admin client
    // The client here has admin privileges to create auth accounts
    const supabase = (globalThis as any).supabaseAdmin;

    if (!supabase) {
      throw new Error("Admin Supabase client not available");
    }

    try {
      // Create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          membership_application_id: applicationId,
          join_date: new Date().toISOString(),
        },
      });

      if (authError) {
        throw new Error(`Failed to create auth account: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error("User creation returned no user data");
      }

      // Create a profile entry for this user
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email,
        full_name: `${firstName} ${lastName}`,
      });

      if (profileError && !profileError.message.includes("duplicate")) {
        // Ignore duplicate key errors, as profile might already exist
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }

      // Update the membership_application with the new user_id
      const { error: updateError } = await supabase
        .from("membership_applications")
        .update({
          payload: {
            user_id: authData.user.id,
            auth_created_at: new Date().toISOString(),
          },
        })
        .eq("id", applicationId);

      if (updateError) {
        throw new Error(`Failed to link auth account to application: ${updateError.message}`);
      }

      // Send confirmation email
      const { error: emailError } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${process.env.VITE_PUBLIC_URL}/login?email=${encodeURIComponent(email)}`,
        },
      });

      // Log email error but don't fail the whole operation
      if (emailError) {
        console.warn("Failed to send confirmation email:", emailError);
      }

      return {
        success: true,
        userId: authData.user.id,
        email: authData.user.email,
        message:
          "Account created successfully! Check your email for a confirmation link. You can log in immediately with your password.",
      };
    } catch (error: any) {
      console.error("Error creating member auth account:", error);
      throw error;
    }
  });

/**
 * Sets a password for an existing user (for password reset or initial password setup)
 */
export const setUserPassword = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      userId: z.string().uuid(),
      password: z.string().min(8, "Password must be at least 8 characters"),
    }),
  )
  .handler(async ({ data }) => {
    const { userId, password } = data;
    const supabase = (globalThis as any).supabaseAdmin;

    if (!supabase) {
      throw new Error("Admin Supabase client not available");
    }

    try {
      const { data: userData, error } = await supabase.auth.admin.updateUserById(userId, {
        password,
      });

      if (error) {
        throw new Error(`Failed to set password: ${error.message}`);
      }

      return {
        success: true,
        message: "Password set successfully!",
      };
    } catch (error: any) {
      console.error("Error setting user password:", error);
      throw error;
    }
  });
