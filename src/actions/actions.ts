"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

// User actions

export async function logIn(formData: FormData) {
  await signIn("credentials", formData);

  redirect("/app/dashboard");
}

export async function signUp(formData: FormData) {
  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    10
  );
  await prisma.user.create({
    data: {
      email: formData.get("email") as string,
      hashedPassword,
    },
  });

  await signIn("credentials", formData);
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

// Pet actions

export async function addPet(pet: unknown) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

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
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);

  if (!validatedPetId.success || !validatedPet.success) {
    return {
      message: "Invalid pet data",
    };
  }

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
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }
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
