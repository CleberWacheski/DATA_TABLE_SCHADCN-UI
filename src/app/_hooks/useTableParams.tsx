import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { type TableProps } from "../_components/table";
import {
  QUERY_COLUMNS_PARAM,
  QUERY_LIMIT_PARAM,
  SEARCH_COLUMN,
  SEARCH_VALUE,
  SORT_COLUMN,
  SORT_VALUE,
} from "../_libs/constants";

export function useTableParams({
  headers,
  defaultLimit,
}: {
  headers: TableProps["headers"];
  defaultLimit: TableProps["defaultLimit"];
}) {
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(searchParams);
  const limit = searchParams.get(QUERY_LIMIT_PARAM) ?? String(defaultLimit);
  const sortBy = searchParams.get(SORT_COLUMN) ?? undefined;
  const sortValue = searchParams.get(SORT_VALUE) ?? undefined;
  const searchValue = searchParams.get(SEARCH_VALUE) ?? undefined;
  const searchBy = searchParams.get(SEARCH_COLUMN) ?? undefined;
  const [columnSearch, setColumnSearch] = useState<
    | {
        column?: string;
        value?: string;
      }
    | undefined
  >({
    column: searchBy,
    value: searchValue,
  });
  const router = useRouter();
  const pathname = usePathname();
  function setParam(param: string, value?: string) {
    if (value) {
      currentParams.set(param, value);
    } else {
      currentParams.delete(param);
    }
  }

  function getColumnsVisible() {
    const params = searchParams.get(QUERY_COLUMNS_PARAM) ?? undefined;
    if (params) {
      return params.split(",");
    }
    return [...headers.entries()].flatMap(([key, value]) => {
      return value.defaultVisible ? [key] : [];
    });
  }

  function isColumnVisible(column: string) {
    const columns = getColumnsVisible();
    return columns.includes(column);
  }

  function toggleColumnVisible(column: string) {
    const columns = getColumnsVisible();
    if (columns.includes(column)) {
      setParam(
        QUERY_COLUMNS_PARAM,
        columns.filter((c) => c !== column).join(","),
      );
    } else {
      setParam(QUERY_COLUMNS_PARAM, [...columns, column].join(","));
    }
    router.replace(`${pathname}?${currentParams.toString()}`);
  }

  function onSearch() {
    if (!columnSearch?.column || !columnSearch.value) return;
    setParam(SEARCH_COLUMN, columnSearch.column);
    setParam(SEARCH_VALUE, columnSearch.value);
    router.replace(`${pathname}?${currentParams.toString()}`);
  }

  function setLimit(limit: string) {
    setParam(QUERY_LIMIT_PARAM, limit);
    router.replace(`${pathname}?${currentParams.toString()}`);
  }

  function setOrder(column: string, value: string) {
    setParam(SORT_COLUMN, column);
    setParam(SORT_VALUE, value);
    router.replace(`${pathname}?${currentParams.toString()}`);
  }

  function deleteParams() {
    router.replace(pathname);
  }

  return {
    getColumnsVisible,
    setLimit,
    sortBy,
    sortValue,
    setOrder,
    limit,
    deleteParams,
    setColumnSearch,
    columnSearch,
    onSearch,
    toggleColumnVisible,
    isColumnVisible,
  };
}
