import React from 'react';
import { connect } from 'react-redux';
import * as Flex from '@twilio/flex-ui'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  header: {
    fontSize: '10px',
    fontWeight: 'bold',
    paddingLeft: '11px',
    borderStyle: 'solid',
    borderWidth: '0px 0px 1px',
    borderColor: '#c6cad7',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    height: '48px',
    position: 'relative'
  },
  listItem: {
    position: 'relative',
    overflow: 'auto',
    paddingTop: '0px',
    paddingBottom: '0px'
  },
  submitButton: {
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '0',
    paddingBottom: '0',
    marginLeft: '6px',
    marginRight: '6px',
    marginBottom: '24px',
    alignSelf: 'center',
    background: '#1976D2',
    height: '28px',
    minHeight: '28px',
    width: '100px',
    border: '0px',
    borderRadius: '0px',
    color: 'white',
    letterSpacing: '2px',
    fontSize: '10px',
    fontWeight: 'bold',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#145EA8',
    },
  },
  resetButton: {
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '0',
    paddingBottom: '0',
    marginLeft: '6px',
    marginRight: '6px',
    marginBottom: '24px',
    alignSelf: 'center',
    background: '##E4E5EA',
    height: '28px',
    minHeight: '28px',
    width: '100px',
    border: '0px',
    borderRadius: '0px',
    color: 'gray',
    letterSpacing: '2px',
    fontSize: '10px',
    fontWeight: 'bold',
    boxShadow: 'none'
  },
  listItemText: {
    fontSize: '12px !important',
    width: '100px'
  },
  textField: {
    width: '48px',
    position: 'relative',
    marginRight: '70px'
  },
  colorSwitchBase: {
    color: '#3376D2',
    '&$colorChecked': {
      color: '#3376D2',
      '& + $colorBar': {
        backgroundColor: '#3376D2',
      },
    },
  },
  colorBar: {},
  colorChecked: {},
});

const channelManagementStyles = {
  margin: '0px',
  padding: '0px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column'
};

const buttonStyles = {
  paddingLeft: '12px',
  paddingRight: '12px',
  paddingTop: '36px',
  paddingBottom: '24px',
  display: 'flex',
  justifyContent: 'center'
}

class ChannelManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = { channelAvailability: {}, channelCapacity: {}, disableButtons: true }
  };

  componentDidMount() {
    if (typeof(this.props.selectedWorker) !== 'undefined') {
      this.fetchData(this.props.selectedWorker);
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.selectedWorker !== prevProps.selectedWorker) {
      this.fetchData(this.props.selectedWorker);
    }
  }

  fetchData(selectedWorker) {
    const token = Flex.Manager.getInstance().user.token
    fetch(`${this.props.url}/get-worker-channels`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: `WorkerSid=${selectedWorker}&token=${token}`
    })
    .then(response => response.json())
    .then(jsonResponse => {
      let channelAvailabilityMap = {};
      let channelCapacityMap = {};
      for (let item in jsonResponse) {
        channelAvailabilityMap[jsonResponse[item].taskChannelUniqueName] = jsonResponse[item].available;
        channelCapacityMap[jsonResponse[item].taskChannelUniqueName] = jsonResponse[item].configuredCapacity;
      };
      this.setState({
        channelAvailability: channelAvailabilityMap,
        channelCapacity: channelCapacityMap,
        disableButtons: true
      });
    });
  };

  submitData() {
    const token = Flex.Manager.getInstance().user.token
    fetch(`${this.props.url}/update-worker-channels`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: `WorkerSid=${this.props.selectedWorker}&channelAvailability=${JSON.stringify(this.state.channelAvailability)}&channelCapacity=${JSON.stringify(this.state.channelCapacity)}&token=${token}`
    })
    .then(response => response.json())
    .then(jsonResponse => {
      let channelAvailabilityMap = {};
      let channelCapacityMap = {};
      for (let item in jsonResponse) {
        channelAvailabilityMap[jsonResponse[item].taskChannelUniqueName] = jsonResponse[item].available;
        channelCapacityMap[jsonResponse[item].taskChannelUniqueName] = jsonResponse[item].configuredCapacity;
      };
      this.setState({
        channelAvailability: channelAvailabilityMap,
        channelCapacity: channelCapacityMap,
        disableButtons: true
      });
    });
  };

  handleToggle = value => () => {
    let { channelAvailability, channelCapacity } = this.state;
    channelAvailability[value] = channelAvailability[value] ? false : true; //toggle
    this.setState({
      channelAvailability: channelAvailability,
      channelCapacity: channelCapacity,
      disableButtons: false
    });
  };

  handleCapacityChange = (e) => {
    let { channelAvailability, channelCapacity } = this.state;
    channelCapacity[e.target.id] = parseInt(e.target.value, 10);
    this.setState({
      channelAvailability: channelAvailability,
      channelCapacity: channelCapacity,
      disableButtons: false
    });
  };

  reset = () => {
    this.fetchData(this.props.selectedWorker);
  };

  submit = () => {
    this.submitData();
  };

  render() {
    const { classes } = this.props;
    const mapStructure = (channelAvailability, channelCapacity) => {

      return Object.keys(channelAvailability).map((channel, i) => {

        return (
          <ListItem className={classes.listItem} key={i}>
            <ListItemText primary={channel} className={classes.listItemText} disableTypography='true'/>
            <TextField
              id={channel}
              className={classes.textField}
              value={channelCapacity[channel]}
              margin='normal'
              variant='outlined'
              onChange={this.handleCapacityChange}
            />
            <ListItemSecondaryAction>
              <Switch
                onChange={this.handleToggle(channel)}
                checked={this.state.channelAvailability[channel]}
                classes={{
                  switchBase: classes.colorSwitchBase,
                  checked: classes.colorChecked,
                  bar: classes.colorBar,
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        )
      });
    };

    return (
      <div style={channelManagementStyles}>
        <List subheader={<ListSubheader className={classes.header}>Channel Availability</ListSubheader>}>
          {mapStructure(this.state.channelAvailability, this.state.channelCapacity)}
        </List>
        <div style={buttonStyles}>
          <Button variant='contained' className={classes.submitButton} disabled={this.state.disableButtons} onClick={this.submit}>Submit</Button>
          <Button variant='contained' className={classes.resetButton} disabled={this.state.disableButtons} onClick={this.reset}>Reset</Button>
        </div>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    selectedWorker: state.flex.view.selectedWorkerInSupervisorSid,
    url: state.flex.config.serviceBaseUrl.slice(0,5) === 'https'
      ? (state.flex.config.serviceBaseUrl.slice(-1) === '/' ? state.flex.config.serviceBaseUrl.substring(0, state.flex.config.serviceBaseUrl.length - 1) : state.flex.config.serviceBaseUrl)
      : ("https://" + (state.flex.config.serviceBaseUrl.slice(-1) === '/' ? state.flex.config.serviceBaseUrl.substring(0, state.flex.config.serviceBaseUrl.length - 1) : state.flex.config.serviceBaseUrl)),
  }
}

ChannelManagement.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(ChannelManagement));
