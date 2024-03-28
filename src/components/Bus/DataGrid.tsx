import OverlayLayout from "../_tailwindui/OverlayLayout";
import CityForm from "@/components/Location/CityForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ISchedule } from "@/types/Bus";
import { TrashIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiHandler } from "@/server/api";
import { useAuthCookie } from "@/hooks/Cookie";
import usePath from "@/hooks/Path";
import { useToast } from "../ui/use-toast";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  data: ISchedule[];
}

export default function ScheduleGrid({ data }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const busId = usePath().split("/")[4];
  const [open, setOpen] = useState<boolean>(false);
  const cookie = useAuthCookie();
  const navigate = useNavigate();
  const handleMutate = async (id: number) => {
    const { success, message } = await ApiHandler(
      "DELETE",
      `/bus/schedule/${id}`,
      {},
      {
        Authorization: `Bearer ${cookie}`,
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
    mutationFn: handleMutate,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [`bus/${busId}`],
        exact: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`bus/${busId}`],
      });

      toast({
        description: "Schedule Deleted",
      });
    },
  });
  return (
    <div className="lg:w-3/4">
      <div className="-mx-4 mt-4 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Sr. No.
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Time
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Passengers
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Select</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 &&
              data?.map((plan, planIdx) => (
                <tr key={plan.id}>
                  <td
                    className={classNames(
                      planIdx === 0 ? "" : "border-t border-transparent",
                      "relative py-4 pl-4 pr-3 text-sm sm:pl-6"
                    )}
                  >
                    <div className="font-medium text-gray-900">
                      {planIdx + 1}
                    </div>
                    {/* <div className="mt-1 flex flex-col text-gray-500 sm:block lg:hidden">
                    <span>
                      {plan.memory} / {plan.cpu}
                    </span>
                    <span className="hidden sm:inline">·</span>
                    <span>{plan.storage}</span>
                  </div> */}
                    {planIdx !== 0 ? (
                      <div className="absolute -top-px left-6 right-0 h-px bg-gray-200" />
                    ) : null}
                  </td>
                  <td
                    className={
                      "border-t border-gray-200 px-3 py-3.5 text-center  text-sm text-gray-500 lg:table-cell"
                    }
                  >
                    {plan.date}
                  </td>
                  <td
                    className={
                      "border-t border-gray-200  px-3 py-3.5 text-center  text-sm text-gray-500 lg:table-cell"
                    }
                  >
                    {plan.time}
                  </td>
                  <td
                    className={
                      "border-t border-gray-200  px-3 py-3.5 text-center  text-sm text-gray-500 lg:table-cell"
                    }
                  >
                    {plan._count?.passenger || 0}
                  </td>
                  <td
                    className={
                      "border-t border-gray-200  px-3 py-3.5 text-right text-sm text-gray-500 lg:table-cell"
                    }
                  >
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        onClick={() =>
                          navigate(`/operator/buses/schedule/${plan.id}`)
                        }
                      >
                        Select<span className="sr-only">, {0}</span>
                      </button>
                      <button
                        type="button"
                        className="inline-flex text-red-600 items-center rounde$-md bg-white px-2.5 py-1.5 text-sm font-semibold  shadow-sm ring-1 ring-inset ring-gray-300   duration-300 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white hover:bg-red-600 hover:text-white rounded-md "
                        onClick={() => mutate(plan?.id)}
                      >
                        <TrashIcon className="h-4 w-4 " />
                      </button>
                    </div>
                    {planIdx !== 0 ? (
                      <div className="absolute -top-px left-0 right-6 h-px bg-gray-200" />
                    ) : null}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <OverlayLayout
        open={open}
        setOpen={setOpen}
        children={<CityForm closeModal={() => setOpen(false)} />}
      />
    </div>
  );
}
