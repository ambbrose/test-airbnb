import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import ReservationClient from "./ReservationsClient";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import getListings from "../actions/getListings";

const ReservationsPage = async () => {

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Unauthorized"
                    subtitle="Please login"
                />
            </ClientOnly>
        );
    };

    const reservations = await getReservations({ authorId: currentUser.id });
    const userListings = await getListings({ userId: currentUser.id });

    if (reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No reservations found"
                    subtitle={`Looks like you have no reservations on your propert${userListings?.length > 1 ? 'ies' : 'y'}`}
                />
            </ClientOnly>
        );
    };

    return (
        <ClientOnly>
            <ReservationClient
                currentUser={currentUser}
                reservations={reservations}
            />
        </ClientOnly>
    );
};

export default ReservationsPage;