import { columns } from "@/components/tables/c_verified" 
import { DataTable } from "@/components/tables/data-table"
import { dummyData } from "@/data/verified" 

export default async function page() {
  const data = dummyData;

  return (
    <div className="container mx-auto p-4">
      <DataTable columns={columns} data={data} />
    </div>
  );
}