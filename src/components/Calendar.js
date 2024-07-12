import React from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card } from 'antd';
import './Calendar.css';

const locales = {
  tr: {
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { tr },
    messages: {
      allDay: 'Tüm Gün',
      previous: '<',
      next: '>',
      today: 'Bugün',
      month: 'Ay',
      week: 'Hafta',
      day: 'Gün',
      agenda: 'Ajanda',
      date: 'Tarih',
      time: 'Zaman',
      event: 'Etkinlik',
      showMore: total => `+${total} daha`,
    }
  }
};

const localizer = dateFnsLocalizer(locales.tr);

const EventComponent = ({ event }) => (
  <div style={{ color: event.style.color }}>
    {event.title}
  </div>
);

const CalendarComponent = () => {
  const location = useLocation();
  const { events } = location.state || {};

  const coloredEvents = events ? events.map(event => ({
    ...event,
    style: {
      backgroundColor: event.title.startsWith('Gelir') ? '#36A2EB' : '#FF6384',
      borderColor: event.title.startsWith('Gelir') ? '#36A2EB' : '#FF6384',
      color: '#fff',
    }
  })) : [];

  return (
    <Card title="Takvim" className="calendar-card">
      <BigCalendar
        localizer={localizer}
        events={coloredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        components={{
          event: EventComponent,
          dateCellWrapper: ({ children, value }) => {
            const dayEvents = coloredEvents.filter(event =>
              new Date(event.start).toDateString() === new Date(value).toDateString()
            );

            return (
              <div>
                {children}
                <div className="day-events">
                  {dayEvents.map((event, index) => (
                    <div key={index} className="day-event" style={{ color: event.style.color }}>
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        }}
      />
    </Card>
  );
};

export default CalendarComponent;
