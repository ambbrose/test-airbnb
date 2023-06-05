'use client';

import Heading from "@/app/components/Heading";
import HeartButton from "@/app/components/HeartButton";
import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";

import Image from "next/image";

interface ListingHeadProps {
    id: string;
    title: string;
    locationValue: string;
    imageSrc: string;
    currentUser?: SafeUser | null;
};

const ListingHead: React.FC<ListingHeadProps> = ({ id, title, locationValue, imageSrc, currentUser }) => {

    const { getByValue } = useCountries();

    const location = getByValue(locationValue);

    return (
        <>
            <Heading
                title={title}
                subTitle={`${location?.region}, ${location?.label}`}
            />

            <div className="bg-black w-full h-[80vh] overflow-hidden rounded-xl relative">
                <Image 
                    alt="Image"
                    src={imageSrc}
                    fill
                    className="object-cover w-full"
                />

                <div className="absolute top-5 right-5">
                    <HeartButton
                        listingId={id}
                        currentUser={currentUser}
                    />
                </div>
            </div>
        </>
    );
};

export default ListingHead;