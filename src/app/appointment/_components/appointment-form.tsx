"use client";

import { Fragment, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineStepper } from "@stepperize/react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import AppointmentFor from "./appointment-for";
import SelectService from "./select-service";
import ScheduleAppointment from "./schedule-appointment";
import AppointmentSummary from "./appointment-summary";
import { uploadImageToCloudinary } from "@/lib/upload";
import { useFetch } from "@/hooks/use-fecth";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from "@/schemas/appointment";
import { cn } from "@/lib/utils";

const { useStepper, steps, utils } = defineStepper(
  { id: "pet", label: "Mascota", schema: step1Schema },
  { id: "service", label: "Servicio", schema: step2Schema },
  { id: "schedule", label: "Agendar", schema: step3Schema },
  { id: "summary", label: "Resumen", schema: step4Schema }
);

export default function AppointmentForm() {
  const stepper = useStepper();
  const { data: userData } = useFetch<User>("/api/user/me");
  const { data: userPets } = useFetch<Pet[]>("/api/pets");

  const petsList: Pet[] = Array.isArray(userPets) ? userPets : [];
  const userObj: User = userData ?? {
    image: "",
    name: "",
    email: "",
    phone_number: "",
  };

  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(stepper.current.schema),
    defaultValues: {
      petSelection: "existing",
      selectedPetId: "",
      petType: "",
      petName: "",
      petGender: "",
      petBreed: "",
      petDescription: "",
      petImage: "",
      petAge: "",
      petWeight: "",
      serviceType: "",
      visitReason: "",
      visitDetails: "",
      termsAccepted: false,
      doctor: "cualquier profesional",
      appointmentDate: "",
      appointmentTime: "",
      petsCount: petsList.length,
    },
  });

  useEffect(() => {
    if (Array.isArray(userPets)) {
      // @ts-expect-error - Setting pets count from API response
      form.setValue("petsCount", userPets.length);
    }
  }, [userPets, form]);

  const onSubmit = async (values: Record<string, unknown>) => {
    if (stepper.isLast) {
      let imageUrl = "";
      if (values.petImage instanceof File) {
        imageUrl = await uploadImageToCloudinary(values.petImage);
      }
      console.log("Datos de la cita:", { ...values, petImage: imageUrl });
      stepper.reset();
      form.reset();
    } else {
      stepper.next();
    }
  };

  const currentIndex = utils.getIndex(stepper.current.id);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CardContent>
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Paso {currentIndex + 1} de {steps.length}
            </span>
          </div>
          <nav aria-label="Pasos de la cita" className="group mt-4 mb-8">
            <ol className="flex items-center justify-between gap-2">
              {stepper.all.map((step, index, array) => (
                <Fragment key={step.id}>
                  <li className="flex items-center gap-4 flex-shrink-0">
                    <Button
                      type="button"
                      role="tab"
                      variant={index <= currentIndex ? "default" : "secondary"}
                      aria-current={
                        stepper.current.id === step.id ? "step" : undefined
                      }
                      aria-posinset={index + 1}
                      aria-setsize={steps.length}
                      aria-selected={stepper.current.id === step.id}
                      className={cn(
                        "flex size-10 items-center justify-center rounded-full hover:bg-violet-500 hover:text-white",
                        index <= currentIndex ? "bg-violet-500" : ""
                      )}
                      onClick={async () => {
                        const valid = await form.trigger();
                        if (!valid) return;
                        if (index - currentIndex > 1) return;
                        stepper.goTo(step.id);
                      }}
                    >
                      {index + 1}
                    </Button>
                    <span className="text-sm font-medium">{step.label}</span>
                  </li>
                  {index < array.length - 1 && (
                    <Separator
                      className={`flex-1 ${index < currentIndex ? "bg-violet-500" : "bg-muted"}`}
                    />
                  )}
                </Fragment>
              ))}
            </ol>
          </nav>
          <div className="space-y-8">
            {stepper.switch({
              pet: () => <AppointmentFor pets={petsList} />,
              service: () => <SelectService />,
              schedule: () => <ScheduleAppointment />,
              summary: () => (
                <AppointmentSummary
                  goToStep={(stepIdx: number) =>
                    stepper.goTo(steps[stepIdx].id)
                  }
                  user={userObj}
                  pets={petsList}
                />
              ),
            })}
            <CardFooter>
              <div className="flex justify-end gap-4">
                <Button
                  variant="secondary"
                  onClick={stepper.prev}
                  disabled={stepper.isFirst}
                  type="button"
                >
                  Anterior
                </Button>
                <Button type="submit">
                  {stepper.isLast ? "Confirmar" : "Siguiente"}
                </Button>
              </div>
            </CardFooter>
          </div>
        </CardContent>
      </form>
    </FormProvider>
  );
}
