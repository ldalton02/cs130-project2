/**
 * Creates an activity chart for a location that shows trends in activity over time.
 */
import React, { FC, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFirestore, useObservable } from 'reactfire';
import { collection, query, getDocs } from 'firebase/firestore';


type PlaceMapType = Map<string, string>;

interface PreData {
    times: Map<String, number>,
    place_name: String,
    data_id: String,
}

interface ChatObject {
    message: String;
    place: string;
    time: number;
    uid: String;
}

// data to pass to
type DataBlock = any[]

/**
 * Creates a scrollable chart that takes in time and place data and analyzes to create an activity graph.
 * @returns activity graph component with line object
 */
export const MyScrollableChart: FC = () => {
    const [data, setData] = useState<DataBlock>(); // data block
    const [lines, setLines] = useState<DataBlock>();
    const firestore = useFirestore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Declare Firebase query
                const placesCollection = collection(firestore, 'places');
                const placesQuery = query(placesCollection);
                const placeSnapshot = await getDocs(placesQuery);
                const placemap: PlaceMapType = new Map();

                // Create map of Place ID -> Real Place Name
                placeSnapshot.forEach((doc) => {
                    placemap.set(doc.id, doc.data().name);
                });

                // Declare Firebase query
                const messagesCollection = collection(firestore, 'chats');
                const messageQuery = query(messagesCollection);
                const chatSnapshot = await getDocs(messageQuery);
                const messages: ChatObject[] = [];
                const predataMap: Map<string, PreData> = new Map();


                // Get List of Chats //TODO Set a Max # of chats to get ?
                chatSnapshot.forEach((doc) => {
                    messages.push({ ...doc.data() } as ChatObject);
                });


                // Repalce 'Place' with real place from firestore
                messages.forEach((msg) => {
                    if (placemap.has(msg.place)) {
                        // replace Place
                        const realPlace = placemap.get(msg.place)!;

                        msg.place = realPlace
                    }
                })

                // create array of PreData to be processed before stored statefully
                messages.forEach(msg => {
                    let p: PreData = {
                        place_name: msg.place,
                        data_id: msg.place.replaceAll(' ', '_'),
                        times: new Map()
                    }
                    predataMap.set(msg.place, p)
                })

                const data_points = 6; // number of points on the graph
                const time_frame = 2;  // size of period in hours
                const loop_length = data_points * time_frame;


                // Time period
                const start = new Date();  // time period_size hours ago
                start.setHours(start.getHours() - time_frame) // increment to period_size hours ago
                const end = new Date(); // time now

                // generate hour_marks time points for the graph
                for (let i = time_frame; i < loop_length; i += time_frame) {
                    //name current time period
                    const time_period_name = i.toString() + " Hours Ago";

                    messages.forEach(msg => {
                        // Create Date object of message time
                        const msgDate: Date = new Date()
                        msgDate.setTime(msg.time * 1000)

                        // check if Date Object is between the times we are iterating through
                        if (msgDate > start && msgDate < end) {

                            // Update value in appropriate PreData Object -> 
                            // if this time range already exists -> increment value
                            // if this time range does not exist, add it and set to 1
                            if (predataMap.get(msg.place)?.times.get(time_period_name)) {
                                predataMap.get(msg.place)?.times.set(time_period_name, predataMap.get(msg.place)?.times.get(time_period_name)! + 1)
                            } else {
                                predataMap.get(msg.place)?.times.set(time_period_name, 1)
                            }
                        }
                    })

                    // Decrement both by period_size
                    start.setHours(start.getHours() - time_frame);
                    end.setHours(end.getHours() - time_frame);
                }
                let tempdatablock: any[] = []

                // Generate Data Object
                for (let i = time_frame; i < loop_length; i += time_frame) {
                    const time_period_name = i.toString() + " Hours Ago";

                    let obj: any = new Object();
                    obj.name = time_period_name

                    predataMap.forEach(element => {
                        if (element.times.has(time_period_name)) {
                            obj[element.data_id as string] = element.times.get(time_period_name)!
                        } else {
                            obj[element.data_id as string] = 0
                        }
                    })
                    tempdatablock.push(obj)
                }
                tempdatablock = tempdatablock.reverse() // reverse 
                setData(tempdatablock); // store processed state

                // Generate Lines object
                let templines: any[] = []
                predataMap.forEach(element => {
                    templines.push(element.data_id)
                });
                setLines(templines) // store statefully
                console.log("lines")
                console.log(lines)
                console.log("data")
                console.log(data)

            } catch (error) {
                console.error('Error fetching data from Firebase:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array 



    // Transform lines into Line Objects
    const LineObjects = (
        lines
            ? lines.map((key) => (
                <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
            ))
            : null
    );

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex items-center justify-center h-full">
                <h1 className="text-center">Chatroom Activity!</h1>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data} margin={{ right: 30 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {LineObjects}

                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
