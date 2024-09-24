"use client";

import { getTransactionHistoryResponseType } from "@/app/api/transactions-history/route";
import { DateToUTCDate } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { DataTableColumnHeader } from "@/components/datatable/ColumnHeader";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { DataTableFacetedFilter } from "@/components/datatable/FacetedFilter";
import { DataTableViewOptions } from "@/components/datatable/ColumnToggle";
import { Button } from "@/components/ui/button";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { DownloadIcon } from "lucide-react";

interface Props {
  from: Date;
  to: Date;
}

const emptyData: any[] = [];

type TransactionHistoryRow = getTransactionHistoryResponseType[0];

const columns: ColumnDef<TransactionHistoryRow>[] = [
  // this row renders all categories of transactions
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 capitalize">
          {row.original.categoryIcon}
          <div className="capitalize">{row.original.category}</div>
        </div>
      );
    },
  },

  // this row renders description categories of transactions
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return <div className="capitalize">{row.original.description}</div>;
    },
  },

  // this row renders dates of categories of transactions
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date);

      const formattedDate = date.toLocaleDateString("default", {
        timeZone: "UTC",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });

      return <div className="text-muted-foreground">{formattedDate}</div>;
    },
  },

  // this row renders types of categories of transactions
  {
    accessorKey: "type",
    header: "Type",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            "capitalize rounded-lg text-center p-2",
            row.original.type === "income" &&
              "bg-emerald-400/10 text-emerald-500 font-semibold",
            row.original.type === "expense" &&
              "bg-red-400/10 text-red-500 font-semibold"
          )}
        >
          {row.original.type}
        </div>
      );
    },
  },

  // this row renders amount of each transaction
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return (
        <p className="text-sm md:text-md rounded-lg bg-gray-400/5 p-2 text-center font-medium">
          {row.original.formattedAmount}
        </p>
      );
    },
  },
];

const csvConfig = mkConfig({
  fieldSeparator: ".",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

// child component of Transactions page
const TransactionTable = ({ from, to }: Props) => {
  // applying sorting on the query results at the beginning its en empty array []
  const [sorting, setSorting] = useState<SortingState>([]);

  // managing state for column filers at the beginning they are empty []
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // fetching transaction history api using props parameters
  const history = useQuery<getTransactionHistoryResponseType>({
    queryKey: ["transactions", "history", from, to],
    queryFn: () =>
      fetch(
        `/api/transactions-history?from=${DateToUTCDate(
          from
        )}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  // Function to handle exporting data to CSV
  const handleExportCsv = (data: any[]) => {
    const csv = generateCsv(csvConfig)(data); // Generating CSV from data
    download(csvConfig)(csv); // Downloading the generated CSV
  };

  // React Table setup with data, columns, sorting, filtering, and pagination
  const table = useReactTable({
    data: history.data || emptyData, // Using fetched data or empty data if unavailable
    columns,
    getCoreRowModel: getCoreRowModel(), // Getting core rows for table rendering
    initialState: {
      pagination: {
        pageSize: 8, // Limiting table to show 8 rows per page
      },
    },
    state: {
      sorting, // Passing sorting state to table
      columnFilters, // Passing column filters to table
    },
    onSortingChange: setSorting, // Setting sorting state on user interaction
    onColumnFiltersChange: setColumnFilters, // Setting filters on user interaction
    getSortedRowModel: getSortedRowModel(), // Sorting rows based on selected column
    getFilteredRowModel: getFilteredRowModel(), // Filtering rows based on filter criteria
    getPaginationRowModel: getPaginationRowModel(), // Pagination setup for table
  });

  // Memoized function to generate unique category options for filtering
  const categoryOptions = useMemo(() => {
    const categoriesMap = new Map(); // Using Map to avoid duplicates
    history.data?.forEach((transaction) => {
      categoriesMap.set(transaction.category, {
        value: transaction.category,
        label: `${transaction.categoryIcon} ${transaction.category}`, // Creating label with icon and category name
      });
    });

    const uniqueCategories = new Set(categoriesMap.values()); // Converting map values to a set for uniqueness
    return Array.from(uniqueCategories); // Returning array of unique categories
  }, [history.data]); // Runs when history.data changes

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 py-4">
        {/* after mapping over categories with categoryOptions and useMemo passing it to DataTableFacetedFilter tp apply filter on transactions based on categories */}
        <div className="flex gap-2">
          {table.getColumn("category") && (
            <DataTableFacetedFilter
              title="Category"
              column={table.getColumn("category")}
              options={categoryOptions}
            />
          )}

          {/* now applying filter on transactions based on type */}
          {table.getColumn("type") && (
            <DataTableFacetedFilter
              title="Type"
              column={table.getColumn("type")}
              options={[
                {
                  label: "Income",
                  value: "income",
                },
                {
                  label: "Expense",
                  value: "expense",
                },
              ]}
            />
          )}
        </div>

        {/* with DataTableViewOptions can remove or restore particular column in the table */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={"outline"}
            size={"sm"}
            className="ml-auto h-8 lg:flex"
            onClick={() => {
              const data = table.getFilteredRowModel().rows.map((row) => ({
                category: row.original.category,
                categoryIcon: row.original.categoryIcon,
                description: row.original.description,
                type: row.original.type,
                amount: row.original.amount,
                formattedAmount: row.original.formattedAmount,
                date: row.original.date,
              }));
              handleExportCsv(data);
            }}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <SkeletonWrapper isLoading={history.isFetching}>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* div that implements pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </SkeletonWrapper>
    </div>
  );
};

export default TransactionTable;
