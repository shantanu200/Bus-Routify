import { IBus } from "@/types/Bus";
import { BusFront } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  bus: IBus;
}
export default function BusCard({ bus }: Props) {
  return (
    <Link to={`/operator/buses/bus/${bus.id}`}>
      <div className="flex border p-4 rounded-lg">
        <div className="mr-4 flex-shrink-0">
          <BusFront className="h-full w-16 bg-white text-gray-300" />
        </div>
        <div>
          <h4 className="text-lg font-bold italic">
            {bus.boardingCity?.city?.name || bus.droppingCity?.city?.name}
          </h4>
          <div className="flex items-center gap-2">
            <h4>{bus.name}</h4>
            <p className="italic">({bus.number})</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
