import React, { useState } from "react";
import Pagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import { motion } from "framer-motion";

interface PaginatedItemsProps<T> {
  items: T[];
  itemsPerPage: number;
  renderItem: (item: T, index: number) => JSX.Element;
}

const PaginatedItems = <T,>({
  items,
  itemsPerPage,
  renderItem,
}: PaginatedItemsProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const displayedItems = items
    .slice()
    .reverse()
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {displayedItems.map(renderItem)}
      </motion.div>
      <div className="flex flex-col gap-2 items-center justify-center w-full">
        <p
          data-tooltip="Number of records"
          className=" tooltip font-JetBrainsMono text-sm text-primary rounded-xl transition-all duration-200 ease-in-out"
        >
          {"#" + items.length}
        </p>

        <div className="">
          <Pagination
            total={pageCount}
            current={currentPage}
            onPageChange={handlePageChange}
            previousLabel="Previous"
            nextLabel="Next"
            className="flex gap-2 items-center justify-center text-primary"
            activeItemClassName="p-2 font-bold rounded-lg"
            disabledItemClassName="opacity-40 cursor-not-allowed"
            pageLinkClassName="p-2 font-JetBrainsMono rounded-lg transition-all duration-200 ease-in-out text-primary"
          />
        </div>
      </div>
    </>
  );
};

export default PaginatedItems;
