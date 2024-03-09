"use client";

import { addPet } from "@/actions/actions";
import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  numberofPets: number;
  handleEditPet: (petId: string, newPetData: Omit<Pet, "id">) => void;
  handleAddPet: (newPet: Omit<Pet, "id">) => void;
  handleChangeSelectedPetId: (id: string) => void;
  handleCheckoutPet: (id: string) => void;
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  //state
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(
    null
  );

  //derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberofPets = pets.length;

  //event handlers
  const handleAddPet = async (newPet: Omit<Pet, "id">) => {
    // setPets((prev) => [
    //   ...prev,
    //   { ...newPet, id: Date.now().toString() },
    // ]);

    await addPet(newPet);
  };

  const handleEditPet = (
    petId: string,
    newPetData: Omit<Pet, "id">
  ) => {
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id === petId) {
          return { id: petId, ...newPetData };
        }
        return pet;
      })
    );
  };

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  const handleCheckoutPet = (id: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id));
    setSelectedPetId(null);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        selectedPet,
        numberofPets,
        handleAddPet,
        handleEditPet,
        handleChangeSelectedPetId,
        handleCheckoutPet,
      }}>
      {children}
    </PetContext.Provider>
  );
}
