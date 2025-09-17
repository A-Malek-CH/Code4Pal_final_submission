import { columns } from "@/components/tables/c_markers" 
import { DataTable } from "@/components/tables/data-table"
import { dummyData } from "@/data/markers" 

export default async function page() {
  const data = dummyData;

  return (
    <section className="container mx-auto p-4">
      <DataTable columns={columns} data={data} />
    </section>
  );
}