import * as React from 'react';
import { Stack, Box, IconButton, Toolbar, Typography, Accordion, AccordionSummary, AccordionDetails} from '@mui/material';
import {ExpandMore} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { useNavigate } from 'react-router-dom';

import {get, post, del} from '../provider/client_provider';
import { useForm } from 'react-hook-form'


const drawerWidth = 280;

function Main(props) {
    const theme = useTheme();
    const navigate = useNavigate();

    return(
        <>

            <Box
                component="main"
                sx={{ display:"flex", flexFlow: "column", py: 2, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,} }}
            >
                <Toolbar />

                <Typography variant="h1" noWrap component="div" textAlign="center" borderBottom={"5px solid"}>
                    Training Videos
                </Typography>

                <Stack direction={"column"} py={2}spacing={3}>
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography variant="h2" color="text.secondary">Feature 1</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div style={{textAlign:"center"}}>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/tmg6d3T_T6Q" title="GeeksforGeeks" > </iframe> 
                            </div>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion >
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography variant="h2" color="text.secondary">Feature 2</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div style={{textAlign:"center"}}>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/tmg6d3T_T6Q" title="GeeksforGeeks" > </iframe> 
                            </div>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion >
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography variant="h2" color="text.secondary">Feature 3</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div style={{textAlign:"center"}}>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/tmg6d3T_T6Q" title="GeeksforGeeks" > </iframe> 
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    
                </Stack>

            </Box>
        </>
    );
    
}

export default Main;
