import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import 'moment/locale/fa'; // Import Persian locale
import momentJalaali from 'moment-jalaali';

// Set up Jalali
momentJalaali.loadPersian({ usePersianDigits: true });

const DateTimeContainer = styled.div`
  background-color: rgba(75, 90, 75, 0.38); // Dark green background
  color: white;
  font-family: "IRANSans", sans-serif;
  font-size: 0.8rem;
  padding: 10px;
  text-align: center;
  border-radius: 4px;
  max-height: 40px;
  width: fit-content;
`;

const rtlFormat = (moment) => {
    const split = moment.trim().split(' ');
    return split[1] + " - " + split[0];
};

function PersianDateTime() {
    const [currentTime, setCurrentTime] = useState(rtlFormat(momentJalaali().format('jYYYY/jMM/jDD HH:mm')));

    useEffect(() => {
        const interval = setInterval(() => {
            const moment = momentJalaali().format('jYYYY/jMM/jDD HH:mm');
            setCurrentTime(rtlFormat(moment));
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    return <DateTimeContainer>{currentTime}</DateTimeContainer>;
}

export default PersianDateTime;
