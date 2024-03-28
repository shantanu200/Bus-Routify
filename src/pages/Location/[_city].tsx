import { useLocation, useNavigate } from "react-router-dom";
import cityBanner from "../../assets/cityBanner.jpg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiHandler } from "@/server/api";
import { useAuthCookie } from "@/hooks/Cookie";
import Spinner from "@/components/_tailwindui/Loadder";
import { ICity, IPoints } from "@/types/Location";
import {
  ArrowDownToDot,
  ArrowUpFromDot,
  BusFront,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LocationSearchBox from "@/components/_tailwindui/LocationSearchBox";
import VerticalStep from "@/components/_tailwindui/VerticalStep";
import LabelDivider from "@/components/_tailwindui/LabelDivider";
import { useState } from "react";
import EmptyStates from "@/components/_tailwindui/EmptyState";
import BusCard from "@/components/Bus/BusCard";
import { useToast } from "@/components/ui/use-toast";

export default function CityViewPage() {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.pathname.split("/")[4];
  const accessToken = useAuthCookie();
  const [locationValue, setLocationValue] = useState<IPoints>();
  const [clearLocation, setClearLocation] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: [`city/${id}`],
    queryFn: async () => {
      const { data } = await ApiHandler(
        "GET",
        `/bus-point/details/${id}`,
        {},
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );

      return data as ICity;
    },
  });

  const submitLocationHandler = async (point: IPoints) => {
    if (point.location && point.latitude && point.longitude) {
      const { success, message } = await ApiHandler(
        "POST",
        `/bus-point/point/${id}`,
        {
          location: point?.location,
          latitude: point?.latitude,
          longitude: point?.longitude,
          address: point?.address,
        },
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );

      if (!success) {
        alert(message);
        return;
      }
    } else {
      alert("Please select a location");
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: submitLocationHandler,
    retry: 1,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [`city/${id}`],
        exact: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`city/${id}`],
      });
      setClearLocation(true);
      toast({
        description: "Location Point Added",
      });
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <main>
      <div>
        <img src={cityBanner} className="w-full h-48 object-cover rounded-lg" />
      </div>
      <section className="mt-8">
        <div className="flex items-center gap-2">
          <Map className="h-8 w-8" />
          <h1 className=" lg:text-4xl text-3xl font-medium">
            {data?.city?.name}
          </h1>
        </div>
        <div className="mt-8">
          <LabelDivider label="Location Points" />
        </div>
        <div className="mt-6 min-h-16 lg:w-3/4 flex items-start gap-4">
          <div className="flex-1">
            <LocationSearchBox
              clearLocation={clearLocation}
              setLocation={setLocationValue}
            />
          </div>
          <Button
            disabled={
              locationValue?.location === undefined ||
              locationValue?.location === "" ||
              isPending
            }
            variant={"outline"}
            onClick={() => mutate(locationValue as IPoints)}
          >
            {isPending && <Spinner />}
            Add Location
          </Button>
        </div>
        <div className="mt-8">
          <VerticalStep
            points={data?.OperatorCityPoints as IPoints[]}
            isEditable={true}
          />
        </div>
        <div className="mt-8">
          <LabelDivider label="Buses For City" />
        </div>

        {data?.busBoardingCity &&
        data?.busBoardingCity?.length <= 0 &&
        data?.busDroppingCity?.length <= 0 ? (
          <div className="mt-8 border p-4 rounded-lg bg-gray-50">
            <EmptyStates
              Icon={BusFront}
              handleClick={() => navigate(`/operator/buses`)}
              buttonText={"Add Bus"}
              titleText="No Bus Found"
              descriptionText="Please add new bus Details for route"
            />
          </div>
        ) : (
          <>
            <div className="mt-6 ">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpFromDot />
                <h4 className="font-medium">Dropping City</h4>
              </div>
              {data?.busBoardingCity && data?.busBoardingCity.length > 0 ? (
                <div className="grid lg:grid-cols-3 gap-6">
                  {data?.busBoardingCity?.map((bus) => (
                    <BusCard bus={bus} />
                  ))}
                </div>
              ) : (
                <div className="border p-4 rounded-lg bg-gray-50">
                  <EmptyStates
                    handleClick={() => navigate(`/operator/buses`)}
                    Icon={BusFront}
                    buttonText={"Add Boarding Bus"}
                    titleText="No Boarding Bus Found"
                    descriptionText="Please add new  bording bus for route"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 ">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownToDot />
                <h4 className="font-medium">Boarding City</h4>
              </div>
              {data?.busDroppingCity && data?.busDroppingCity.length > 0 ? (
                <div className="grid lg:grid-cols-3 gap-6">
                  {data?.busDroppingCity?.map((bus) => (
                    <BusCard bus={bus} />
                  ))}
                </div>
              ) : (
                <div className="border p-4 rounded-lg bg-gray-50">
                  <EmptyStates
                    Icon={BusFront}
                    handleClick={() => navigate(`/operator/buses`)}
                    buttonText={"Add Dropping Bus"}
                    titleText="No Dropping Bus Found"
                    descriptionText="Please add new dropping bus  for route"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
