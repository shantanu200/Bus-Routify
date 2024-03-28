import { ICity } from "@/types/Location";
import { useNavigate } from "react-router-dom";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  data: ICity[];
}

export default function CityGrid({ data }: Props) {
  
  const navigate = useNavigate();
  return (
    <div className="">
      

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
                City
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 hidden text-center text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Location Points
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 hidden text-sm text-center font-semibold text-gray-900 lg:table-cell"
              >
                Buses
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
                    <div className="font-medium text-gray-900">{plan.id}</div>
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
                      "border-t font-medium italic border-gray-200  px-3 py-3.5 text-center text-sm text-gray-500 lg:table-cell"
                    }
                  >
                    {plan?.city?.name}
                  </td>
                  <td
                    className={
                      "border-t border-gray-200 hidden  px-3 py-3.5 text-center text-sm text-gray-500 lg:table-cell"
                    }
                  >
                    {plan._count?.OperatorCityPoints || 0}
                  </td>
                  <td
                    className={
                      "border-t border-gray-200 hidden px-3 py-3.5 text-sm text-center text-gray-500 lg:table-cell"
                    }
                  >
                    {plan._count
                      ? (plan._count.busBoardingCity || 0) +
                        (plan._count.busDroppingCity || 0)
                      : 0}
                  </td>
                  <td
                    className={
                      "border-t border-gray-200 px-3 py-3.5 text-center text-sm text-gray-500 lg:table-cell"
                    }
                  >
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                      onClick={() => navigate(`/operator/locations/city/${plan.id}`)}
                    >
                      Select<span className="sr-only">, {plan.city?.name}</span>
                    </button>
                    {planIdx !== 0 ? (
                      <div className="absolute -top-px left-0 right-6 h-px bg-gray-200" />
                    ) : null}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}
