import getListingById from "@/app/actions/getListingById";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

import ListingClient from "./ListingClient";
import getReservation from "@/app/actions/getReservations";
import getListings from "@/app/actions/getListings";

import type { Metadata } from "next";

interface IParams {
    listingId?: string;
};

export async function generateMetadata({ params }: { params: IParams }): Promise<Metadata> {

    const listing = await getListingById(params);

    if (!listing) {
        return {
            title: 'Listing Not Found!'
        };
    };

    return {
        title: listing.title,
        description: listing.description,
        // icons: '/next.svg',
    };
};

export async function generateStaticParams() {

    const listings = await getListings({});

    if (!listings) return [];

    return listings.map((listing) => ({
        listingId: listing.id
    }));
};

const ListingPage = async ({ params }: { params: IParams }) => {

    const listing = await getListingById(params);
    const reservations = await getReservation(params);
    const currentUser = await getCurrentUser();

    if (!listing) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        );
    };

    return (
        <ClientOnly>
            <ListingClient
                listing={listing}
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    );
};

export default ListingPage;
