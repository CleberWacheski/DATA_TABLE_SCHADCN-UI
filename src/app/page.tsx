/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { PersonIcon } from "@radix-ui/react-icons";
import { asc, desc, eq, like } from "drizzle-orm";
import { db } from "~/server/db";
import { customers } from "~/server/db/schema";
import { TableDemo } from "./_components/table";
import {
  QUERY_COLUMNS_PARAM,
  QUERY_DEFAULT_LIMIT,
  QUERY_LIMIT_PARAM,
  SEARCH_COLUMN,
  SEARCH_VALUE,
  SORT_COLUMN,
  SORT_VALUE,
} from "./_libs/constants";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const headers = new Map([
    [
      "id",
      {
        defaultVisible: true,
        label: "ID",
        sortable: true,
        searchable: true,
      },
    ],
    [
      "name",
      {
        defaultVisible: true,
        label: "Nome",
        sortable: true,
        searchable: true,
      },
    ],
    [
      "email",
      {
        defaultVisible: true,
        label: "Email",
        sortable: false,
        searchable: true,
      },
    ],
    [
      "address",
      {
        defaultVisible: true,
        label: "Endereço",
        sortable: false,
        searchable: true,
      },
    ],
    [
      "status",
      {
        defaultVisible: true,
        label: "Status",
        sortable: false,
        searchable: true,
      },
    ],
    [
      "age",
      {
        defaultVisible: false,
        label: "Idade",
        searchable: true,
        sortable: true,
      },
    ],
    [
      "phone",
      {
        defaultVisible: false,
        label: "Telefone",
        sortable: false,
        searchable: true,
      },
    ],
    [
      "createdAt",
      {
        defaultVisible: false,
        label: "Criado em",
        searchable: false,
        sortable: true,
      },
    ],
  ]);
  function getColumnsVisible() {
    const params = searchParams[QUERY_COLUMNS_PARAM] ?? undefined;
    if (params) {
      return params.split(",");
    }
    return [...headers.entries()].flatMap(([key, value]) => {
      return value.defaultVisible ? [key] : [];
    });
  }
  const columns = getColumnsVisible();
  const where = () => {
    if (!searchParams[SEARCH_COLUMN] || !searchParams[SEARCH_VALUE]) return;
    const column = searchParams[SEARCH_COLUMN];
    const value = searchParams[SEARCH_VALUE];

    switch (column) {
      case "name":
        return like(customers.name, `%${value}%`);
      case "email":
        return like(customers.email, `%${value}%`);
      case "status":
        return like(customers.status, `%${value}%`);
      case "phone":
        return like(customers.phone, `%${value}%`);
      case "age":
        return eq(customers.age, Number(value));
      case "address":
        return like(customers.address, `%${value}%`);
      default:
        return undefined;
    }
  };
  const limit = searchParams[QUERY_LIMIT_PARAM] ?? QUERY_DEFAULT_LIMIT;
  const order = () => {
    if (!searchParams[SORT_COLUMN] || !searchParams[SORT_VALUE]) return;
    const column = searchParams[SORT_COLUMN];
    const value = searchParams[SORT_VALUE];
    switch (column) {
      case "name":
        return value === "asc" ? asc(customers.name) : desc(customers.name);
      case "createdAt":
        return value === "asc"
          ? asc(customers.createdAt)
          : desc(customers.createdAt);
      default:
        desc(customers.createdAt);
    }
  };

  const customersList = await db.query.customers.findMany({
    columns: {
      id: true,
      address: columns.includes("address"),
      age: columns.includes("age"),
      createdAt: columns.includes("createdAt"),
      email: columns.includes("email"),
      name: columns.includes("name"),
      phone: columns.includes("phone"),
      status: columns.includes("status"),
    },
    where: where(),
    orderBy: order(),
    limit: Number(limit),
  });

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-muted/70 p-5">
      <TableDemo
        tableContent={customersList.map((item) => ({
          ...item,
          //@ts-ignore
          name: <p className="font-bold">{item?.name as string}</p>,
        }))}
        headers={headers}
        caption="LISTA DE CLIENTES TODOS OS CLIENTES"
        defaultLimit={QUERY_DEFAULT_LIMIT}
        queryLimits={[10, 20, 30, 50]}
        contentTitle={
          <section className=" flex items-center justify-start gap-3 text-xl font-bold drop-shadow-sm">
            <PersonIcon className="size-8" />
            <h1>Lista de clientes</h1>
          </section>
        }
      />
    </main>
  );
}
