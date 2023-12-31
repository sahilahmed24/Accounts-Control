import React, { useState, useEffect } from "react";
import "./App.css";
import Table from "./components/Table";
import Pagination from "./components/Pagination";

const API_ENDPOINT =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

const App = () => {
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});
  const [users, setUsers] = useState([]);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const pageNumbers = [];

  useEffect(() => {
    // Fetch data from the API
    fetch(API_ENDPOINT)
      .then((response) => response.json())
      .then((data) => {
        console.log("API Data:", data);
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    // Update displayedUsers whenever users or filteredUsers change
    const filteredData = filteredUsers.length > 0 ? filteredUsers : users;
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    setDisplayedUsers(filteredData.slice(startIndex, endIndex));
  }, [users, filteredUsers, currentPage, usersPerPage]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const filtered = users.filter((user) =>
      Object.values(user).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(filtered);
    setDisplayedUsers(filtered);
    setCurrentPage(1);
  };

  const handleSelectAllOnPage = () => {
    const allIdsOnPage = filteredUsers
      .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
      .map((user) => user.id);
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.length === allIdsOnPage.length ? [] : allIdsOnPage
    );
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSelectRow = (id) => {
    const isSelected = selectedRows.includes(id);
    setSelectedRows((prevSelectedRows) =>
      isSelected
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedRows([]);
  };

  const handleEditRow = (id) => {
    setEditingRowId(id);
    setEditedRowData({});
  };

  const handleEditInputChange = (key, value) => {
    console.log("Editing - key:", key, "value:", value);
    setEditedRowData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleSaveEdit = (id) => {
    // Update the data in memory
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, ...editedRowData } : user
    );

    console.log("Updated Users:", updatedUsers);

    setUsers(updatedUsers);
    setDisplayedUsers(updatedUsers);
    setFilteredUsers(updatedUsers);

    // Stop editing mode
    setEditingRowId(null);
    setEditedRowData({});
  };

  const handleDeleteRow = (id) => {
    // Delete the row in memory
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
  };

  const renderTable = () => {
    if (!filteredUsers || filteredUsers.length === 0) {
      return <div>No data available</div>;
    }

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return (
      <table className="table">
        <thead>
          <tr>
            <th>Select</th>
            {Object.keys(currentUsers[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr
              key={user.id}
              className={selectedRows.includes(user.id) ? "selected" : ""}
            >
              {/* Checkbox for row selection */}
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(user.id)}
                  onChange={() => handleSelectRow(user.id)}
                />
              </td>

              {/* Use the updated editedRowData object to access updated values */}
              {Object.entries(user).map(([key, value]) => (
                <td key={key}>
                  {editingRowId === user.id ? (
                    <input
                      type="text"
                      value={
                        editedRowData[key] !== undefined
                          ? editedRowData[key]
                          : value
                      }
                      onChange={(e) =>
                        handleEditInputChange(key, e.target.value)
                      }
                    />
                  ) : (
                    value
                  )}
                </td>
              ))}

              {/* Action buttons */}
              <td>
                {editingRowId === user.id ? (
                  <button
                    className="action-button"
                    onClick={() => handleSaveEdit(user.id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="action-button"
                    onClick={() => handleEditRow(user.id)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="action-button"
                  onClick={() => handleSelectRow(user.id)}
                >
                  {selectedRows.includes(user.id) ? "Deselect" : "Select"}
                </button>
                <button
                  className="action-button"
                  onClick={() => handleDeleteRow(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
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

  return (
    <div className="app">
      <div className="search-bar">
        <label>
          <input
            type="checkbox"
            checked={
              selectedRows.length === filteredUsers.length &&
              filteredUsers.length > 0
            }
            onChange={handleSelectAllOnPage}
          />
          Select All
        </label>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          className="search-field"
        />
        <button className="search-button" onClick={() => handleSearch()}>
          Search
        </button>
      </div>
      <div className="delete-bar">
        {selectedRows.length > 0 && (
          <button
            className="delete-button"
            onClick={() => handleDeleteSelected()}
          >
            Delete Selected
          </button>
        )}
      </div>
      {/* <Table
        users={displayedUsers}
        selectedRows={selectedRows}
        editingRowId={editingRowId}
        editedRowData={editedRowData}
        currentPage={currentPage}
        usersPerPage={usersPerPage}
        filteredUsers={filteredUsers}
        handleSaveEdit={handleSaveEdit}
        handleEditRow={handleEditRow}
        handleSelectRow={handleSelectRow}
        handleDeleteRow={handleDeleteRow}
        handleEditInputChange={handleEditInputChange}
      />
      <Pagination
        pageNumbers={pageNumbers}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        filteredUsers={filteredUsers}
        usersPerPage={usersPerPage}
      /> */}
      {renderTable()}
      {renderPagination()}
    </div>
  );
};

export default App;
