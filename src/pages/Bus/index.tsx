import BusStats from "@/components/Bus/BusStat";
import NewBusForm from "@/components/Bus/NewBus";
import Spinner from "@/components/_tailwindui/Loadder";
import OverlayLayout from "@/components/_tailwindui/OverlayLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthCookie } from "@/hooks/Cookie";
import { ApiHandler } from "@/server/api";
import { IBus } from "@/types/Bus";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bus, ArrowRightLeftIcon, Ticket } from "lucide-react";
import { useState } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import EmptyData from "@/components/_tailwindui/EmptyData";

export default function BusPage() {
  const queryClient = useQueryClient();
  const [openmodal, setOpenModal] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const accessToken = useAuthCookie();
  const getFromCache = (key: string) => {
    return queryClient.getQueryData([key]);
  };
  const { data, isLoading } = useQuery({
    queryKey: [`buses/${query}`],
    queryFn: async (arg) => {
      const cache = getFromCache(`buses/${query}`) as IBus[] | undefined;

      if (cache) return cache;

      const response = await ApiHandler(
        "GET",
        `/bus/operator?q=${arg.queryKey[0].split("/")[1]}`,
        {},
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );

      return response.data as IBus[];
    },
  });

  const handleChange = _.debounce((q: string) => {
    setQuery(q);
  }, 800);

  return (
    <main>
      <BusStats />
      <div className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Search buses by city,locations and numbers...."
            className="lg:w-1/2"
            onChange={(e) => handleChange(e.target.value)}
          />
          <div className="">
            <Button
              className="flex gap-2"
              onClick={() => setOpenModal(!openmodal)}
            >
              <Bus />
              <span className="">Add Bus</span>
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : data && data?.length > 0 ? (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
          {data?.map((bus: IBus) => (
            <Link key={bus.id} to={`/operator/buses/bus/${bus.id}`}>
              <div className="flex border p-4 rounded-lg hover:cursor-pointer hover:bg-gray-50 duration-300">
                <div className="mr-4 flex-shrink-0">
                  <Bus className="h-full w-16 bg-white text-gray-300 " />
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-bold italic flex items-center gap-2">
                    {bus.boardingCity?.city?.name}
                    <ArrowRightLeftIcon />
                    {bus.droppingCity?.city?.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <h4>{bus.name}</h4>
                    <p className="italic">({bus.number})</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4" />
                    <span className="text-sm italic">{0} Tickets</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyData desctiption="Bus Details not found for query" />
      )}

      <OverlayLayout
        open={openmodal}
        setOpen={setOpenModal}
        children={<NewBusForm closeModel={() => setOpenModal(false)} />}
      />
    </main>
  );
}
