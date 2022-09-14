import React, { useState } from 'react'
import { initialCourse, initialPlayers, initialScorecard } from './initialValues'
import MainScorecardDisplay from './MainScorecardDisplay';
import NavBar from './NavBar';

import { Typography, Paper, AppBar, Toolbar, Grid, ListItem, Divider, Card, CardHeader, CardContent } from '@mui/material';
import RoundSetUpForm from './RoundSetUpForm';
import FinalScoreCard from './FinalScoreCard';

// need to keep a few things in state and a few things can be set to props(? - state or props for players names)
// State:
    // round info - set once and will not change until reset - wipe clean on reset
    //      - course
    //      - players
    //      - 9 or 18 holes 
    // current hole
    // scores of previous holes - update as you submit the scores for the current hole
    // isRoundSetUp - starts as false and renders setup form. When the form is submitted we can set it to false 
    // isRoundFinished - will need to make a final scorecard component that will show up at the end after the last hole
    // probably want one at the end of the front nine

    type HoleScores = []

    type Scorecard = HoleScores[]

function GolfApp() {
    const [currentHoleIndex, setCurrentHoleIndex] = useState(8)
    const [isRoundSetUp, setIsRoundSetUp] = useState(true)
    const [showScorecard, setShowScorecard] = useState(false)
    const [courseInfo, setCourseInfo] = useState(initialCourse)
    const [players, setPlayers] = useState(initialPlayers)
    const [scorecard, setScorecard] = useState(initialScorecard)

// Thoughts on some functions that may be needed
//      - setUpRound - sets the players and course info for the round and generates a new blank scorecard
//      - nextHole - saves the scores of the current hole and adds one to currentHoleIndex.
//                   Also needs to toggle showscorecard when currenthole is greater than holes being played
//      - resetRound - resets all state values back to their default

    const updateScorecard = (score: number, playerIndex: number, holeIndex: number) => {
        let newScorecard = scorecard;
        newScorecard[holeIndex][playerIndex] = score;
        console.log('inside update scorecard', holeIndex, playerIndex)
        console.log(newScorecard)
        setScorecard(newScorecard)
        console.log(scorecard)
    }

    const nextHole = (currentHoleIndex: number, scorecard: number[][]) => {
        // needs to check there are no zero entrys in the current round
        let isThereEmptyScores = scorecard[currentHoleIndex].some(score => score === 0) // should give true or false
        if (isThereEmptyScores) {
            return alert('Need to check all the players scores')  // can make a better system for this later
        }

        // if no zeros then we add one to the currentHoleIndex
        
        if (currentHoleIndex < courseInfo.numHoles - 1) {
            setCurrentHoleIndex(currentHoleIndex + 1);
            console.debug("running in nexHole - after incrementing current hole")
            console.debug("current hole index: ", currentHoleIndex)
            console.debug("numHoles: ", courseInfo.numHoles)
        } else {
            console.debug("running in nextHole - just before toggleScorecard")
            toggleScorecard()
        }
    }

    const toggleScorecard = () => {
        setShowScorecard(!showScorecard)
    }

    const reset = () => {
        
    }




    // Conditional rendering of main page
    let mainPageRender;

    if (isRoundSetUp === false) {
        mainPageRender = <RoundSetUpForm />
    } else if (showScorecard === true) {
        mainPageRender = <FinalScoreCard scorecard={scorecard} />
    } else {
        mainPageRender = (<MainScorecardDisplay 
            holeIndex={currentHoleIndex}
            name={courseInfo.holes[currentHoleIndex].name} 
            par={courseInfo.holes[currentHoleIndex].par}
            strokeIndex={courseInfo.holes[currentHoleIndex].strokeIndex}
            tee={courseInfo.holes[currentHoleIndex].tee}
            players={players}
            updateScorecard={updateScorecard}
            nextHole={nextHole}
            scorecard={scorecard}
            />)
    } 

    const paperStyles: React.CSSProperties = {
        padding: 0,
        margin: 0,
        height: "100%", // may need to go back to 100vh 
        backgroundColor: "#fafafa",
    }

    return(
        <Paper style={paperStyles}elevation={0}>
            <NavBar toggleScorecard={toggleScorecard} scorecard={scorecard} />            
            {mainPageRender}
        </Paper>
    )
}

export default GolfApp;