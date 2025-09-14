export const calculateInterestCoef = (points_of_interest,days_in_db) => {
    if(days_in_db === 0) {
        return points_of_interest / 1;
    } else {
        return points_of_interest / days_in_db;
    }
}