import React from "react";

const Table = ({
  users,
  selectedRows,
  editingRowId,
  editedRowData,
  currentPage,
  usersPerPage,
  filteredUsers,
  handleEditInputChange,
  handleSaveEdit,
  handleSelectRow,
  handleDeleteRow,
  handleEditRow,
  ...props
}) => {
  if (!users || users.length === 0) {
    return <div>No data available</div>;
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <table className="table">
      <thead>
        <tr>
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
            {Object.entries(user).map(([key, value]) => (
              <td key={key}>
                {console.log("Rendering - key:", key, "value:", value)}
                {editingRowId === user.id ? (
                  <input
                    type="text"
                    value={
                      editedRowData[key] !== undefined
                        ? editedRowData[key]
                        : value
                    }
                    onChange={(e) => handleEditInputChange(key, e.target.value)}
                  />
                ) : (
                  value
                )}
              </td>
            ))}

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

export default Table;
