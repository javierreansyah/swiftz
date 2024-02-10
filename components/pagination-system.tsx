import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProp {
  currentPage: number;
  totalPage: number;
  url: string;
}

const PaginationSystem: React.FC<PaginationProp> = ({
  currentPage,
  totalPage,
  url,
}) => {
  const getPageUrl = (pageNumber: number): string => {
    return `${url}/${pageNumber}`;
  };
  return (
    <>
      <div className="hidden sm:block">
        <Pagination>
          <PaginationContent>
            {currentPage !== 1 && (
              <PaginationItem>
                <PaginationPrevious href={getPageUrl(currentPage - 1)} />
              </PaginationItem>
            )}

            {Array.from({ length: Math.min(500, totalPage) }, (_, index) => {
              const pageNumber = index + 1;
              const isInRange = Math.abs(pageNumber - currentPage) <= 2;

              if (
                pageNumber === 1 ||
                pageNumber === Math.min(500, totalPage) ||
                isInRange
              ) {
                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href={getPageUrl(pageNumber)}
                      isActive={pageNumber === currentPage}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                pageNumber === 2 ||
                pageNumber === Math.min(500, totalPage) - 1
              ) {
                return (
                  <PaginationItem key={index}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              } else {
                return null;
              }
            })}

            {currentPage !== Math.min(500, totalPage) && (
              <PaginationItem>
                <PaginationNext href={getPageUrl(currentPage + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
      <div className="block sm:hidden">
        <Pagination>
          <PaginationContent>
            {Array.from({ length: Math.min(500, totalPage) }, (_, index) => {
              const pageNumber = index + 1;
              const isInRange = Math.abs(pageNumber - currentPage) <= 1;

              if (
                pageNumber === 1 ||
                pageNumber === Math.min(500, totalPage) ||
                isInRange
              ) {
                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href={getPageUrl(pageNumber)}
                      isActive={pageNumber === currentPage}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                pageNumber === 2 ||
                pageNumber === Math.min(500, totalPage) - 1
              ) {
                return (
                  <PaginationItem key={index}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              } else {
                return null;
              }
            })}
          </PaginationContent>
        </Pagination>
        <Pagination className="pt-2">
          <PaginationContent>
            {currentPage !== 1 && (
              <PaginationItem>
                <PaginationPrevious href={getPageUrl(currentPage - 1)} />
              </PaginationItem>
            )}
            {currentPage !== Math.min(500, totalPage) && (
              <PaginationItem>
                <PaginationNext href={getPageUrl(currentPage + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default PaginationSystem;
