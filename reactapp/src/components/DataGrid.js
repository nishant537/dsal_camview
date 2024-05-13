import * as React from 'react';
import { Grid, Box, IconButton, Toolbar, Typography, TextField, InputAdornment, Stack,Button, Modal, FormControl, Paper, Divider, Select, MenuItem} from '@mui/material';
import { DataGrid,GridToolbarContainer,GridToolbarFilterButton,GridColumnHeaderParams, GridFooterContainer, GridFooter, gridClasses, getGridStringOperators, getGridNumericOperators} from '@mui/x-data-grid';
import {Search, FilterAlt,Groups, Storage, LibraryBooks, CheckBox} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import {DataGridPro} from "@mui/x-data-grid-pro";
import { useNavigate } from 'react-router-dom';

const drawerWidth = 280;

export const numeric_operators = getGridNumericOperators().filter(
    (operator) => operator.value === '=' || operator.value === '>',
)
export const string_operators = getGridStringOperators().filter(
    (operator) => operator.value === 'contains',
)

function Main(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const operator_to_string = {"=":"eq","!=":"not",">":"gt",">=":"gte","<":"lt","<=":"lte","contains":"like"};
    const string_to_operator = Object.fromEntries(Object.entries(operator_to_string).map(a => a.reverse()));
    


    const [modalOpen, setModalOpen] = React.useState(false);    
    const [rows,setRows] = React.useState([])
    const [urlParams, setUrlParams] = React.useState(()=>{
        const data = new URLSearchParams(window.location.search)
        return data.toString()
    })
    const [filter, setFilter] = React.useState(()=>{
        const data = new URLSearchParams(window.location.search)
        const filterItems = [];
        for (let p of data) {
            filterItems.push({'field':p[0].split('__')[0], "operator":string_to_operator[p[0].split('__')[1]], "value":p[1]});
        }
        return filterItems;
    })
    const [selectedRow, setSelectedRow] = React.useState([])

    function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <Stack alignItems="center" direction="row" gap={1}>
                <GridToolbarFilterButton
                    sx={{padding:"0 20px"}}
                    componentsProps={{
                        button: {
                            startIcon: (
                                <FilterAlt />
                            )
                        }
                    }}
                />
                <TextField sx={{width: "450px",my:2,mr:4, background:"#f4f2ff" }} id="contained-search" variant="outlined" placeholder='Seach Client' type="search" InputProps={{
                    startAdornment: (
                        <InputAdornment>
                            <IconButton>
                                <Search />
                            </IconButton>
                        </InputAdornment>
                    )
                }}/>

                {/* here comes custom component */}
                {props.custom_component}
            </Stack>
        </GridToolbarContainer>
    );
    }
    function CustomFooter () {
    return (
        <GridFooterContainer sx={{backgroundColor:"#f4f2ff"}}>
        {/* Add what you want here */}
        <GridFooter sx={{
            border: 'none', // To delete double border.
            justifyContent:"space-between"
            }} />
        </GridFooterContainer>
    );
    }
    
    const onFilterModelChange = (newFilterModel) => {
        console.log("Filter model Changed!")
        const data = new URLSearchParams();
        newFilterModel['items'].map((value, index)=>{
            if (value['value']){
                data.append(`${value['field']}__${operator_to_string[value['operator']]}`, value['value'])
            }
        })
        window.history.replaceState({}, '', `${window.location.pathname}?${data}`);
        setUrlParams(data.toString())
    }

    return(
        <DataGridPro
            sx={{
                height:"100%",
                [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
                outline: 'none',
                },
                [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
                {
                    outline: 'none',
                },
                [`& .${gridClasses.columnHeader}`]:
                {
                    fontFamily: "Poppins",
                    fontSize: "1rem",
                    lineHeight: "2rem",
                    fontWeight:"500",
                    backgroundColor: '#f4f2ff',
                    color:"#8b83ba",
                },
                [`& .${gridClasses.cell}, & .${gridClasses.columnHeaderTitleContainer}`]: {
                    borderBottom: '1px solid #e8e8e8',
                    textAlign:"-webkit-center",
                    justifyContent:"center"
                },
                
            }}
            rows={props.rows}
            columns={props.columns}
            disableMultipleRowSelection={true}
            // initialState={{
            // pagination: {
            //     paginationModel: {
            //     pageSize: 5,
            //     },
            // },
            // }}
            autoHeight={true}
            slots={{
                toolbar: CustomToolbar,
                footer: CustomFooter,
            }}
            pageSizeOptions={[5]}
            // pageSize={100}
            checkboxSelection
            disableRowSelectionOnClick
            
            // this does not trigger model change, just shows on ui
            initialState={{
                filter: {
                    filterModel: {
                    items: filter,
                    },
                },
            }}
            filterMode='server'
            onFilterModelChange={(newFilterModel) => onFilterModelChange(newFilterModel)}
            onRowSelectionModelChange={(ids) => {
                const selectedIDs = new Set(ids);
                const selectedRowData = rows.filter((row) =>
                    (selectedIDs.has(row.id))
                );
                setSelectedRow(selectedRowData);
            }}
        />  
    );
    
}

export default Main;
