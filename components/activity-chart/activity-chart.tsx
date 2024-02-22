import React, { FC, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFirestore } from 'reactfire';
import { collection, query, getDocs } from 'firebase/firestore';

interface ApiPlace {
    place: number;
}

interface ApiDataItem {
    places: ApiPlace;
    time: number;
    id: string;
}

interface TransformedDataItem {
    name: string;
    YRL: number;
}

export const MyScrollableChart: FC = () => {
    const [data, setData] = useState<TransformedDataItem[]>([]);
    const firestore = useFirestore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const messagesCollection = collection(firestore, 'history');
                const messageQuery = query(messagesCollection);
                const querySnapshot = await getDocs(messageQuery);

                const messages: ApiDataItem[] = [];
                querySnapshot.forEach((doc) => {
                    messages.push({ ...doc.data(), id: doc.id } as ApiDataItem);
                });

                const transformedData: TransformedDataItem[] = messages.map(item => ({
                    name: new Date(item.time).toLocaleString(),
                    YRL: item.places.place,
                }));

                setData(transformedData);
            } catch (error) {
                console.error('Error fetching data from Firebase:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array 

    const lines = data.length > 0 ? (
        Object.keys(data[0])
            .filter(key => key !== 'name') // Skip the 'name' property as it corresponds to X-axis
            .map((key) => (
                <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color for each line
                />
            ))
    ) : null;

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
