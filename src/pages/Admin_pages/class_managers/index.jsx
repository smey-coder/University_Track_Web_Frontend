import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";
import ShowModal from "./ShowModal";

import "./classManager.css";

const Index = () => {
  const API = "http://192.168.100.39:8000/api/web/class-managers";

  const [classManagers, setClassManagers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);

  const [showUpdate, setShowUpdate] = useState(false);

  const [showDetail, setShowDetail] = useState(false);

  const [selected, setSelected] = useState(null);

  const headers = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // ==============================
  // LOAD DATA
  // ==============================

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API, headers);

      if (response.data.success) {
        setClassManagers(response.data.data.data || response.data.data);
      }
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Cannot load class managers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==============================
  // DELETE
  // ==============================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;

    try {
      await axios.delete(
        `${API}/${id}`,

        headers,
      );

      toast.success("Deleted successfully");

      fetchData();
    } catch (error) {
      console.log(error.response?.data);

      toast.error("Delete failed");
    }
  };

  return (
    <div className="class-manager-container">
      <Toaster position="top-right" />

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>🎓 Class Manager</h1>

          <p>Manage student class assignments</p>
        </div>

        <button className="primary-btn" onClick={() => setShowCreate(true)}>
          + Assign Student
        </button>
      </div>

      {/* TABLE */}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>#</th>

              <th>Student</th>

              <th>Class</th>

              <th>Department</th>

              <th>Semester</th>

              <th>Academic Year</th>

              <th>Assigned Date</th>

              <th>Status</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9">Loading...</td>
              </tr>
            ) : classManagers.length === 0 ? (
              <tr>
                <td colSpan="9">No Data</td>
              </tr>
            ) : (
              classManagers.map((item, index) => (
                <tr key={item.id}>
                  {/* NUMBER */}

                  <td>{index + 1}</td>

                  {/* STUDENT */}

                  <td>
                    <strong>{item.student?.student_code}</strong>
                    <br />
                    {item.student?.first_name_english}{" "}
                    {item.student?.last_name_english}
                  </td>

                  {/* CLASS */}

                  <td>
                    <span className="class-badge">
                      {item.student_class?.class_name || "-"}
                    </span>
                  </td>

                  {/* DEPARTMENT */}

                  <td>
                    {item.student_class?.department?.department_name_english || "-"} 
                  </td>

                  {/* SEMESTER */}

                 <td>
                    {
                    item.student_class?.class_semesters?.length > 0 ? (
                        item.student_class.class_semesters.map((semesterItem)=>(
                            <span
                              key={semesterItem.id}
                              className="semester-badge"
                            >
                              {semesterItem.semester?.semester_name}
                              <br/>
                            </span>
                        ))
                    )
                    :
                    "N/A"
                    }
                  </td>

                  {/* ACADEMIC YEAR */}

                  <td>

                  {
                  item.student_class?.class_semesters?.length > 0 ?

                  item.student_class.class_semesters.map((semesterItem)=>(
                      <span key={semesterItem.id}>
                        {semesterItem.academic_year?.academic_year}
                        <br/>
                      </span>
                  ))

                  :

                  item.student_class?.academic_year?.academic_year || "N/A"

                  }

                  </td>

                  {/* DATE */}

                  <td>{item.assigned_date}</td>

                  {/* STATUS */}

                  <td>
                    <span className="status-active">{item.status}</span>
                  </td>

                  {/* ACTION */}

                  <td>
                    <button
                      className="view-btn"
                      onClick={() => {
                        setSelected(item);

                        setShowDetail(true);
                      }}
                    >
                      View
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => {
                        setSelected(item);

                        setShowUpdate(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE */}

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onSuccess={fetchData}
        />
      )}

      {/* UPDATE */}

      {showUpdate && (
        <UpdateModal
          data={selected}
          onClose={() => setShowUpdate(false)}
          onSuccess={fetchData}
        />
      )}

      {/* DETAIL */}

      {showDetail && (
        <ShowModal data={selected} onClose={() => setShowDetail(false)} />
      )}
    </div>
  );
};

export default Index;
