import { IPassengerBooking } from "@/types/Bus";
import { Fragment } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";


function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  data: IPassengerBooking[];
}

export default function PassengerGrid({ data }: Props) {
  const navigate = useNavigate();
  return (
    <div > 
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full">
              <thead className="bg-white">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Seat
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Boarding Location
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Booking Date
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {data?.map((location) => (
                  <Fragment key={location?.name}>
                    <tr className="border-t border-gray-200">
                      <th
                        colSpan={6}
                        scope="colgroup"
                        className="bg-gray-100 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4">
                            <p>{location?.name}</p>
                            <p className="italic">({location?.busSchedule[0]?.date} || {location?.busSchedule[0]?.time})</p>
                          </div>
                          <Button variant={"link"} onClick={() => navigate(`/operator/buses/bus/${location?.id}`)}>View</Button>
                        </div>
                      </th>
                    </tr>
                    {location?.busSchedule[0]?.passenger.map(
                      (person, personIdx) => (
                        <tr
                          key={person.name}
                          className={classNames(
                            personIdx === 0
                              ? "border-gray-300"
                              : "border-gray-200",
                            "border-t"
                          )}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                            {person?.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {person?.contact}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {person?.seat}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {person?.boardingPoint?.location}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {person?.date}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                          <Button variant={"link"}  className="text-indigo-600">
                            Edit
                          </Button>
                          </td>
                        </tr>
                      )
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
