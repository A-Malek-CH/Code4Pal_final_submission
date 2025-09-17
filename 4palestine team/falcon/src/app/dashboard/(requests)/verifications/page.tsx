import { columns } from "@/components/tables/c_verification" 
import { DataTable } from "@/components/tables/data-table"
import { dummyData } from "@/data/verification" 

export default async function page() {
  const data = dummyData;

  return (
    <section className="mx-auto full p-4">
      <DataTable columns={columns} data={data} />
    </section>
  );
}