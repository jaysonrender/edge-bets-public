const getCurrentWeek = (currentDate) => {

    //Tuesday at midnight before first game of the season
    //TO-DO: UPDATE before 2023 season
    const startDate = new Date('2023-09-05T00:00:00');  
                                                       
    const days = (currentDate - startDate) / (24 * 60 * 60 * 1000); //millisecond to days conversion

    let weekNumber = Math.ceil(days / 7);
    if (days % 7 === 0){
        //in the event that this method is called at exactly the turning point for the week (see startDate) 
        weekNumber += 1; 
    }
    
    return weekNumber;
}

export default getCurrentWeek;