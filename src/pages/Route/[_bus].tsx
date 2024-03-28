import BusDetail from "@/components/Route/BusDetail";
import { ApiHandler } from "@/server/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Fragment } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid";
import EmptyData from "@/components/_tailwindui/EmptyData";
import OverlayLayout from "@/components/_tailwindui/OverlayLayout";
import Auth from "@/components/User/Auth";
import Navbar from "@/components/_tailwindui/Navbar";

const filters = [
  {
    id: "distance",
    name: "Distance",
    options: [
      { value: "3km", label: "Less than 3 Km" },
      { value: "5km", label: "3km - 5km" },
      { value: "7km", label: "5km - 7km" },
      { value: "8km", label: "Greater than 7km" },
    ],
  },
  {
    id: "category",
    name: "Category",
    options: [
      { value: "new-arrivals", label: "All New Arrivals" },
      { value: "tees", label: "Tees" },
      { value: "crewnecks", label: "Crewnecks" },
      { value: "sweatshirts", label: "Sweatshirts" },
      { value: "pants-shorts", label: "Pants & Shorts" },
    ],
  },
  {
    id: "sizes",
    name: "Sizes",
    options: [
      { value: "xs", label: "XS" },
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
      { value: "xl", label: "XL" },
      { value: "2xl", label: "2XL" },
    ],
  },
];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function BusListViewPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [authModel, setAuthModel] = useState<boolean>(false);
  const { state } = useLocation();
  const observer = useRef<IntersectionObserver>();
  const [searchParams, setSearchParms] = useSearchParams();
  const fetchBuses = async ({ pageParam }: { pageParam: number }) => {
    const { data, success } = await ApiHandler(
      "GET",
      `/location/suggest?date=${state?.date}&droppingCity=${
        state?.destinationLocation?.id
      }&lat=${state?.boardingLocation?.latitude}&lng=${
        state?.boardingLocation?.longitude
      }&radius=${20}&page=${pageParam}&limit=${3}`
    );

    if (!success) {
      alert("Failed to fetch buses");
      return;
    }

    return data;
  };

  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["bookingBuses"],
      queryFn: ({ pageParam }) => fetchBuses({ pageParam }),
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
      initialPageParam: 2,
    });

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoading, isFetching, hasNextPage, fetchNextPage]
  );

  const buses = useMemo(() => {
    return data?.pages.reduce(
      (acc, page) => [...acc, ...page],
      []
    ) as IBusBooking[];
  }, [data]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;

    if (checked) {
      setSearchParms({
        ...searchParams,
        [name]: value,
      });
    } else {
      searchParams.delete(name);
      setSearchParms(searchParams);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white">
        <div>
          {/* Mobile filter dialog */}
          <Transition.Root show={mobileFiltersOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-40 lg:hidden"
              onClose={setMobileFiltersOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 z-40 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                    <div className="flex items-center justify-between px-4">
                      <h2 className="text-lg font-medium text-gray-900">
                        Filters
                      </h2>
                      <button
                        type="button"
                        className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                        onClick={() => setMobileFiltersOpen(false)}
                      >
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Filters */}
                    <form className="mt-4">
                      {filters.map((section) => (
                        <Disclosure
                          as="div"
                          key={section.name}
                          className="border-t border-gray-200 pb-4 pt-4"
                        >
                          {({ open }) => (
                            <fieldset>
                              <legend className="w-full px-2">
                                <Disclosure.Button className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                                  <span className="text-sm font-medium text-gray-900">
                                    {section.name}
                                  </span>
                                  <span className="ml-6 flex h-7 items-center">
                                    <ChevronDownIcon
                                      className={classNames(
                                        open ? "-rotate-180" : "rotate-0",
                                        "h-5 w-5 transform"
                                      )}
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Disclosure.Button>
                              </legend>
                              <Disclosure.Panel className="px-4 pb-2 pt-4">
                                <div className="space-y-6">
                                  {section.options.map((option, optionIdx) => (
                                    <div
                                      key={option.value}
                                      className="flex items-center"
                                    >
                                      <input
                                        id={`${section.id}-${optionIdx}-mobile`}
                                        name={`${section.id}[]`}
                                        defaultValue={option.value}
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      />
                                      <label
                                        htmlFor={`${section.id}-${optionIdx}-mobile`}
                                        className="ml-3 text-sm text-gray-500"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </Disclosure.Panel>
                            </fieldset>
                          )}
                        </Disclosure>
                      ))}
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div className="border-b border-gray-200 pb-10">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {buses?.length > 0 ? "Embark Journey" : "No Buses Found!"}
              </h1>
              <p className="mt-4 text-base text-gray-500">
                {buses?.length > 0
                  ? `Find the best buses for your journey from
              ${buses[0]?.boarding_city_name} to ${buses[0]?.dropping_city_name}
              on ${state?.date}.`
                  : "Sorry No buses found for your route!"}
              </p>
            </div>

            <div className="pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
              <aside>
                <h2 className="sr-only">Filters</h2>

                <button
                  type="button"
                  className="inline-flex items-center lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <span className="text-sm font-medium text-gray-700">
                    Filters
                  </span>
                  <PlusIcon
                    className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                </button>

                <div className="hidden lg:block sticky top-24">
                  <form className="space-y-10 divide-y divide-gray-200">
                    {filters.map((section, sectionIdx) => (
                      <div
                        key={section.name}
                        className={sectionIdx === 0 ? "" : "pt-10"}
                      >
                        <fieldset>
                          <legend className="block text-sm font-medium text-gray-900">
                            {section.name}
                          </legend>
                          <div className="space-y-3 pt-6">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`${section.id}-${optionIdx}`}
                                  name={`${section.id}`}
                                  defaultValue={option.value}
                                  onChange={handleFilter}
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-gray-600"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </fieldset>
                      </div>
                    ))}
                  </form>
                </div>
              </aside>

              <div className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
                {buses?.length > 0 ? (
                  buses?.map((bus: IBusBooking) => (
                    <BusDetail
                      key={bus.id + Math.random() * 1000}
                      openAuth={() => setAuthModel(true)}
                      lastElementRef={lastElementRef}
                      data={bus}
                    />
                  ))
                ) : (
                  <EmptyData desctiption="Sorry No buses found for your route!" />
                )}
              </div>
            </div>
          </main>
        </div>
        <OverlayLayout
          open={authModel}
          setOpen={setAuthModel}
          children={<Auth closeModal={() => setAuthModel(false)} />}
        />
      </div>
    </>
  );
}
