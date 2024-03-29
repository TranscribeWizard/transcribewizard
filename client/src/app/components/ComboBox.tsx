"use client";

import { Combobox, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useState } from "react";
import { Control, useController } from "react-hook-form";


type Data = {
  value: string;
  name: string;
};

type Props = {
  name: string;
  control: Control<any>;
  dataArr: Data[];
  defaultValue: Data | undefined;
};

const ComboBox = ({ name, control, dataArr, defaultValue }: Props) => {
  const [query, setQuery] = useState("");

  const {
    field: { value, onChange },
  } = useController({ name, control, defaultValue });

  const filteredArr =
    query === ""
      ? dataArr
      : dataArr.filter((filteredData: Data) =>
          filteredData.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative input-bordered input !px-0 rounded-lg bg-base-100 ">
        <div className="relative rounded-md py-0.5 w-full cursor-default overflow-hidden  text-left shadow-sm  focus:outline-none focus-visible:ring-2    sm:text-sm">
          <Combobox.Input
            className="w-full  outline-none bg-base-100 border-none py-2 pl-3 pr-10 text-lg leading-5  focus:ring-0"
            displayValue={(data: Data) => data.name}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Image
              aria-hidden="true"
              src="svg/updownarrow.svg"
              height="20"
              width="20"
              alt="updown arrow"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-base-200 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredArr.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredArr.map((data: Data, i: number) => (
                <Combobox.Option
                  key={i}
                  className={({ active }) =>
                    `relative z-10  cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-primary text-white" : ""
                    }`
                  }
                  value={data}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {data.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-secondary"
                          }`}
                        >
                          <Image
                            aria-hidden="true"
                            src="svg/checkicon.svg"
                            height="20"
                            width="20"
                            alt="updown arrow"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default ComboBox;
