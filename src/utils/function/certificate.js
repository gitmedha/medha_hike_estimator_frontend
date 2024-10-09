import api from "../../apis";

export const generateCertificate = async (programEnrollmentId) => {
  const url = `${process.env.REACT_APP_STRAPI_API_BASEURL}/program-enrollments/${programEnrollmentId}/generateCertificate`;
  return await api.post(url);
}

export const deleteCertificate = async (programEnrollmentId) => {
  const url = `${process.env.REACT_APP_STRAPI_API_BASEURL}/program-enrollments/${programEnrollmentId}/deleteCertificate`;
  return await api.post(url);
}
