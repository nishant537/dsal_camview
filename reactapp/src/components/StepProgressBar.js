import React from "react";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

function Main(props) {

    return (
        <>
            <ProgressBar
                percent={props.percent}
                filledBackground="#4a3aff"
            >
                <Step transition="scale">
                    {({ accomplished, position, transitionState, index }) => (
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                            <div style={{width:"30px",height:"30px",borderRadius:"50%",backgroundColor:`${accomplished ? "#4a3aff" : "#e8e8e8"}`}}></div>
                            {/* <img style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }} width="30" src="https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/9d/Pichu.png/revision/latest?cb=20170407222851"/> */}
                            {/* <div className={`indexedStep ${accomplished ? "accomplished" : ""}`}>
                                {index + 1}
                            </div> */}
                        </div>
                    )}
                </Step>
                <Step transition="scale">
                    {({ accomplished, position, transitionState, index }) => (
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                            <div style={{width:"30px",height:"30px",borderRadius:"50%",backgroundColor:`${accomplished ? "#4a3aff" : "#e8e8e8"}`}}></div>
                        </div>
                    )}
                </Step>
                <Step transition="scale">
                    {({ accomplished, position, transitionState, index }) => (
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                            <div style={{width:"30px",height:"30px",borderRadius:"50%",backgroundColor:`${accomplished ? "#4a3aff" : "#e8e8e8"}`}}></div>
                        </div>
                    )}
                </Step>
                <Step transition="scale">
                    {({ accomplished, position, transitionState, index }) => (
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                            <div style={{width:"30px",height:"30px",borderRadius:"50%",backgroundColor:`${accomplished ? "#4a3aff" : "#e8e8e8"}`}}></div>
                        </div>
                    )}
                </Step>
            </ProgressBar>
        </>
    );
}

export default Main;