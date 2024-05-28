// File: react-app/src/WorkDayQuery.js

import { gql } from '@apollo/client';

export const GET_WORK_DAYS = gql`
    query WorkDayQuery($start: Int!, $lunchStart: Int!, $lunchDuration: Int!) {
        workDay(start: $start, lunchStart: $lunchStart, lunchDuration: $lunchDuration) {
            periods {
                start
                end
                duration
                durationInHours
            }
            totalHours
            totalHoursInHHMM
            expectedLunchTimeInHHMM
        }
    }
`;