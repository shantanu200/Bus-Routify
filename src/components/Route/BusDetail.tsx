import {
  Building2Icon,
  MilkIcon,
  PlugZapIcon,
  RouteIcon,
  StarIcon,
  WifiIcon,
} from "lucide-react";
import moment from "moment";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useUserAuthCookie } from "@/hooks/Cookie";
interface Props {
  lastElementRef: (node: HTMLDivElement) => void;
  data: IBusBooking;
  openAuth: () => void;
}

export default function BusDetail({ lastElementRef, data, openAuth }: Props) {
  const navigate = useNavigate();
  const userCookie = useUserAuthCookie();
  let droppingTime = moment(data?.time, "HH:mm")
    .add(14, "hours")
    .format("hh:mm");
  return (
    <div
      ref={lastElementRef}
      className="min-h-48 w-full border border-indigo-100 rounded-lg flex shadow-sm mb-8"
    >
      <div className="p-8 w-full flex flex-col justify-between">
        <div className="w-full grid lg:grid-cols-8 gap-x-4 gap-y-4">
          <div className="lg:col-span-2 col-span-3 flex gap-4">
            <Building2Icon />
            <h1 className="text-xl font-medium">{data?.operator_name}</h1>
          </div>
          <div className="col-span-3 grid grid-cols-3">
            <div className="col-span-1 text-center">
              <span className="text-lg font-medium">{data?.time}</span>
            </div>
            <div className="col-span-1 text-center text-gray-400 italic">
              14hr 00m
            </div>
            <div className="col-span-1 text-center text-lg">
              <span>{droppingTime}</span>
            </div>
          </div>
          <div className="col-span-3 grid grid-cols-3 gap-y-4">
            <div className="lg:col-span-1 col-span-3 text-left">
              <span className="inline-flex gap-2 items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                <StarIcon className="h-3 w-3" />
                4.1
              </span>
            </div>
            <div className="lg:col-span-1">
              <p>Start From</p>
              <span className="font-semibold italic">INR 1200</span>
            </div>
            <div className="col-span-1 text-center">
              <span>{36 - data?.total_passengers} Seats available</span>
            </div>
          </div>
        </div>
        <div className="flex lg:flex-row flex-col lg:items-center justify-between gap-y-4">
          <div className="flex lg:flex-row flex-col lg:gap-x-8 gap-y-4">
            <div>
              <span
                className={`inline-flex items-center gap-x-1.5 rounded-md ${
                  data?.min_distance < 3
                    ? "bg-green-50"
                    : data?.min_distance < 8
                    ? "bg-yellow-50"
                    : "bg-red-50"
                } px-2 py-1 text-sm font-medium ${
                  data?.min_distance < 3
                    ? "text-green-700"
                    : data?.min_distance < 8
                    ? "text-yellow-700"
                    : "text-red-700"
                }`}
              >
                <RouteIcon className="w-3 h-3" />{" "}
                {data?.min_distance.toPrecision(3)} Km From Your Location
              </span>
            </div>
            <div>
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 gap-4">
                {[
                  <PlugZapIcon className="w-5 h-5" />,
                  <WifiIcon className="w-5 h-5" />,
                  <MilkIcon className="w-5 h-5" />,
                ].map((icon) => icon)}
              </span>
            </div>
          </div>
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => {
              if (!userCookie) {
                console.log("openAuth");
                openAuth();
              } else {
                navigate(`/user/schedule/book/${data?.id}`);
              }
            }}
          >
            Book Seats
          </Button>
        </div>
      </div>
    </div>
  );
}
