import { useEffect, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import _ from "lodash";
import { ApiHandler } from "@/server/api";
import { ICityGlobal } from "@/types/Location";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  setLocation: (value: ICityGlobal) => void;
  placeholder?: string;
}

export default function LocationBox({ setLocation, placeholder }: Props) {
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<ICityGlobal>();
  const [dbLocations, setDBLocations] = useState<ICityGlobal[]>();
  const [locations, setLocations] = useState<ICityGlobal[]>();

  const fetchLocations = async () => {
    const { data, success, message } = await ApiHandler("GET", "/cities");

    if (!success) {
      alert(message);
      return;
    }

    setDBLocations(data);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const searchCities = () => {
    if (dbLocations && dbLocations?.length > 0) {
      let data = dbLocations;
      data = data.filter((city) =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );
      setLocations(data);
    } else {
      setLocations(dbLocations);
    }
  };
  const debouncedFetchLocations = _.debounce(searchCities, 300);

  useEffect(() => {
    debouncedFetchLocations();

    return () => {
      debouncedFetchLocations.cancel();
    };
  }, [query]);

  useEffect(() => {
    if (selectedLocation) {
      setLocation(selectedLocation);
    }
  }, [selectedLocation]);

  return (
    <Combobox as="div" value={selectedLocation} onChange={setSelectedLocation}>
      <div className="relative">
        <Combobox.Input
          className="w-full h-10 rounded-md border-0 bg-white py-2.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder || ""}
          displayValue={(location: ICityGlobal) => location.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {locations && locations?.length > 0 && (
          <Combobox.Options className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {locations.map((location, idx) => (
              <Combobox.Option
                key={idx}
                value={location}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected ? "font-semibold" : ""
                      )}
                    >
                      {location.name}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
