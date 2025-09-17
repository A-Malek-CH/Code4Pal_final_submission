export async function openMap(lat: number, lng: number) {
    window.open(`https://www.google.com/maps?lat=${lat}&lng=${lng}`, '_blank');
}

export async function viewUser(userId: string) {
    window.open(`/dashboard/user/${userId}`, '_blank');
}