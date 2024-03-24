"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { checkAuth, getPetById } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// User actions

export async function logIn(prevStat: unknown, formData: unknown) {
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data",
    };
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            message: "Invalid credentials",
          };
        }
        default: {
          return {
            message: "Failed to sign in",
          };
        }
      }
    }
    throw error;
  }
}

export async function signUp(prevState: unknown, formData: unknown) {
  // check if formData is an instance of FormData
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }
  // convert formData to object
  const formDataEntries = Object.fromEntries(formData.entries());

  // validate form data
  const validatedFormData = authSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) {
    return {
      message: "Invalid form data.",
    };
  }

  const { email, password } = validatedFormData.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists.",
        };
      }
    }
    return {
      message: "Failed to create user.",
    };
  }

  await signIn("credentials", formData);
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

// Pet actions

export async function addPet(pet: unknown) {
  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: validatedPet.error.errors[0].message,
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    return {
      message: "Failed to add pet",
    };
  }

  revalidatePath("/app/", "layout");
}

export async function editPet(petId: unknown, newPetData: unknown) {
  // Authentication Check
  const session = await checkAuth();

  // Validation
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);

  if (!validatedPetId.success || !validatedPet.success) {
    return {
      message: "Invalid pet data",
    };
  }

  // Authorization Check
  const pet = await getPetById(validatedPetId.data);

  if (!pet) {
    return {
      message: "Pet not found",
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: "Unauthorized",
    };
  }

  // Database mutation
  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: "Failed to update pet",
    };
  }

  revalidatePath("/app/", "layout");
}

export async function deletePet(petId: unknown) {
  // Authentication Check
  const session = await checkAuth();

  //Validation
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  // Authorization Check
  const pet = await getPetById(validatedPetId.data);

  if (!pet) {
    return {
      message: "Pet not found",
    };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: "Unauthorized",
    };
  }

  // Database mutation
  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    return {
      message: "Failed to delete pet",
    };
  }

  revalidatePath("/app/", "layout");
}

// Paymeny actions
export async function createCheckoutSession() {
  // Authentication Check
  const session = await checkAuth();

  // Create a new checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [
      {
        price: "price_1OxtjyCTqsSB68BTlP9Z0z7G",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
    cancel_url: `${process.env.CANONICAL_URL}/payment?canceled=true`,
  });

  // Redirect user to checkout page
  redirect(checkoutSession.url);
}
