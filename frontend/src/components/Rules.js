const Rules = () => {
    return (
        <div className="modal " id='rules'>
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content text-bg-light">
                    <div className="modal-header">
                        <h2>NFL Pick Em Rules</h2>
                        <button className='btn-close' data-bs-dismiss='modal' data-bs-target='#rules' />

                    </div>
                    <div className="modal-body">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">You pick two separate NFL teams every week</li>
                            <li className="list-group-item">The teams cannot play each other that week</li>
                            <li className="list-group-item">You must pick every team once throughout the season. You'll have <strong >4</strong> duplicate(flex) picks you can pick anytime throughout the season which allows you to pick teams more than once. The website will help you track these flex picks.</li>
                            <li className="list-group-item">If your pick wins, you gain the difference in points by how much they won by (i.e. final score is 14 to 7 the difference is 7 which is added to your overall score)</li>
                            <li className="list-group-item">If your pick loses, you lose the difference in points by how much they lost by (i.e. final score is 3 to 7 the difference is -4 which is deducted from your overall score) </li>
                            <li className="list-group-item">Cumulative season score is the rankings at the end of the season which determines winners and payouts</li>
                            <li className="list-group-item">Picks are due before the first snap of every game of your picking.</li>
                            <li className="list-group-item">MISSED PICKS: If a pick(s) is not made by weeks' end, teams not chosen yet
                                                            will be alphabetically assigned from both ends of the alphabet and be given
                                                            a zero for that week. (Recommendation: this is not a good strategy to miss
                                                            picks on purpose to try and schedule around, this will only hurt you in the
                                                            long run) AFTER WEEK 16, ANY MISSED PICKS WILL DEFAULT YOUR TEAM
                                                            AND YOU ARE NOT ELIGIBLE FOR PAYOUT SPOTS
                            </li>

                        </ul>

                    </div>
                    <div className="modal-footer">
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Rules;

/**
 * ● You pick two separate NFL teams every week
● The teams cannot play each other that week
● You must pick every team once throughout the season. You’ll have four
duplicate(flex) picks you can pick anytime throughout the season which
allows you to pick teams more than once. The website will help you track
these flex picks.
● If your pick wins, you gain the difference in points by how much they won
by (i.e. final score is 14 to 7 the difference is 7 which is added to your
overall score)
● If your pick loses, you lose the difference in points by how much they lost by
(i.e. final score is 3 to 7 the difference is -4 which is deducted from your
overall score)
● Cumulative season score is the rankings at the end of the season which determines winners and payouts
● Buy in is $55 a person for the whole season. ($50 to the winnings, $5 to
website maintenance fees)
● You must submit weekly picks at: www.edge-bets.com This site will track
your picks and will update in real time.
● Picks are due before the first snap of every game of your picking.
● MISSED PICKS: If a pick(s) is not made by weeks’ end, teams not chosen yet
will be alphabetically assigned from both ends of the alphabet and be given
a zero for that week. (Recommendation: this is not a good strategy to miss
picks on purpose to try and schedule around, this will only hurt you in the
long run) AFTER WEEK 16, ANY MISSED PICKS WILL DEFAULT YOUR TEAM
AND YOU ARE NOT ELIGIBLE FOR PAYOUT SPOTS
 */