import { useAuthCookie } from "@/hooks/Cookie";
import { ApiHandler } from "@/server/api";
import { IPoints } from "@/types/Location";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, PencilLine, Trash } from "lucide-react";
import { useToast } from "../ui/use-toast";
import usePath from "@/hooks/Path";
import { useState } from "react";
import Alert from "./Alert";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  points: IPoints[];
  isEditable?: boolean;
}

export default function VerticalStep({ points, isEditable = false }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedPoint, setSelectedPoint] = useState<number>(-1);
  const cityId = usePath().split("/")[4];
  const cookie = useAuthCookie();
  const { toast } = useToast();
  const deleteLocationHandler = async (id: number) => {
    const { success, message } = await ApiHandler(
      "DELETE",
      `/bus-point/point/${id}`,
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
    mutationFn: deleteLocationHandler,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [`city/${cityId}`],
        exact: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`city/${cityId}`],
      });
      setOpen(false);
      setSelectedPoint(-1);
    },
  });

  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden">
        {points && points?.map((point, pointIdx) => (
          <li
            key={point.id}
            className={classNames(
              pointIdx !== points.length - 1 ? "pb-10" : "",
              "relative"
            )}
          >
            <>
              {pointIdx !== points.length - 1 ? (
                <div
                  className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-indigo-600"
                  aria-hidden="true"
                />
              ) : null}

              <a className="group relative flex items-center">
                <span className="flex h-9 items-center">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 cursor-pointer border-indigo-600 bg-white group-hover:bg-indigo-800 duration-200">
                    <MapPin
                      className="h-4 w-4 text-indigo-600 group-hover:text-white duration-200"
                      aria-hidden="true"
                    />
                  </span>
                </span>
                <span className="ml-4 flex min-w-0 flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium italic">
                      {point.location}
                    </span>
                    {isEditable && (
                      <>
                        <PencilLine className="h-3 w-3 cursor-pointer" />
                        <Trash
                          onClick={() => {
                            setSelectedPoint(Number(point.id));
                            setOpen(true);
                          }}
                          className="h-3 w-3 cursor-pointer text-red-600"
                        />
                      </>
                    )}
                  </div>
                  <span className="text-sm italic text-gray-500">
                    {" "}
                    {point.address}
                  </span>
                </span>
              </a>
            </>
          </li>
        ))}
      </ol>
      <Alert
        open={open}
        setOpen={setOpen}
        title={"Delete Location"}
        description={"Are you sure you want to delete this location point?"}
        onSucess={() => {
          mutate(selectedPoint);
        }}
      />
    </nav>
  );
}
