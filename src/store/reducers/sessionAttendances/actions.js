import {
  IS_LOADING,
  DELETE_SESSION,
  GET_SESSION_DETAILS,
  GET_SESSION_ATTENDANCES,
} from "./types";

import {
  GET_SESSION,
  DELETE_SESSION_Q,
  GET_SESSION_ATTENDANCE,
  DELETE_ATTENDANCE_RECORD,
  GET_BATCH_ENTROLLED_STUDENTS,
} from "../../../graphql";

import { queryBuilder } from "../../../apis";
import { setAlert } from "../Notifications/actions";

const gqlService = async (variables, query) => {
  try {
    let { data } = await queryBuilder({
      query,
      variables,
    });
    return data;
  } catch (err) {
   
  }
};

export const getSessions = (sessionID) => async (dispatch) => {
  dispatch(setLoading());
  try {
    let { session } = await gqlService({ id: Number(sessionID) }, GET_SESSION);

    let { programEnrollments } = await gqlService(
      { ...session.batch },
      GET_BATCH_ENTROLLED_STUDENTS
    );

    let { attendances } = await gqlService(
      { sessionID },
      GET_SESSION_ATTENDANCE
    );

    let fakeAttendanceRec = programEnrollments
      .map((student) => ({
        id: null,
        present: false,
        program_enrollment: {
          ...student,
        },
      }))
      .map((fAtt) => {
        let rec = attendances.find(
          (att) => fAtt.program_enrollment.id === att.program_enrollment.id
        );

        if (rec) {
          return rec;
        }
        return fAtt;
      });

    dispatch({
      type: GET_SESSION_DETAILS,
      payload: session,
    });

    dispatch({
      type: GET_SESSION_ATTENDANCES,
      payload: fakeAttendanceRec,
    });
  } catch (err) {
    
  } finally {
    dispatch(setLoading());
  }
};

export const deleteSession = (id) => async (dispatch, getState) => {
  
  try {
    dispatch(setLoading());
    let { attendances, session } = getState().sessionAttendance;
    // Delete attendance one by one
    await attendances.forEach(async (att) => {
      await queryBuilder({
        query: DELETE_ATTENDANCE_RECORD,
        variables: {
          attendanceID: att.id,
        },
      });
    });
    // Delete Session after deleting attendance records
    await queryBuilder({
      query: DELETE_SESSION_Q,
      variables: {
        sessionID: session.id,
      },
    });
    dispatch({
      type: DELETE_SESSION,
    });
    dispatch(setAlert("Session deleted successfully.", "success"));
  } catch (err) {
    dispatch(setAlert("Unable to delete the session.", "error"));
  
  } finally {
    dispatch(setLoading());
  }
};

export const setLoading = () => ({ type: IS_LOADING });
