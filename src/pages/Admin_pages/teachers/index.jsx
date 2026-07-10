import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";
import ShowModal from "./ShowModal";

import "./teachers.css";

const API_URL = "http://192.168.100.39:8000/api/web";

const Index = () => {

    /* =====================================
        STATES
    ===================================== */
    const [teachers, setTeachers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });
    const [modalType, setModalType] = useState(null); // 'create' | 'update' | 'show' | null
    const [activeTeacher, setActiveTeacher] = useState(null);

    /* =====================================
        TOAST STYLES
    ===================================== */
    const toastStyles = {
        success: {
            background: "#22c55e",
            color: "#fff",
            borderRadius: "10px",
            fontWeight: "600"
        },
        error: {
            background: "#ef4444",
            color: "#fff",
            borderRadius: "10px",
            fontWeight: "600"
        }
    };

    /* =====================================
        AUTH HEADER
    ===================================== */
    const getHeaders = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    /* =====================================
        FETCH TEACHERS
    ===================================== */
    const fetchTeachers = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}/teachers?page=${page}`,
                getHeaders()
            );
            if (response.data.success) {
                setTeachers(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.log(error);
            toast.error(
                "Unable to load teachers.",
                { style: toastStyles.error }
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================
        FETCH DEPENDENCIES
    ===================================== */
    const fetchDependencies = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/teachers/form-dependencies`,
                getHeaders()
            );
            if (response.data.success) {
                setDepartments(response.data.departments);
                setClasses(response.data.classes);
            }
        } catch (error) {
            console.log(error);
        }
    };

    /* =====================================
        LOAD PAGE
    ===================================== */
    useEffect(() => {
        fetchTeachers();
        fetchDependencies();
    }, []);

    /* =====================================
        DELETE TEACHER
    ===================================== */
    const handleDelete = (id, name) => {
        Swal.fire({
            title: "Delete Teacher?",
            text: `Delete ${name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#ef4444",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(
                        `${API_URL}/teachers/${id}`,
                        getHeaders()
                    );
                    if (response.data.success) {
                        toast.success(
                            "Teacher deleted successfully.",
                            { style: toastStyles.success }
                        );
                        fetchTeachers(pagination.current_page);
                    }
                } catch (error) {
                    toast.error(
                        "Delete failed.",
                        { style: toastStyles.error }
                    );
                }
            }
        });
    };

    /* =====================================
        CLIENT-SIDE SEARCH & FILTERS
    ===================================== */
    const filteredTeachers = useMemo(() => {
        return teachers.filter((teacher) => {
            const fullname = `${teacher.first_name_english} ${teacher.last_name_english}`.toLowerCase();
            const matchSearch =
                fullname.includes(searchQuery.toLowerCase()) ||
                teacher.teacher_code?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchDepartment =
                departmentFilter === "" ||
                teacher.department_id == departmentFilter;

            const matchStatus =
                statusFilter === "" ||
                teacher.status === statusFilter;

            return matchSearch && matchDepartment && matchStatus;
        });
    }, [teachers, searchQuery, departmentFilter, statusFilter]);

    /* =====================================
        DASHBOARD AGGREGATIONS
    ===================================== */
    const totalTeachers = teachers.length;
    const activeTeachers = teachers.filter(t => t.status === "Active").length;
    const suspendedTeachers = teachers.filter(t => t.status === "Suspended").length;
    const totalDepartments = departments.length;

    /* =====================================
        RENDER COMPONENT
    ===================================== */
    return (
        <div className="students-page-wrapper">
            <Toaster position="top-right" />

            {/* ===========================
                DASHBOARD CARDS
            ============================ */}
            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <div>
                        <h5>Total Teachers</h5>
                        <h2>{totalTeachers}</h2>
                    </div>
                    <span>👨‍🏫</span>
                </div>
                <div className="dashboard-card active">
                    <div>
                        <h5>Active</h5>
                        <h2>{activeTeachers}</h2>
                    </div>
                    <span>✅</span>
                </div>
                <div className="dashboard-card warning">
                    <div>
                        <h5>Suspended</h5>
                        <h2>{suspendedTeachers}</h2>
                    </div>
                    <span>⛔</span>
                </div>
                <div className="dashboard-card info">
                    <div>
                        <h5>Departments</h5>
                        <h2>{totalDepartments}</h2>
                    </div>
                    <span>🏫</span>
                </div>
            </div>

            {/* ===========================
                HEADER PANEL
            ============================ */}
            <div className="registry-header-panel">
                <div>
                    <h2>Teacher Management</h2>
                    <p>Manage teacher information.</p>
                </div>
                <button
                    className="add-student-master-btn"
                    onClick={() => {
                        setActiveTeacher(null);
                        setModalType("create");
                    }}
                >
                    ➕ Add Teacher
                </button>
            </div>

            {/* ===========================
                FILTERS PANEL
            ============================ */}
            <div className="search-filter-card">
                <input
                    className="registry-search-input"
                    placeholder="Search teacher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                    <option value="">All Departments</option>
                    {departments.map((dep) => (
                        <option key={dep.id} value={dep.id}>
                            {dep.department_name_english}
                        </option>
                    ))}
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                </select>

                <button
                    className="refresh-btn"
                    onClick={() => fetchTeachers(pagination.current_page)}
                >
                    🔄 Refresh
                </button>
            </div>

            {/* ===========================
                DATA TABLE
            ============================ */}
            <div className="table-responsive">
                {loading ? (
                    <div className="loading-box">Loading Teachers...</div>
                ) : (
                    <table className="student-data-table">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTeachers.length > 0 ? (
                                filteredTeachers.map((teacher) => (
                                    <tr key={teacher.id}>
                                        <td>
                                            <img
                                                src={teacher.photo_url || "https://via.placeholder.com/150"}
                                                className="teacher-avatar"
                                                alt="teacher"
                                            />
                                        </td>
                                        <td>{teacher.teacher_code}</td>
                                        <td>
                                            <span
                                                className="clickable-name"
                                                onClick={() => {
                                                    setActiveTeacher(teacher);
                                                    setModalType("show");
                                                }}
                                            >
                                                {teacher.first_name_english} {teacher.last_name_english}
                                            </span>
                                        </td>
                                        <td>
                                            {teacher.department?.department_name_english || "N/A"}
                                        </td>
                                        <td>{teacher.phone || "N/A"}</td>
                                        <td>{teacher.email || "N/A"}</td>
                                        <td>
                                            <span className={`status-badge ${teacher.status.toLowerCase()}`}>
                                                {teacher.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-row-buttons">
                                                <button
                                                    className="row-edit-action-btn"
                                                    onClick={() => {
                                                        setActiveTeacher(teacher);
                                                        setModalType("update");
                                                    }}
                                                >
                                                    ✏ Edit
                                                </button>
                                                <button
                                                    className="row-delete-action-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            teacher.id,
                                                            `${teacher.first_name_english} ${teacher.last_name_english}`
                                                        )
                                                    }
                                                >
                                                    🗑 Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="table-empty-fallback">
                                        No teacher found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ===========================
                PAGINATION FOOTER BAR
            ============================ */}
            <div className="pagination-footer-bar">
                <button
                    disabled={pagination.current_page === 1 || loading}
                    onClick={() => fetchTeachers(pagination.current_page - 1)}
                >
                    Previous
                </button>
                <span>
                    Page {pagination.current_page} / {pagination.total_pages}
                </span>
                <button
                    disabled={pagination.current_page === pagination.total_pages || loading}
                    onClick={() => fetchTeachers(pagination.current_page + 1)}
                >
                    Next
                </button>
            </div>

            {/* ===========================
                CONDITIONAL MODAL RENDERING
            ============================ */}
            {modalType === "create" && (
                <CreateModal 
                    isOpen={true} 
                    onClose={() => setModalType(null)} 
                    onSuccess={() => { setModalType(null); fetchTeachers(); }}
                    departments={departments}
                    classes={classes}
                />
            )}

            {modalType === "update" && activeTeacher && (
                <UpdateModal 
                    isOpen={true} 
                    teacher={activeTeacher}
                    onClose={() => { setModalType(null); setActiveTeacher(null); }} 
                    onSuccess={() => { setModalType(null); setActiveTeacher(null); fetchTeachers(pagination.current_page); }}
                    departments={departments}
                    classes={classes}
                />
            )}

            {modalType === "show" && activeTeacher && (
                <ShowModal 
                    isOpen={true} 
                    teacher={activeTeacher}
                    onClose={() => { setModalType(null); setActiveTeacher(null); }} 
                />
            )}
        </div>
    );
};

export default Index;