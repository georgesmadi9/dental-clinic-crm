"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { ArrowUpNarrowWide, ArrowDownNarrowWide, Search } from "lucide-react";

const NavbarDashboards = ({
  search,
  setSearch,
  filter,
  setFilter,
  sortingDirection,
  setSortingDirection,
  title,
}: {
  search: string;
  setSearch: (v: string) => void;
  filter: string;
  setFilter: (v: "name" | "case_name" | "date") => void;
  sortingDirection: "asc" | "desc";
  setSortingDirection: (v: "asc" | "desc") => void;
  title: string;
}) => {
  const toggleSortingDirection = () => {
    setSortingDirection(sortingDirection === "asc" ? "desc" : "asc");
  };

  // Determine the correct value and label for the "name" option
  const nameOptionValue = title === "Cases" ? "case_name" : "name";
  const nameOptionLabel = title === "Cases" ? "Case Name" : "Name";

  return (
    <>
      <header className="bg-[#19287A] flex h-16 shrink-0 items-center px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 w-full">
          {/* Left: Sidebar Trigger + Title */}
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-lg text-white flex items-center justify-center">
              <SidebarTrigger className="-ml-1" />
            </div>
            <div className="px-4 py-1 rounded-lg text-white flex items-center justify-center">
              <span className="text-lg font-semibold">{title}</span>
            </div>
          </div>

          {/* Right: Search + Filter + Button */}
          <div
            className="flex items-center ml-auto gap-4"
            hidden={!(title == "Cases" || title == "Patients")}
          >
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border bg-white border-gray-300 px-4 py-2 pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Search className="h-4 w-4" color="#19287A" />
              </span>
            </div>

            {/* Filter + Sort Button */}
            <div className="flex items-center rounded-lg overflow-hidden bg-white border border-gray-300 min-w-[220px]">
              <select
                className="rounded-l-lg px-4 py-2 text-gray-700  focus:outline-none w-3/4"
                value={filter}
                onChange={(e) => setFilter(e.target.value as "name" | "case_name" | "date")}
              >
                <option value="" disabled>
                  Filter by
                </option>
                <option value={nameOptionValue}>{nameOptionLabel}</option>
                <option value="date">Date</option>
              </select>
              <button
                type="button"
                className="rounded-r-lg px-3 py-2 flex items-center justify-center border-s-gray-300 text-white focus:outline-none w-1/4"
                aria-label="Toggle sort direction"
                onClick={toggleSortingDirection}
              >
                {sortingDirection === "asc" ? (
                  <ArrowUpNarrowWide className="h-5 w-5" color="#19287A" />
                ) : (
                  <ArrowDownNarrowWide className="h-5 w-5" color="#19287A" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavbarDashboards;
