import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import AddMemberModal from "./AddMemberModal";

const GroupDetailModal = ({ assignment, onClose }) => {
  const API_URL = "http://192.168.100.39:8000/api/web/assignment-groups";

  const [groups, setGroups] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showAddMember, setShowAddMember] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState(null);

  // ==========================
  // HEADER
  // ==========================

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // ==========================
  // LOAD GROUPS
  // ==========================

  useEffect(() => {
    if (assignment) {
      loadGroups();
    }
  }, [assignment]);

  const loadGroups = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        API_URL,

        getHeaders(),
      );

      if (response.data.success) {
        setGroups(response.data.data);
      }
    } catch (error) {
      console.log(error.response);

      toast.error("Cannot load groups");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="assignment-modal">
        {/* HEADER */}

        <div className="modal-header">
          <h3>👥 Assignment Groups</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* BODY */}

        <div className="show-content">
          {loading ? (
            <p>Loading groups...</p>
          ) : groups.length === 0 ? (
            <p>No group created.</p>
          ) : (
            groups.map((group) => (
              <div key={group.id} className="group-card">
                <h4>👥 {group.group_name}</h4>
                <button
                  className="group-btn"
                  onClick={() => {
                    setSelectedGroup(group);

                    setShowAddMember(true);
                  }}
                >
                  ➕ Add Member
                </button>
                <div className="show-row">
                  <strong>👑 Leader:</strong>

                  <span>
                    {group.leader?.first_name_english}{" "}
                    {group.leader?.last_name_english}
                  </span>
                </div>

                <div className="show-row">
                  <strong>Members:</strong>

                  <span>{group.members?.length} Student(s)</span>
                </div>

                <div className="member-list">
                  {group.members?.map((member) => (
                    <div key={member.id} className="member-item">
                      {member.role === "leader" ? "👑" : "👤"}{" "}
                      {member.student?.first_name_english}{" "}
                      {member.student?.last_name_english}
                      <span>({member.role})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      {showAddMember && (
        <AddMemberModal
          group={selectedGroup}
          onClose={() => {
            setShowAddMember(false);
          }}
          onSuccess={() => {
            setShowAddMember(false);

            loadGroups();
          }}
        />
      )}
    </div>
  );
};

export default GroupDetailModal;
