import CityForm from "@/components/Location/CityForm";
import CityGrid from "@/components/Location/DataGrid";
import Spinner from "@/components/_tailwindui/Loadder";
import OverlayLayout from "@/components/_tailwindui/OverlayLayout";
import Pagination from "@/components/_tailwindui/Pagination";
import { Input } from "@/components/ui/input";
import { useAuthCookie } from "@/hooks/Cookie";
import { ApiHandler } from "@/server/api";
import { ICity } from "@/types/Location";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import React, { useState } from "react";
export default function LocationPage() {
  const accessToken = useAuthCookie();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [query, setQuery] = useState<string>("");

  const getFromCache = (key: string) => {
    return queryClient.getQueryData([key]);
  };

  const { data, isLoading } = useQuery({
    queryKey: [`locations/${query}`, page, limit],
    queryFn: async (arg) => {
      const cache = getFromCache(`locations/${query}`) as ICity[] | undefined;

      if (cache) return cache;

      const response = await ApiHandler(
        "GET",
        `/bus-point/operator?page=${arg.queryKey[1]}&limit=${arg.queryKey[2]}&q=${query}`,
        {},
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );

      return response.data;
    },
  });

  const handleChange = debounce((q: string) => {
    setQuery(q);
  }, 500);

  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Cities
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Your team is on the{" "}
            <strong className="font-semibold text-gray-900">Startup</strong>{" "}
            plan. The next payment of $80 will be due on August 4, 2022.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setOpen(true)}
          >
            Add New City
          </button>
        </div>
      </div>
      <div className="w-1/3 mb-6">
        <Input
          placeholder="Search City By Name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e.target.value)
          }
        />
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <CityGrid data={data?.data} />
          {!query && (
            <Pagination
              currentPage={page}
              limit={limit}
              totalPage={data?.totalPage}
              totalDocument={data?.totalDocument}
              setPage={setPage}
            />
          )}
        </>
      )}
      <OverlayLayout
        open={open}
        setOpen={setOpen}
        children={<CityForm closeModal={() => setOpen(false)} />}
      />
    </main>
  );
}
