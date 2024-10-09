import api from "../../../apis";
import { GET_PICKLIST } from "../../../graphql";

export const getAlumniServicePickList = async () => {
  return await api
    .post("/graphql", {
      query: GET_PICKLIST,
      variables: {
        table: "alumni_services",
      },
    })
    .then((data) => {
      let pickList = {};
      data?.data?.data?.picklistFieldConfigs.forEach((item) => {
        pickList[item.field] = item.values;
      });
      return pickList;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const createEvent = async (data) => {
  try {
    await api.post("/alumni-events/create-events", data);
  } catch (error) {
    console.error(error);
  }
};

export const getEvents = async function () {
  try {
    const { data } = await api.post("/alumni-events/get-events", {});
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const updateEvent = async (updatedData, id) => {
  try {
    await api.post(`/alumni-events/update-event/${id}`, updatedData);
  } catch (error) {
    console.error(error);
  }
};

export const deleteEvent = async (id) => {
  try {
    await api.post("/graphql", {
      query: `
  mutation DELETE_ALUMNI_EVENT($event: ID!) {
    deleteAlumniEvent(input: { where: { id: $event } }) {
      alumniEvent {
        id
      }
    }
  }
  `,
      variables: { event: id },
    });
  } catch (error) {
    console.error(error);
  }
};
