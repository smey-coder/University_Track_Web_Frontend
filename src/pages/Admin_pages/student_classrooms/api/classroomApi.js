import axios from "axios";

const API = "http://192.168.100.39:8000/api/web/student/classroom";

export const getStudentClassroom = async (params) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token);

  return axios.get(API, {
    params,

    headers: {
      Authorization: `Bearer ${token}`,

      Accept: "application/json",
    },
  });
};
