import React, {Fragment } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
const styles = (theme) => ({
    root: {
        flexGrow: 1,
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
});
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            file: null,
            table_schema:[],
            open_detail_table:false,
            columns: [
                { title: 'Id', field: 'id', editable: 'never' },
                { title: 'Level', field: 'level', editable: 'never' },
                { title: 'Cvss', field: 'cvss', editable: 'never' },
                { title: 'Title', field: 'title', editable: 'never' },
                { title: 'CVulnerability', field: 'Vulnerability', editable: 'never' },
                { title: 'Solution', field: 'Solution', editable: 'never' },
                { title: 'Reference', field: 'reference', editable: 'never' }
            ],
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.fecthRecord = this.fecthRecord.bind(this);
    }
    onFormSubmit(e){
        e.preventDefault();
        const formData = new FormData();     
        formData.append('myCsvFile',this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };   
        if(this.state.file !=null){
            axios.post("/upload",formData,config)
            .then((response) => {
                this.setState({ open_detail_table: true });
                console.log("The file is successfully uploaded "+response);
            }).catch((error) => {
                console.log("Error: "+error);
        });
        }else{
            alert("Please Choose a Valid File");
        }
    }
    onChange(e) {
        this.setState({file:e.target.files[0]});
    }
    fecthRecord = () => {
        axios.post('/fetchtablerecord/')
            .then(res => {
                let data = res.data;
                this.setState({ table_schema: data });
            })
            .catch(error => {
                console.log(error);
            });
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
            <AppBar position="static">
                <Toolbar variant="dense">
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" color="inherit">
                    Assigment
                </Typography>
                </Toolbar>
            </AppBar>
            <form onSubmit={this.onFormSubmit}>
            <h1>File Upload (.CSV Only)</h1>
            <input type="file" name="myCsvFile" accept=".csv" onChange= {this.onChange} />
            <Button variant="contained" color="secondary" type="submit">Upload</Button>
            </form>
            <hr/>
            {this.state.open_detail_table && <Fragment>
            <Button variant="contained" color="primary" onClick={this.fecthRecord}>Fetch Record</Button>
            <br/><br/>
            <Grid item xs={12}>
               <Paper className={classes.paper}>
               <MaterialTable
               columns={this.state.columns}
               data={this.state.table_schema}
               title="Csv Record"
             />
               </Paper>
            </Grid>
            </Fragment>}
           </div>
        );
    }
}

export default withStyles(styles)(App);
