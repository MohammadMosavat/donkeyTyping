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
      {/** Ensure it only returns valid <table> structure */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-white uppercase text-sm tracking-wider">
            <th className="px-6 py-4 text-primary bg-thrid font-JetBrainsMono">WPM</th>
            <th className="px-6 py-4 text-primary bg-thrid font-JetBrainsMono">Correct Chars</th>
            <th className="px-6 py-4 text-primary bg-thrid font-JetBrainsMono">Incorrect Chars</th>
            <th className="px-6 py-4 text-primary bg-thrid font-JetBrainsMono">Date</th>
            <th className="px-6 py-4 text-primary bg-thrid font-JetBrainsMono">Time</th>
            <th className="px-6 py-4 text-primary bg-thrid font-JetBrainsMono">Word</th>
            <th className="px-6 py-4 text-primary bg-thrid font-JetBrainsMono">Language</th>
          </tr>
        </thead>
        <motion.tbody
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {displayedItems.map(renderItem)}
        </motion.tbody>
      </table>
      <p title="Number of records" className="px-6 py-4 font-JetBrainsMono">{"#" + items.length}</p>

      {/** Pagination should be OUTSIDE the table */}
      <div className="flex h-12 justify-center">
        <Pagination
          total={pageCount}
          current={currentPage}
          onPageChange={handlePageChange}
          previousLabel="Previous"
          nextLabel="Next"
          className="flex justify-center gap-3 items-center"
          activeItemClassName="font-bold underline underline-offset-2"
          disabledItemClassName="opacity-50"
          pageLinkClassName="px-4 py-2  hover:font-bold font-JetBrainsMono rounded-md transition-colors"
        />
      </div>
    </>
  );
};

export default PaginatedItems;
