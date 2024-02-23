import React, { FC, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFirestore } from 'reactfire';
import { collection, query, getDocs } from 'firebase/firestore';


type PlaceMapType = Map<String, String>;
type DateMap = Map<Date, Date>; // start -> end
type BusynessMap = Map<String, number>

interface ChatObject {
    message: String;
    place: String;
    time: number;
    uid: String;
}

interface LineItem {
    name?: string;
    busynesslist?: BusynessMap[]
}



export const MyScrollableChart: FC = () => {
    // Firestore 
    const [data, setData] = useState<LineItem[]>([]);
    const firestore = useFirestore();

    // populate graph
    const TBM: DateMap = new Map;
    const keysArray = Array.from(TBM.keys());

    // TODO reorganize location of this loop
    for (const key of keysArray) {
        // if message falls within time period, add to our object
        if (messageTime > key && messageTime < TBM.get(key)!) {
            li.name = key.getHours().toString(); //TODO set name to proper hour & prevent function from running more than once

            // TODO increment busyness
            // if(li.busynesslist?.find(msg.place))) {

            // }


            //Append Line item to data if we have found a valid chat
            setData((prevData) => [...prevData, li]); // TODO move this to somewhere that makse sense, this should only run several times not 
        }
    }

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
                //TODO Set a Max # of chats to get

                // Create List of Chats 
                chatSnapshot.forEach((doc) => {
                    messages.push({ ...doc.data() } as ChatObject);
                });


                // Repalce 'Place' with real place from firestore
                messages.forEach((msg) => {
                    if (placemap.has(msg.place)) {
                        // replace Place
                        const realPlace = placemap.get(msg.place);
                        msg.place = realPlace!;

                        // move time from Seconds to Milliseconds
                        msg.time = msg.time * 1000

                    }
                })

                const number_buckets = 10; // number of points on the graph
                const period_size = 1;  // size of period in hours
                // const bucket_labels = [] // 


                // Time period
                const end = new Date(); // time now
                const start = new Date();  // time bucket_size hours ago

                // Adjust end based on the current iteration
                start.setHours(start.getHours() - period_size);

                for (let i = 1; i < number_buckets; i++) {
                    // add time to list
                    TBM.set(new Date(start), new Date(end));

                    // Decrement both
                    start.setHours(start.getHours() - 1);
                    end.setHours(end.getHours() - 1);
                }



                // Iterate through messages and place them in defined time periods
                messages.forEach((msg) => {
                    const messageTime = new Date(msg.time); // Make Date object out of message time sent

                    // Create a Line item
                    const li: LineItem = {
                        name: messageTime.toString(),
                        busynesslist: []
                    }


                });

                // setData(transformedData);
            } catch (error) {
                console.error('Error fetching data from Firebase:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array 



    // Transform Data into Line Objects
    console.log(data)
    const lines = data.length > 0 ? (
        Object.keys(data[0])
            .filter(key => key !== 'name') // Skip the 'name' property as it corresponds to X-axis
            .map((key) => (
                <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
            ))
    ) : null;

    console.log(lines)

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex items-center justify-center h-full">
                <h1 className="text-center">Current Popularity</h1>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data} margin={{ right: 30 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {lines}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
