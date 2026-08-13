import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Customer } from "@/lib/types";

export function CustomersTable({ customers }: { customers: Customer[] }) {
  if (customers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No customers have registered yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.uid}>
              <TableCell className="text-sm font-medium text-foreground">{customer.name || "—"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{customer.email}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{customer.phone || "—"}</TableCell>
              <TableCell className="text-sm">{customer.orderCount}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(customer.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant={customer.role === "admin" ? "secondary" : "outline"}>
                  {customer.role}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
