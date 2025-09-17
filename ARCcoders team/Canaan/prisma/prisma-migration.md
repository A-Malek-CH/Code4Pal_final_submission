You are 100% right. It _does_ suck.

You've hit on one of the most frustrating pain points when using a powerful ORM like Prisma with advanced, native database features. The magic of `prisma migrate dev` is that your `schema.prisma` file is the single source of truth, and everything "just works." Losing that feels like a huge step backward.

You are not wrong. The "database-first" (`db pull`) workflow is a fallback, not the ideal.

But here is the good news: **You can get that workflow back.**

There is a "hybrid" approach that lets you use Prisma Migrations while still managing the `vector` type. It's the method recommended by Prisma and the community for exactly this situation. It brings back all the benefits you love, with just one small manual step in the middle.

### The Hybrid Workflow: The Best of Both Worlds

This workflow lets you use `prisma migrate dev` and keep your `schema.prisma` as the source of truth.

**The core idea is:**

1.  Let Prisma generate the migration SQL file for you.
2.  Pause before it runs the SQL.
3.  Manually edit the generated SQL file to fix the `Unsupported` type.
4.  Tell Prisma to continue and apply your corrected SQL.

---

Here is the step-by-step process:

#### Step 1: Make Changes in `schema.prisma` as Usual

Let's say you want to add a new `notes` field to your `Document` model. You edit your `schema.prisma` just like you always would:

```prisma
model Document {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  sourceId  String   @map("source_id") @db.Uuid
  content   String?
  metadata  Json?
  embedding Unsupported("vector(1536)")?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  notes     String? // <-- Our new field

  source Source @relation(fields: [sourceId], references: [id], onDelete: Cascade)
  @@map("documents")
}
```

#### Step 2: Generate the Migration File (But Don't Run It Yet)

Instead of running `prisma migrate dev`, you add the `--create-only` flag. This is the magic step.

```bash
pnpm prisma migrate dev --name add-document-notes --create-only
```

Prisma will now do two things:

1.  It will create a new migration folder (e.g., `prisma/migrations/202311..._add_document_notes`).
2.  Inside that folder, it will create a `migration.sql` file.
3.  **It will NOT apply it to the database.**

#### Step 3: Manually Edit the `migration.sql` File

Now, you open that new `migration.sql` file. It will look something like this:

```sql
CREATE EXTENSION IF NOT EXISTS vector; -- <<< ADD THIS LINE AT THE TOP
```

```sql
-- migration.sql (What Prisma Generates)

-- AlterTable
ALTER TABLE "documents" ADD COLUMN "notes" TEXT;
```

This is your chance to add any SQL that Prisma doesn't understand. For example, if you were creating the `documents` table from scratch with this method, Prisma would generate this:

```sql
-- What Prisma would generate for the embedding column
ALTER TABLE "documents" ADD COLUMN "embedding" TEXT; -- This is wrong!
```

You simply edit the file and fix it:

```sql
-- What you change it to
ALTER TABLE "documents" ADD COLUMN "embedding" vector(1536); -- This is correct!
```

In our current example of adding a `notes` column, the SQL is already correct, so you don't even need to edit it. You just needed this step to verify.

#### Step 4: Apply the (Now Correct) Migration

Once you've reviewed and edited the `.sql` file, you run the normal migrate command again.

```bash
pnpm prisma migrate dev
```

Prisma will see the migration file that it hasn't run yet. Instead of generating new SQL, **it will simply execute the `migration.sql` file you just edited and approved.**

Because you fixed the SQL, it will run perfectly on your Supabase database, and your schema will be correctly updated.

### Summary of Benefits of this Hybrid Workflow

- ✅ **You keep `schema.prisma` as your source of truth.**
- ✅ **You get version-controlled, repeatable SQL migration files** in your project's repository.
- ✅ **You can track the entire history of your database changes.**
- ✅ **It fully supports `pgvector`** and any other native database feature Prisma doesn't know about yet.
- ✅ You get your favorite workflow back.

So while it's not the one-command magic you (rightfully) love for simple changes, this `--create-only` workflow is incredibly powerful and gives you back full control without sacrificing the benefits of Prisma Migrations.
