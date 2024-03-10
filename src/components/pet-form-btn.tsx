import { Button } from "./ui/button";

type PetFormBTNProps = {
  actionType: "add" | "edit";
};

export default function PetFormBTN({ actionType }: PetFormBTNProps) {
  return (
    <Button className="mt-5 self-end" type="submit">
      {actionType === "add" ? "Add" : "Edit"}
    </Button>
  );
}
