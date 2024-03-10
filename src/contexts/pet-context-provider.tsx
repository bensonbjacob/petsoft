"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { Pet } from "@/lib/types";
import {
  createContext,
  startTransition,
  useOptimistic,
  useState,
} from "react";
import { toast } from "sonner";

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  numberofPets: number;
  handleEditPet: (
    petId: string,
    newPetData: Omit<Pet, "id">
  ) => Promise<void>;
  handleAddPet: (newPet: Omit<Pet, "id">) => Promise<void>;
  handleChangeSelectedPetId: (id: string) => void;
  handleCheckoutPet: (id: string) => Promise<void>;
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  //state
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, newPet) => {
      return [...state, { ...newPet, id: Math.random().toString() }];
    }
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(
    null
  );

  //derived state
  const selectedPet = optimisticPets.find(
    (pet) => pet.id === selectedPetId
  );
  const numberofPets = optimisticPets.length;

  //event handlers
  const handleAddPet = async (newPet: Omit<Pet, "id">) => {
    setOptimisticPets(newPet);
    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleEditPet = async (
    petId: string,
    newPetData: Omit<Pet, "id">
  ) => {
    const error = await editPet(petId, newPetData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  const handleCheckoutPet = async (petId: string) => {
    await deletePet(petId);

    setSelectedPetId(null);
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
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
