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
    <div className="flex flex-col gap-4">
      <table className="w-full border-collapse bg-opacity-50 rounded-2xl overflow-hidden">
        <thead className="bg-secondary/20">
          <tr className="text-left uppercase text-sm tracking-wider">
            <th className="px-4 py-3 text-primary font-JetBrainsMono">WPM</th>
            <th className="hidden md:table-cell px-4 py-3 text-primary font-JetBrainsMono">Correct Chars</th>
            <th className="hidden md:table-cell px-4 py-3 text-primary font-JetBrainsMono">Incorrect Chars</th>
            <th className="hidden md:table-cell px-4 py-3 text-primary font-JetBrainsMono">Date</th>
            <th className="px-4 py-3 text-primary font-JetBrainsMono">Time</th>
            <th className="px-4 py-3 text-primary font-JetBrainsMono">Word</th>
            <th className="hidden md:table-cell px-4 py-3 text-primary font-JetBrainsMono">Language</th>
          </tr>
        </thead>
        <motion.tbody
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="divide-y divide-secondary/10"
        >
          {displayedItems.map(renderItem)}
        </motion.tbody>
      </table>

      <p 
        data-tooltip="Number of records" 
        className="px-6 py-2.5 tooltip w-fit mx-auto font-JetBrainsMono text-sm bg-secondary/10 rounded-xl hover:bg-secondary/20 transition-all duration-200 ease-in-out shadow-sm"
      >
        {"#" + items.length}
      </p>

      <div className="flex justify-center mt-2">
        <Pagination
          total={pageCount}
          current={currentPage}
          onPageChange={handlePageChange}
          previousLabel="Previous"
          nextLabel="Next"
          className="flex gap-2 items-center"
          activeItemClassName="font-bold bg-secondary/30 rounded-lg shadow-sm"
          disabledItemClassName="opacity-40 cursor-not-allowed"
          pageLinkClassName="px-4 py-2.5 hover:bg-secondary/15 font-JetBrainsMono rounded-lg transition-all duration-200 ease-in-out hover:shadow-sm"
        />
      </div>
    </div>
  );
};

export default PaginatedItems;
