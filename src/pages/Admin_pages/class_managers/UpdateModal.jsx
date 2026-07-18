import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateModal = ({ data, onClose, onSuccess }) => {
  const API = "http://192.168.100.39:8000/api/web/class-managers";

  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    class_id: "",
    assigned_date: "",
    status: "",
  });

  const headers = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // ==============================
  // LOAD CLASS
  // ==============================

  useEffect(() => {
    if (data) {
      setForm({
        class_id: data.class_id,

        assigned_date: data.assigned_date,

        status: data.status,
      });
    }

    fetchClasses();
  }, [data]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        "http://192.168.100.39:8000/api/web/students/form-dependencies",

        headers,
      );

      if (response.data.success) {
        setClasses(response.data.classes);
      }
    } catch (error) {
      toast.error("Cannot load classes");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // UPDATE
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.put(
        `${API}/update/${data.id}`,

        form,

        headers,
      );

      if (response.data.success) {
        toast.success("Class updated successfully");

        onSuccess();

        onClose();
      }
    } catch (error) {
      console.log(error.response);

      if (error.response?.status === 422) {
        Object.values(error.response.data.errors)
          .flat()
          .forEach((msg) => {
            toast.error(msg);
          });
      } else {
        toast.error(error.response?.data?.message || "Update failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>✏️ Update Class Assignment</h2>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student</label>

            <input
              value={
                data?.student?.student_code +
                " - " +
                data?.student?.first_name_english + data?.student?.last_name_english
              }
              disabled
            />
          </div>

          <div className="form-group">
            <label>Change Class</label>

            <select
              name="class_id"
              value={form.class_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Class</option>

              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.class_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Assigned Date</label>

            <input
              type="date"
              name="assigned_date"
              value={form.assigned_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status</label>

            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>

              <option value="Completed">Completed</option>

              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button className="save-btn" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
