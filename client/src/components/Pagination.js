// components/Pagination.js
import React from "react";

const Pagination = ({
  pageNumbers,
  currentPage,
  handlePageChange,
  usersPerPage,
  filteredUsers,
}) => {
  for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
        First Page
      </button>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous Page
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => handlePageChange(number)}
          className={currentPage === number ? "active" : ""}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === pageNumbers.length}
      >
        Next Page
      </button>
      <button
        onClick={() => handlePageChange(pageNumbers.length)}
        disabled={currentPage === pageNumbers.length}
      >
        Last Page
      </button>
    </div>
  );
};

export default Pagination;
