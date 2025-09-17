"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

import { cn, formUrlQuery } from "@/lib/utils";
import {
  Pagination as ParentPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const onClick = (newPage: number) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: newPage.toString(),
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    // <div className="flex gap-2">
    //   <Button
    //     size="lg"
    //     variant="outline"
    //     className="w-28"
    //     onClick={() => onClick('prev')}
    //     disabled={Number(page) <= 1}
    //   >
    //     السابق
    //   </Button>
    //   <Button
    //     size="lg"
    //     variant="outline"
    //     className="w-28"
    //     onClick={() => onClick('next')}
    //     disabled={Number(page) >= totalPages}
    //   >
    //     التالي
    //   </Button>
    // </div>
    <div className="mt-6 flex justify-center w-full " dir="ltr">
      <ParentPagination>
        <PaginationContent>
          <PaginationItem
            aria-disabled={Number(page) <= 1}
            className={cn(
              Number(page) <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            )}
          >
            <PaginationPrevious onClick={() => onClick(Number(page) - 1)} />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page_index) => (
              <PaginationItem
                key={page_index}
                aria-disabled={!(Number(page) === page_index)}
                className={cn(
                  Number(page) === page_index
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                )}
              >
                <PaginationLink
                  type="button"
                  className={page === page_index ? "border-2 " : ""}
                  onClick={() => onClick(page_index)}
                >
                  {page_index}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem
            aria-disabled={!(Number(page) >= totalPages)}
            className={cn(
              Number(page) >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            )}
          >
            <PaginationNext onClick={() => onClick(Number(page) + 1)} />
          </PaginationItem>
        </PaginationContent>
      </ParentPagination>
    </div>
  );
};

export default Pagination;
