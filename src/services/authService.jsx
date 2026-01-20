import { supabase } from "../supabaseClient";

// Login function
export const loginUser = async (email, password, role) => {
  try {
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });

    // Handle login error
    // if (error) throw error;

    const user ={
    "id": "f56adfe5-477c-4099-a6ef-06aab6953aa7",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "testmail@gmail.com",
    "email_confirmed_at": "2025-08-25T12:09:32.083184Z",
    "phone": "",
    "confirmed_at": "2025-08-25T12:09:32.083184Z",
    "last_sign_in_at": "2025-09-10T03:35:55.144866649Z",
    "app_metadata": {
        "provider": "email",
        "providers": [
            "email"
        ]
    },
    "user_metadata": {
        "email": "testmail@gmail.com",
        "email_verified": true,
        "name": "test name",
        "phone_verified": false,
        "role": "user",
        "sub": "f56adfe5-477c-4099-a6ef-06aab6953aa7"
    },
    "identities": [
        {
            "identity_id": "66b0a9e9-6a4a-48de-9666-1235b89f214e",
            "id": "f56adfe5-477c-4099-a6ef-06aab6953aa7",
            "user_id": "f56adfe5-477c-4099-a6ef-06aab6953aa7",
            "identity_data": {
                "email": "testmail@gmail.com",
                "email_verified": false,
                "name": "test name",
                "phone_verified": false,
                "role": "user",
                "sub": "f56adfe5-477c-4099-a6ef-06aab6953aa7"
            },
            "provider": "email",
            "last_sign_in_at": "2025-08-25T12:09:32.071324Z",
            "created_at": "2025-08-25T12:09:32.071376Z",
            "updated_at": "2025-08-25T12:09:32.071376Z",
            "email": "testmail@gmail.com"
        }
    ],
    "created_at": "2025-08-25T12:09:32.061326Z",
    "updated_at": "2025-09-10T03:35:55.202642Z",
    "is_anonymous": false
};

    // console.log(user);

    // Check if the role matches
    if (user.user_metadata.role !== role) {
      console.log("Role does not match. Please try again.");
      alert("Role does not match.");
      const otherPage = role === "user" ? "merchant" : "customer";
      await supabase.auth.signOut();
      throw new Error(
        `This page is for ${role}s. Try logging in as a ${otherPage}.`
      );
    }

    // Check if the user's email is confirmed
    if (user && user.email_confirmed_at) {
      return user;
    } else {
      console.log("Email not confirmed. Please verify your email.");
      alert(
        "Email not verified. Please check your inbox for a verification link."
      );
      return null;
    }
  } catch (error) {
    throw error;
  }
};

// Signup function
export const signupUser = async (email, username, role, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: username,
          role,
        },
      },
    });

    if (error) throw error;

    const user = data.user;

    if (user?.id) {
      const { data: insertData, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            auth_id: user.id, // Link to auth.users
            name: username,
            email,
            role,
            password,
          },
        ]);

      if (insertError) {
        console.error(
          "Error inserting user into the users table:",
          insertError
        );
        throw insertError;
      } else {
        console.log("User inserted into the users table:", insertData);
      }

      console.log("User created successfully.");
      return user;
    }

    return null;
  } catch (error) {
    console.error("Signup error:", error.message);
    alert("Error during signup. Please try again.");
    throw error;
  }
};
