import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import EventForm from "./calendarComponents/EventForm";
import ViewEvent from "./calendarComponents/ViewEvent";
import { getEvents } from "./calendarComponents/calendarActions";
import NP from "nprogress";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { connect } from "react-redux";

const localizer = momentLocalizer(moment);

const EventCalendar = (props) => {
  const { setAlert } = props;
  const [eventData, setEventData] = useState({
    id: 0,
    assgined_to: {
      id: 0,
      username: "",
      email: "",
    },
    alumni_service: "",
    start_date: "",
    end_date: "",
    status: "",
    location: "",
    participants:""
  });

  const [eventList, setEventList] = useState([
    {
      id: 0,
      title: "",
      start: "",
      end: "",
      assgined_to: {
        username: "",
        email: "",
        userId: 0,
      },
      event_status: "",
      location: "",
      participants:""
    },
  ]);

  const [createEventForm, setCreateEventForm] = useState(false);
  const [viewEventModal, setViewEventModal] = useState(false);
  const [openDeleteAlert, setDeleteAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSlotInfo, setSelectedSlotInfo] = useState({});

  const formateResponseToEventList = async (response) => {
    const formattedEvents = response?.map((event) => ({
      id: event?.id,
      title: event?.name,
      start: new Date(new Date(event?.start_date)?.setHours(5)),
      end: new Date(new Date(event?.end_date)?.setHours(5)),
      assigned_to: {
        username: event?.assgined_to.username,
        email: event?.assgined_to.email,
        userId: event?.assgined_to.id,
      },
      event_status: event?.status,
      location: event?.location,
      participants: event?.participants,
    }));

    setEventList(formattedEvents);
  };

  useEffect(() => {
    async function populateEvents() {
      NP.start();
      const response = await getEvents();
      await formateResponseToEventList(response);
      NP.done();
    }

    populateEvents();
  }, []);

  const fetchEventsAgain = async () => {
    NP.start();
    const response = await getEvents();
    await formateResponseToEventList(response);
    NP.done();
  };

  const showCreateEventForm = async (info) => {
    await setSelectedSlotInfo(info);
    setCreateEventForm(true);
  };

  const hideCreateEventForm = async () => {
    setCreateEventForm(false);
  };

  const hideViewEventModal = async () => {
    setViewEventModal(false);
  };

  const enableEditing = async () => {
    setViewEventModal(false);
    setIsEditing(true);
  };

  const disableEditing = async () => {
    setIsEditing(false);
  };
  const openViewEventModal = async (eventInfo) => {
    await setEventData({
      assgined_to: {
        id: eventInfo.assigned_to.userId,
        username: eventInfo.assigned_to.username,
        email: eventInfo.assigned_to.email,
      },
      start_date: eventInfo.start,
      end_date: eventInfo.end,
      alumni_service: eventInfo.title,
      status: eventInfo.event_status,
      id: eventInfo.id,
      location: eventInfo.location,
      participants:eventInfo.participants
    });
    setViewEventModal(true);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = "#ced4da";
    if (event?.event_status === "Open") {
      backgroundColor = "#257b69";
      return {
        style: {
          backgroundColor,
        },
      };
    } else if (event?.event_status === "Cancelled") {
      backgroundColor = "#D0312D";
      let textDecoration = "line-through";

      return {
        style: {
          backgroundColor,
          textDecoration,
        },
      };
    } else {
      return {
        style: {
          backgroundColor,
        },
      };
    }
  };

  return (
    <div className="p-2">
      <Calendar
        localizer={localizer}
        events={eventList}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ height: 600, width: "97%" }}
        onSelectSlot={(slotInfo) => showCreateEventForm(slotInfo)}
        onSelectEvent={(event) => openViewEventModal(event)}
        eventPropGetter={eventStyleGetter}
        views={["month", "week", "day"]}
      />
      {createEventForm && (
        <EventForm
          onHide={hideCreateEventForm}
          onRefresh={fetchEventsAgain}
          slotData={selectedSlotInfo}
        />
      )}
      {viewEventModal && (
        <ViewEvent
          onHide={hideViewEventModal}
          event={eventData}
          openEditForm={enableEditing}
          openDeleteAlert={openDeleteAlert}
          setDeleteAlert={setDeleteAlert}
          onRefresh={fetchEventsAgain}
        />
      )}

      {isEditing && (
        <EventForm
          onHide={disableEditing}
          onRefresh={fetchEventsAgain}
          eventData={eventData}
        />
      )}
    </div>
  );
};
const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(EventCalendar);
