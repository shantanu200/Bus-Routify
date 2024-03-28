import { BusFrontIcon, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CitySearchBox from "../_tailwindui/CitySearchBox";
import { useState } from "react";
import { ICity } from "@/types/Location";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IBus } from "@/types/Bus";
import ErrorText from "../_tailwindui/ErrorText";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiHandler } from "@/server/api";
import { useAuthCookie } from "@/hooks/Cookie";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  number: yup
    .string()
    .matches(
      /^([A-Z]{2})-([0-9]{1,2})-([A-Z]{1,2})-([0-9]{1,4})$/,
      "Vehicle number must be in the format XX-XX-XX-XXXX"
    )
    .required("Vehicle number is required"),
});

interface Props {
  closeModel: () => void;
}

export default function NewBusForm({ closeModel }: Props) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<IBus>>({
    resolver: yupResolver(validationSchema) as Resolver<Partial<IBus>>,
  });
  const cookie = useAuthCookie();
  const [boardingCity, setBoardingCity] = useState<Partial<ICity>>();
  const [droppingCity, setDroppingCity] = useState<Partial<ICity>>();

  const handleAPIFunc = async (data: Partial<IBus>) => {
    const { success, message } = await ApiHandler(
      "POST",
      "/bus",
      {
        ...data,
        boardingCityId: boardingCity?.id,
        droppingCityId: droppingCity?.id,
      },
      {
        Authorization: `Bearer ${cookie}`,
      }
    );

    if (!success) {
      alert(message);
      closeModel();
      return;
    }
  };

  const submitHandler = async (data: Partial<IBus>) => {
    if (!boardingCity || !droppingCity) return;

    if (boardingCity.id === droppingCity.id) {
      console.log("Boarding and dropping city cannot be same");
      alert("Boarding and dropping city cannot be same");
      return;
    }

    mutate(data);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleAPIFunc,
    retry: 1,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["buses"],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["buses"],
      });

      closeModel();
    },
  });

  return (
    <section className="grid col-span-1 gap-4">
      <div>
        <div className="text-lg font-medium flex shrink-0 gap-2">
          <BusFrontIcon />
          <span>Add Bus</span>
        </div>
        <p className="text-sm mt-1 text-gray-500">
          Add bus details to expand business.
        </p>
      </div>
      <div>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="grid col-span-1 gap-4"
        >
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. Bus-001" {...register("name")} />
            {errors.name && (
              <ErrorText>{errors.name.message as string}</ErrorText>
            )}
          </div>
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label>Number</Label>
            <Input placeholder="e.g. MH-XX-YY-ZZZZ" {...register("number")} />
            {errors.number && (
              <ErrorText>{errors.number.message as string}</ErrorText>
            )}
          </div>
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label>Boarding City</Label>
            <CitySearchBox setLocation={setBoardingCity} />
          </div>
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label>Dropping City</Label>
            <CitySearchBox setLocation={setDroppingCity} />
          </div>
          <div>
            <Button
              className="w-full flex items-center gap-2"
              disabled={isPending}
            >
              {isPending && <Loader2 className="animate-spin" />}
              <span>Add Bus</span>
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
