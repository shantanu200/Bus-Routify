import { useState } from "react";
import LocationBox from "../_tailwindui/LocationBox";
import { Button } from "../ui/button";
import { ApiHandler } from "@/server/api";
import { useAuthCookie } from "@/hooks/Cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Map } from "lucide-react";
import Spinner from "../_tailwindui/Loadder";
import { ICityGlobal } from "@/types/Location";
import { useToast } from "../ui/use-toast";

interface Props {
  closeModal: () => void;
}

export default function CityForm({ closeModal }: Props) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<ICityGlobal>();
  const cookie = useAuthCookie();

  console.log(selectedLocation);

  const submitHandler = async (value: ICityGlobal) => {
    if (selectedLocation && selectedLocation.id) {
      const { success, message } = await ApiHandler(
        "POST",
        "/bus-point",
        {
          cityId: value.id,
        },
        {
          Authorization: `Bearer ${cookie}`,
        }
      );

      if (!success) {
        toast({
          title: message,
        });
        return;
      }

      closeModal();
    } else {
      toast({
        title: "Please select a location first",
      });
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: submitHandler,
    retry: 1,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["locations"],
        exact: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });
    },
  });

  return (
    <div className="grid col-span-1 gap-4">
      <div>
        <div className="text-lg flex shrink-0 gap-2 items-center font-medium">
          <Map />
          <span>Add New City</span>
        </div>
        <p className="text-sm text-gray-500">
          Make a new location your business
        </p>
      </div>
      <div>
        <LocationBox setLocation={setSelectedLocation} />
      </div>
      <Button
        onClick={() => mutate(selectedLocation as ICityGlobal)}
        disabled={isPending}
      >
        {isPending && <Spinner />}
        Submit
      </Button>
    </div>
  );
}
