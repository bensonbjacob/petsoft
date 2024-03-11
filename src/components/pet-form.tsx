"use client";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { usePetContext } from "@/lib/hooks";
import PetFormBTN from "./pet-form-btn";
import { useForm } from "react-hook-form";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

type TPetForm = {
  name: string;
  ownerName: string;
  imageUrl: string;
  age: number;
  notes: string;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { handleAddPet, handleEditPet, selectedPet } =
    usePetContext();

  const {
    register,
    trigger,
    formState: { isSubmitting, errors },
  } = useForm<TPetForm>();

  return (
    <form
      action={async (formData) => {
        const result = await trigger();
        if (!result) return;
        onFormSubmission();

        const petData = {
          name: formData.get("name") as string,
          ownerName: formData.get("ownerName") as string,
          imageUrl:
            (formData.get("imageUrl") as string) ||
            "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
          age: Number(formData.get("age")),
          notes: formData.get("notes") as string,
        };

        if (actionType === "add") {
          await handleAddPet(petData);
        } else if (actionType === "edit") {
          await handleEditPet(selectedPet!.id, petData);
        }
      }}
      className="flex flex-col">
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name should be at least 2 characters",
              },
            })}
          />
          {errors.name && (
            <p className="text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner name</Label>
          <Input
            id="ownerName"
            {...register("ownerName", {
              required: "Owner name is required",
              maxLength: {
                value: 35,
                message: "Owner name should be at most 35 characters",
              },
            })}
          />
          {errors.ownerName && (
            <p className="text-red-500">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" {...register("imageUrl")} />
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" {...register("age")} />
          {errors.age && (
            <p className="text-red-500">{errors.age.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register("notes")} rows={4} />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <PetFormBTN actionType={actionType} />
    </form>
  );
}
