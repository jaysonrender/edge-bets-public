import Modal from 'react-bootstrap/Modal';

const FlexWarningModal = ({show, onHide, flexPickStatus, flexPicksRemaining, resetPicks, handleSubmit, pickWeek, pick1, pick2}) => {
    
    const WarningModalBody = () => {
        
        if (flexPicksRemaining === 0 && flexPickStatus > 0) {
            return (
                <>
                    <Modal.Body>
                        This pick contains a team you have already picked before. You do not have any flex picks remaining. Please choose different team(s) for your pick.
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-danger' onClick={resetPicks}>Reset Picks</button>
                    </Modal.Footer>
                </>
            )
        }
        else if (flexPicksRemaining < flexPickStatus) {
            return (
                <>
                    <Modal.Body>
                        This pick contains a team you have already picked before. You do not have enough flex picks remaining to pick these. Please choose different team(s) for your pick.
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-danger' data-bs-dismiss="modal" onClick={resetPicks}>Reset Picks</button>
                    </Modal.Footer>
                </>
            )
        } else if (flexPickStatus >= 1 && flexPickStatus <= flexPicksRemaining) {
            return (
                <>
                    <Modal.Body>
                        Warning! This pick (<strong>{pick1}</strong> and <strong>{pick2}</strong>) contains a team you have already picked before. Submitting this pick will require the use of <strong>{flexPickStatus}</strong> flex pick(s).
                        You currently have <strong>{flexPicksRemaining}</strong> remaining. Do you wish to continue?
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-danger' data-bs-dismiss="modal" onClick={resetPicks}>Reset Picks</button>
                        <button className='btn btn-primary' data-bs-dismiss="modal" onClick={handleSubmit}>Use Flex Pick</button>
    
                    </Modal.Footer>
                </>
            )
        } else {
            if(pick1 === null || pick2 === null){

            }

            return (
                <>
                    <Modal.Body>
                        {/*Adjust message to handle both 1 or 2 picks at a time */}
                        You picked <strong>{pick1}</strong> and <strong>{pick2}</strong> as your two picks for Week {pickWeek}. <br /> Are you sure?
                    </Modal.Body>
                    <Modal.Footer>
                        <button className='btn btn-danger' data-bs-dismiss="modal" onClick={resetPicks}>Reset Picks</button>
                        <button className='btn btn-primary' data-bs-dismiss="modal" onClick={handleSubmit}>Submit Pick</button>
                    </Modal.Footer>
                </>
            )
        }
    }


    return (
        <Modal
            show={show}
            onHide={onHide}
            id="flexWarningModal"
        >
            <Modal.Header closeButton>
                <Modal.Title>{flexPickStatus ? `Flex Pick Warning - Week ${pickWeek}` : `Review Picks - Week ${pickWeek}`}</Modal.Title>
                
            </Modal.Header>
            <WarningModalBody 
                flexPickPickStatus={flexPickStatus} 
                flexPicksRemaining={flexPicksRemaining} 
                resetPicks={resetPicks} 
                handleSubmit={handleSubmit} 
                pickWeek={pickWeek} 
                pick1={pick1} 
                pick2={pick2} />
        </Modal>
    )
}



export default FlexWarningModal;