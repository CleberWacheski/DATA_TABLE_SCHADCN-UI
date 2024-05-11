/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";

import { type ReactNode } from "react";
import { useTableParams } from "../_hooks/useTableParams";
import { ColumnHeaderSort } from "./column-sort";

export type TableProps = {
  defaultLimit: number;
  queryLimits: number[];
  contentTitle: ReactNode;
  caption?: string;
  headers: Map<
    string,
    {
      label: string;
      sortable: boolean;
      searchable: boolean;
      defaultVisible: boolean;
    }
  >;
  tableContent: ({ id: string | number } & Record<string, ReactNode>)[];
};

export function TableDemo({
  tableContent,
  headers,
  queryLimits,
  contentTitle,
  caption,
  defaultLimit,
}: TableProps) {
  const {
    columnSearch,
    isColumnVisible,
    setOrder,
    toggleColumnVisible,
    setLimit,
    limit,
    onSearch,
    sortBy,
    sortValue,
    deleteParams,
    setColumnSearch,
  } = useTableParams({
    headers,
    defaultLimit,
  });

  return (
    <div className="w-full space-y-6 overflow-x-scroll rounded-lg bg-white px-6 py-8 shadow-md">
      <div className="grid w-full grid-cols-[1fr_280px]">
        {contentTitle}
        <div className="flex items-center gap-4">
          <Select value={limit} onValueChange={(e) => setLimit(e)}>
            <SelectTrigger className="w-max min-w-[140px]">
              <SelectValue placeholder="Quant. Linhas" />
            </SelectTrigger>
            <SelectContent>
              {queryLimits.map((limit) => (
                <SelectItem key={limit} value={limit.toString()}>
                  {limit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                VISUALIZAR
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Visualizar Colunas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[...headers.entries()].map(([column, obj]) => (
                <DropdownMenuCheckboxItem
                  className="uppercase"
                  key={column}
                  checked={isColumnVisible(column)}
                  onCheckedChange={() => {
                    toggleColumnVisible(column);
                  }}
                >
                  {obj.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-3">
        <form
          className="flex items-center justify-start gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
        >
          <Select
            onValueChange={(e) => {
              setColumnSearch((state) => ({
                ...state,
                column: e,
              }));
            }}
            value={columnSearch?.column}
          >
            <SelectTrigger className="w-max">
              <SelectValue placeholder="Pesquisar por" />
            </SelectTrigger>
            <SelectContent>
              {[...headers.entries()].map(([column, obj]) => (
                <SelectItem key={column} value={column}>
                  {obj.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={columnSearch?.value}
            onChange={(e) => {
              setColumnSearch((state) => ({
                ...state,
                value: e.target.value,
              }));
            }}
            placeholder="Pesquisar ...."
            className="w-[300px] px-4 transition-all focus:shadow-md"
          />
          <Button variant="outline" size="icon">
            <MagnifyingGlassIcon />
          </Button>
        </form>
        <Button
          size="sm"
          onClick={deleteParams}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Cross2Icon />
          DELETAR FILTROS
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {[...headers.entries()].map(([column, obj]) => {
              if (obj.sortable) {
                return (
                  <TableHead
                    key={obj.label}
                    className={cn(!isColumnVisible(column) && "hidden")}
                  >
                    <ColumnHeaderSort
                      order={
                        sortBy === column
                          ? (sortValue as "asc" | "desc")
                          : undefined
                      }
                      onSortAsc={() => setOrder(column, "asc")}
                      onSortDesc={() => setOrder(column, "desc")}
                    >
                      {obj.label}
                    </ColumnHeaderSort>
                  </TableHead>
                );
              }
              return (
                <TableHead
                  key={obj.label}
                  className={cn(!isColumnVisible(column) && "hidden")}
                >
                  {obj.label}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableContent?.map((data) => (
            <TableRow key={data.id}>
              {[...headers.entries()].map(([column]) => (
                <TableCell
                  key={column}
                  className={cn(!isColumnVisible(column) && "hidden")}
                >
                  {data[column]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>{caption}</TableCaption>
      </Table>
    </div>
  );
}
