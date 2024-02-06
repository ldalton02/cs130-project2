import Image from "next/image";
import styles from '../styles/css/CustomMap.module.css'
import React, { useEffect, useState } from 'react';
import {retrievePlaces} from '../utils/places';

interface CustomMapProps {
    userLocation: { latitude: number; longitude: number } | null;
}

const CustomMap: React.FC<CustomMapProps> = ({ userLocation }) => {
    const [places, setPlaces] = useState([]) as any;

    useEffect(() => {
        // Fetch places from backend
        let p = retrievePlaces();
        p.then((data) => {
            setPlaces(data);
        });

    }, []);


    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const coordinates = '34.0699,-118.4438'; // UCLA
    const width = 400;
    const height = 400;
    const marker_color = 'blue';
    const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates}&zoom=13&size=${width}x${height}&markers=color:${marker_color}|${userLocation?.latitude},${userLocation?.longitude}&key=${googleMapsApiKey}`;

    // Hmmmmm
    // https://nextjs.org/docs/pages/api-reference/components/image#priority 

    return (
        <div className={styles.map}>
            <Image src={imageUrl} alt="Map Image" width={width} height={height} />
        </div>
    );
}

export default CustomMap;