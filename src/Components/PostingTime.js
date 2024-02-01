export const calculateTimeDifference = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const timeDifference = now - createdDate;
    const secondsDifference = Math.floor(timeDifference / 1000);

    if (secondsDifference < 60) {
        return `${secondsDifference} ${secondsDifference === 1 ? 'sec' : 'secs'} ago`;
    } else {
        const minutesDifference = Math.floor(secondsDifference / 60);

        if (minutesDifference < 60) {
            return `${minutesDifference} ${minutesDifference === 1 ? 'min' : 'mins'} ago`;
        } else {
            const hoursDifference = Math.floor(minutesDifference / 60);

            if (hoursDifference < 24) {
                return `${hoursDifference} ${hoursDifference === 1 ? 'hr' : 'hrs'} ago`;
            } else {
                const daysDifference = Math.floor(hoursDifference / 24);

                if (daysDifference < 7) {
                    return `${daysDifference} ${daysDifference === 1 ? 'day' : 'days'} ago`;
                } else if (daysDifference < 30) {
                    const weeksDifference = Math.floor(daysDifference / 7);
                    return `${weeksDifference} ${weeksDifference === 1 ? 'week' : 'weeks'} ago`;
                } else if (daysDifference < 365) {
                    const monthsDifference = Math.floor(daysDifference / 30);
                    return `${monthsDifference} ${monthsDifference === 1 ? 'month' : 'months'} ago`;
                } else {
                    const yearsDifference = Math.floor(daysDifference / 365);
                    return `${yearsDifference} ${yearsDifference === 1 ? 'year' : 'years'} ago`;
                }
            }
        }
    }
};
