import React, {useState, useEffect} from 'react';
import {ApolloProvider, useLazyQuery} from '@apollo/client';
import {client} from './HoursClient';
import {GET_WORK_DAYS} from "./WorkDayQuery";
import {FaCoffee, FaRedhat} from 'react-icons/fa';
import './App.css';

function App() {
    const [start, setStart] = useState(9);
    const [lunchStart, setLunchStart] = useState(12);
    const [lunchDuration, setLunchDuration] = useState(30);
    const [getWorkDays, {loading, error, data}] = useLazyQuery(GET_WORK_DAYS, {fetchPolicy: "network-only"});

    const handleSubmit = (event) => {
        event.preventDefault();
        getWorkDays({
            variables: {
                start: parseInt(start),
                lunchStart: parseInt(lunchStart),
                lunchDuration: parseInt(lunchDuration)
            },
        });
    };

    const handleKeyDown = (event) => {
        // Prevent form submission when Enter is pressed in a specific input field
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };



    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.altKey && event.key === 't') {
                handleSubmit(new Event('submit'));
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Clean up function
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [start, lunchStart, lunchDuration]);

    const workDay = data?.workDay;

    return (
        <div className="App">
            <div id="banner">
                <h1 id="header">Hours</h1>
            </div>
            <div id="hours-form">
                <form onSubmit={handleSubmit}>
                    <label>
                        Start:
                        <input type="number" value={start} onChange={e => setStart(e.target.value)}/>
                    </label>
                    <label>
                        Lunch Start:
                        <input type="number" value={lunchStart} onChange={e => setLunchStart(e.target.value)}/>
                    </label>
                    <label>
                        Lunch Duration:
                        <input type="number" value={lunchDuration} onChange={e => setLunchDuration(e.target.value)}/>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
            <div id="json-response">
                <table>
                    <thead>
                    <tr>
                        <th>Start</th>
                        <th>End</th>
                        <th>Duration</th>
                        <th>Duration in Hours</th>
                    </tr>
                    </thead>
                    <tbody>
                    {workDay?.periods.map((period, index) => (
                        <tr key={index}>
                            <td>{period.start}</td>
                            <td>{period.end}</td>
                            <td>{period.duration}</td>
                            <td>{period.durationInHours.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div id="totals">
                    <h3><FaRedhat/> Total Hours: {workDay?.totalHours.toFixed(2)}</h3>
                    <h3><FaRedhat/> Total Hours in HH:MM: {workDay?.totalHoursInHHMM}</h3>
                    <h3><FaCoffee/> Expected Lunch Time in HH:MM: {workDay?.expectedLunchTimeInHHMM}</h3>
                </div>
            </div>
        </div>
    );
}

export default function WrappedApp() {
    return (
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    );
}