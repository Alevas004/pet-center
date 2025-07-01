"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { FaDog, FaCat } from "react-icons/fa6";
import { MdPets } from "react-icons/md";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

const dogBreeds = [
  "Labrador",
  "Bulldog",
  "Pastor Alemán",
  "Golden Retriever",
  "Chihuahua",
  "Poodle",
  "Husky",
  "Beagle",
  "Boxer",
  "Otro",
];
const catBreeds = [
  "Persa",
  "Siamés",
  "Maine Coon",
  "Bengalí",
  "Ragdoll",
  "Sphynx",
  "Angora",
  "Británico de Pelo Corto",
  "Abisinio",
  "Otro",
];

export default function AppointmentFor({ pets }: { pets: Pet[] }) {
  const {
    register,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useFormContext();
  const prevPetTypeRef = useRef<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [preview, setPreview] = useState<string | null>(null);

  const petSelection = useWatch({ name: "petSelection", control });
  const petType = useWatch({ name: "petType", control });
  const selectedPetId = useWatch({ name: "selectedPetId", control });
  const petsCount = useWatch({ name: "petsCount", control });

  // Efectos solo para limpiar campos dependientes
  useEffect(() => {
    if (petSelection === "new") {
      if (getValues("selectedPetId") !== "") setValue("selectedPetId", "");
    }
  }, [petSelection, getValues, setValue]);

  useEffect(() => {
    if (petSelection === "existing") {
      if (getValues("petType") !== "") setValue("petType", "");
      if (getValues("petName") !== "") setValue("petName", "");
      if (getValues("petGender") !== "") setValue("petGender", "");
      if (getValues("petBreed") !== "") setValue("petBreed", "");
      if (getValues("petDescription") !== "") setValue("petDescription", "");
    }
  }, [petSelection, getValues, setValue]);

  useEffect(() => {
    if (petType === "OTHER") {
      if (getValues("petBreed") !== "") setValue("petBreed", "");
    } else {
      if (getValues("petDescription") !== "") setValue("petDescription", "");
    }
  }, [petType, getValues, setValue]);

  useEffect(() => {
    const prevPetType = prevPetTypeRef.current;
    const currentPetType = getValues("petType");
    if (prevPetType && prevPetType !== currentPetType) {
      if (getValues("petBreed") !== "") setValue("petBreed", "");
    }
    prevPetTypeRef.current = currentPetType;
  }, [petType, getValues, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("petImage", file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {petsCount > 0 && (
        <div className="space-y-2">
          <Label htmlFor="petSelection">¿Para quién es la cita?</Label>
          <Controller
            control={control}
            name="petSelection"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="existing">
                    Seleccionar una de mis mascotas
                  </SelectItem>
                  <SelectItem value="new">
                    Registrar una nueva mascota
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.petSelection && (
            <p className="text-red-500 text-xs mt-1">
              {errors.petSelection.message as string}
            </p>
          )}
          {petSelection === "existing" && (
            <div className="pt-4 space-y-2">
              <Label className="text-sm font-medium">
                Selecciona tu mascota<span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className={cn(
                      "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-violet-400",
                      selectedPetId === String(pet.id)
                        ? "border-violet-500 bg-violet-50"
                        : "border-muted"
                    )}
                    onClick={() => setValue("selectedPetId", String(pet.id))}
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative h-16 w-16 mb-2 rounded-full overflow-hidden">
                        <Image
                          src={pet.image || "/placeholder.svg"}
                          alt={pet.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium">{pet.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {pet.species === "DOG" ? "Perro" : "Gato"} - {pet.breed}
                      </span>
                    </div>
                    {selectedPetId === String(pet.id) && (
                      <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-violet-500"></div>
                    )}
                  </div>
                ))}
              </div>
              {errors.selectedPetId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.selectedPetId.message as string}
                </p>
              )}
            </div>
          )}
        </div>
      )}
      {(petSelection === "new" || petsCount === 0) && (
        <>
          {petsCount === 0 && (
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-6">
              <p className="text-center text-sm text-violet-700">
                No tienes mascotas registradas. Por favor, completa la
                información de tu mascota a continuación.
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Especie<span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-4">
              {["DOG", "CAT", "OTHER"].map((type) => (
                <div
                  key={type}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-violet-400",
                    petType === type && "border-violet-500 bg-violet-50"
                  )}
                  onClick={() => setValue("petType", type)}
                >
                  <div className="flex flex-col items-center">
                    <div className="relative h-16 w-16 mb-2">
                      {type === "DOG" ? (
                        <FaDog className="size-16" />
                      ) : type === "CAT" ? (
                        <FaCat className="size-16" />
                      ) : (
                        <MdPets className="size-16" />
                      )}
                    </div>
                    <span className="font-medium">
                      {type === "DOG"
                        ? "Perro"
                        : type === "CAT"
                          ? "Gato"
                          : "Otro"}
                    </span>
                  </div>
                  {petType === type && (
                    <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-violet-500"></div>
                  )}
                </div>
              ))}
            </div>
            {errors.petType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.petType.message as string}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="petName">
                Nombre<span className="text-red-500">*</span>
              </Label>
              <Input
                id="petName"
                {...register("petName")}
                placeholder="Ingresa el nombre"
              />
              {errors.petName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.petName.message as string}
                </p>
              )}
            </div>
            {petType && petType !== "OTHER" && (
              <div className="space-y-2">
                <Label>
                  Raza<span className="text-red-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="petBreed"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la raza" />
                      </SelectTrigger>
                      <SelectContent>
                        {(petType === "DOG" ? dogBreeds : catBreeds).map(
                          (breed) => (
                            <SelectItem key={breed} value={breed.toLowerCase()}>
                              {breed}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.petBreed && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.petBreed.message as string}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label>
                Género<span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="petGender"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Macho</SelectItem>
                      <SelectItem value="FEMALE">Hembra</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.petGender && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.petGender.message as string}
                </p>
              )}
            </div>
          </div>
          {petType === "OTHER" && (
            <div className="space-y-2">
              <Label>
                Describe a tu mascota<span className="text-red-500">*</span>
              </Label>
              <Textarea
                {...register("petDescription")}
                placeholder="Especie, tamaño, características..."
              />
              {errors.petDescription && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.petDescription.message as string}
                </p>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Edad (opcional)</Label>
              <Input {...register("petAge")} placeholder="Ej: 2 años" />
            </div>
            <div className="space-y-2">
              <Label>Peso (opcional)</Label>
              <Input {...register("petWeight")} placeholder="Ej: 5 kg" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Foto (opcional)</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </>
      )}
    </div>
  );
}
