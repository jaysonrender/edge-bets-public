import getCurrentWeek from '../util/getCurrentWeek';

const WeekOptions = () => {

    let options = [];
    const currentWeek = getCurrentWeek(new Date())
    
    for(let i = 1; i <= 18; i++){
        options.push(
            (<option key={"week" + i} value={i}>Week {i}</option>)
        )
    }

    return options;
}

export default WeekOptions;