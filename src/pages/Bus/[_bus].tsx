import journeyBanner from "@/assets/journey.jpg";
import ScheduleGrid from "@/components/Bus/DataGrid";
import BusScheduleForm from "@/components/Bus/Schedule";
import Alert from "@/components/_tailwindui/Alert";
import LabelDivider from "@/components/_tailwindui/LabelDivider";
import Spinner from "@/components/_tailwindui/Loadder";
import OverlayLayout from "@/components/_tailwindui/OverlayLayout";
import VerticalStep from "@/components/_tailwindui/VerticalStep";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuthCookie } from "@/hooks/Cookie";
import { ApiHandler } from "@/server/api";
import { IBus, ISchedule } from "@/types/Bus";
import { IPoints } from "@/types/Location";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ArrowRightLeft,
  BusFront,
  CalendarCheck,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function BusViewPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const id = location.pathname.split("/")[4];
  const accessToken = useAuthCookie();
  const [open, setOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const { data, isLoading } = useQuery({
    queryKey: [`bus/${id}`],
    queryFn: async () => {
      const { data } = await ApiHandler(
        "GET",
        `/bus/details/${id}`,
        {},
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );

      return data as IBus;
    },
  });

  const deleteBusHandler = async () => {
    const { success, message } = await ApiHandler(
      "DELETE",
      `/bus/details/${id}`,
      {},
      {
        Authorization: `Bearer ${accessToken}`,
      }
    );

    if (!success) {
      toast({
        description: message,
      });
      return;
    }
  };

  const { mutate } = useMutation({
    mutationFn: deleteBusHandler,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [`buses`],
        exact: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`buses`],
      });
      setDeleteOpen(false);
      navigate("/operator/buses");
    },
  });

  if (isLoading) return <Spinner />;

  return (
    <main>
      <div>
        <img
          src={journeyBanner}
          className="w-full h-48 object-cover object-center rounded-lg"
        />
      </div>
      <section className="mt-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
          <div>
            <div className="font-medium flex items-center gap-4">
              <BusFront className="h-8 w-8" />
              <h1 className="lg:text-4xl text-3xl italic">{data?.number}</h1>
            </div>
            <div className="flex items-center gap-2 mt-2 italic">
              <Link to={`/operator/locations/city/${data?.boardingCityId}`}>
                <span className="lg:text-lg text-sm">
                  {data?.boardingCity?.city?.name}
                </span>
              </Link>
              <ArrowRightLeft className="h-4 w-4" />
              <Link to={`/operator/locations/city/${data?.droppingCityId}`}>
                <span className="lg:text-lg text-sm">
                  {data?.droppingCity?.city?.name}
                </span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              size={"sm"}
              className="flex shrink-0 gap-2"
              variant={"outline"}
              onClick={() => setOpen(true)}
            >
              <CalendarCheck className="w-4 h-4" />
              Schedule
            </Button>
            <Button
              size={"sm"}
              className="flex shrink-0 gap-2 text-red-500"
              variant={"outline"}
              onClick={() => setDeleteOpen(true)}
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
        <div className="mt-8">
          <LabelDivider label="Location Points" />
          <div className="mt-4 grid grid-cols-1 gap-8 lg:gap-0 lg:grid-cols-2 lg:divide-x-2 divide-dashed">
            <div className="col-span-1">
              <p className="text-sm mb-4 italic">Boarding Points</p>
              <VerticalStep
                points={data?.boardingCity.OperatorCityPoints as IPoints[]}
              />
            </div>
            <div className="col-span-1 lg:pl-8">
              <p className="text-sm mb-4 italic">Dropping Points</p>
              <VerticalStep
                points={data?.droppingCity.OperatorCityPoints as IPoints[]}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="mt-8">
            <LabelDivider label="Bus Schedule" />
          </div>
          <div>
            <ScheduleGrid data={data?.busSchedule as ISchedule[]} />
          </div>
        </div>
      </section>
      <OverlayLayout
        open={open}
        setOpen={setOpen}
        children={
          <BusScheduleForm
            busName={String(data?.name)}
            busId={Number(data?.id)}
            closeModel={() => setOpen(false)}
          />
        }
      />
      <Alert
        open={deleteOpen}
        setOpen={setDeleteOpen}
        title="Delete Bus"
        description="Are you sure you want to delete this bus?"
        onSucess={() => {
          mutate();
        }}
      />
    </main>
  );
}
