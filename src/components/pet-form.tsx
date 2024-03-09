"use client";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { usePetContext } from "@/lib/hooks";
import { addPet } from "@/actions/actions";
import PetFormBTN from "./pet-form-btn";
import { toast } from "sonner";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  const { selectedPet } = usePetContext();

  return (
    <form
      action={async (formData) => {
        const error = await addPet(formData);
        if (error) {
          toast.warning(error.message);
          return;
        }

        onFormSubmission();
      }}
      className="flex flex-col">
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter pet name"
            type="text"
            required
            defaultValue={
              actionType === "edit" ? selectedPet?.name : ""
            }
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner name</Label>
          <Input
            id="ownerName"
            name="ownerName"
            placeholder="Enter owner name"
            type="text"
            required
            defaultValue={
              actionType === "edit" ? selectedPet?.ownerName : ""
            }
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            placeholder="Enter image url"
            type="text"
            defaultValue={
              actionType === "edit" ? selectedPet?.imageUrl : ""
            }
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            placeholder="Enter pet age"
            type="number"
            required
            defaultValue={
              actionType === "edit" ? selectedPet?.age : ""
            }
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Enter notes"
            required
            defaultValue={
              actionType === "edit" ? selectedPet?.notes : ""
            }
          />
        </div>
      </div>

      <PetFormBTN actionType={actionType} />
    </form>
  );
}
