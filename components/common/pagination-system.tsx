"use client";

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

export interface PaginationProps {
  currentPage: number;
  totalPage: number;
  url?: string;
  onPageChange?: (page: number) => void;
}

export function PaginationSystem({
  currentPage,
  totalPage,
  url,
  onPageChange,
}: PaginationProps) {
  const getPageUrl = (pageNumber: number): string => {
    if (url) return `${url}/${pageNumber}`;
    return "#";
  };

  const handlePageClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    pageNumber: number
  ) => {
    if (onPageChange) {
      e.preventDefault();
      onPageChange(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const safeTotalPage = Math.max(1, Math.min(500, totalPage || 1));

  return (
    <>
      <div className="hidden sm:block">
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={getPageUrl(currentPage - 1)}
                  onClick={(e) => handlePageClick(e, currentPage - 1)}
                />
              </PaginationItem>
            )}

            {Array.from({ length: safeTotalPage }, (_, index) => {
              const pageNumber = index + 1;
              const isInRange = Math.abs(pageNumber - currentPage) <= 2;

              if (
                pageNumber === 1 ||
                pageNumber === safeTotalPage ||
                isInRange
              ) {
                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href={getPageUrl(pageNumber)}
                      isActive={pageNumber === currentPage}
                      onClick={(e) => handlePageClick(e, pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                pageNumber === 2 ||
                pageNumber === safeTotalPage - 1
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

            {currentPage < safeTotalPage && (
              <PaginationItem>
                <PaginationNext
                  href={getPageUrl(currentPage + 1)}
                  onClick={(e) => handlePageClick(e, currentPage + 1)}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
      <div className="block sm:hidden">
        <Pagination>
          <PaginationContent>
            {Array.from({ length: safeTotalPage }, (_, index) => {
              const pageNumber = index + 1;
              const isInRange = Math.abs(pageNumber - currentPage) <= 1;

              if (
                pageNumber === 1 ||
                pageNumber === safeTotalPage ||
                isInRange
              ) {
                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href={getPageUrl(pageNumber)}
                      isActive={pageNumber === currentPage}
                      onClick={(e) => handlePageClick(e, pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                pageNumber === 2 ||
                pageNumber === safeTotalPage - 1
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
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={getPageUrl(currentPage - 1)}
                  onClick={(e) => handlePageClick(e, currentPage - 1)}
                />
              </PaginationItem>
            )}
            {currentPage < safeTotalPage && (
              <PaginationItem>
                <PaginationNext
                  href={getPageUrl(currentPage + 1)}
                  onClick={(e) => handlePageClick(e, currentPage + 1)}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}

export default PaginationSystem;
