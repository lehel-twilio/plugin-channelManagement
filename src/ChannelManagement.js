import React from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  header: {
    fontSize: "10px",
    fontWeight: "bold",
    paddingLeft: "11px",
    borderStyle: "solid",
    borderWidth: "0px 0px 1px",
    borderColor: "#c6cad7",
    textTransform: "uppercase",
    letterSpacing: "2px",
    height: "48px",
    position: "relative"
  },
  listItem: {
    position: "relative",
    overflow: "auto",
    paddingTop: "0px",
    paddingBottom: "0px"
  },
  submitButton: {
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingTop: "0",
    paddingBottom: "0",
    marginLeft: "6px",
    marginRight: "6px",
    marginBottom: "24px",
    alignSelf: "center",
    background: "linear-gradient(to top, rgb(25, 118, 210), rgb(25, 118, 210))",
    height: "28px",
    minHeight: "28px",
    width: "100px",
    border: "0px",
    borderRadius: "0px",
    color: "rgb(255, 255, 255);",
    letterSpacing: "2px",
    fontSize: "10px",
    fontWeight: "bold",
    boxShadow: "none",

    "&:hover": {
      backgroundColor: "#8AA6CB"
    },
    "&:disabled": {
      opacity: "0.5",
      color: "rgb(255, 255, 255)"
    }
  },
  resetButton: {
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingTop: "0",
    paddingBottom: "0",
    marginLeft: "6px",
    marginRight: "6px",
    marginBottom: "24px",
    alignSelf: "center",
    background: "##E4E5EA",
    height: "28px",
    minHeight: "28px",
    width: "100px",
    border: "0px",
    borderRadius: "0px",
    color: "gray",
    letterSpacing: "2px",
    fontSize: "10px",
    fontWeight: "bold",
    boxShadow: "none",
    "&:disabled": {
      opacity: "0.5",
      color: "rgb(255, 255, 255)"
    }
  },
  listItemText: {
    fontSize: "12px !important",
    width: "100px"
  },
  textField: {
    width: "48px",
    position: "relative",
    paddingRight: "70px"
  },
  colorSwitchBase: {
    color: "#3376D2",
    "&$colorChecked": {
      color: "#3376D2",
      "& + $colorBar": {
        backgroundColor: "#3376D2"
      }
    }
  },
  colorBar: {},
  colorChecked: {}
});

const channelManagementStyles = {
  margin: "0px",
  padding: "0px",
  width: "100%",
  display: "flex",
  height: "400px",
  flexDirection: "column"
};

const buttonStyles = {
  textAlign: "center",
  marginTop: "1rem"
};

const ChannelAvailabilityList = ({
  channels,
  classes,
  onSwitchChange,
  onCapacityChange
}) => {
  return (
    <List
      subheader={
        <ListSubheader className={classes.header}>
          Channel Availability
        </ListSubheader>
      }
    >
      {channels.map(channel => {
        return (
          <ListItem key={channel.name} className={classes.listItem}>
            <ListItemSecondaryAction>
              <Switch
                onChange={() => {
                  onSwitchChange(channel.name);
                }}
                checked={channel.isAvailable}
                classes={{
                  switchBase: classes.colorSwitchBase,
                  checked: classes.colorChecked,
                  bar: classes.colorBar
                }}
              />
            </ListItemSecondaryAction>
            <ListItemText
              primary={channel.name}
              className={classes.listItemText}
              disableTypography="true"
            />
            <TextField
              id={channel.name}
              name={channel.name}
              className={classes.textField}
              defaultValue={channel.name}
              value={channel.capacity}
              margin="normal"
              variant="outlined"
              onChange={onCapacityChange}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

class ChannelManagement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      channels: [],
      isDirty: false
    };
  }

  componentDidMount() {
    if (typeof this.props.selectedWorker !== "undefined") {
      this.fetchData(this.props.selectedWorker);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedWorker !== prevProps.selectedWorker) {
      this.fetchData(this.props.selectedWorker);
    }
  }

  mapResponseToInputs(res) {
    return res.map(channel => {
      return {
        name: channel.taskChannelUniqueName,
        capacity: channel.configuredCapacity,
        isAvailable: channel.available
      };
    });
  }

  fetchData(selectedWorker) {
    fetch(`${this.props.url}/get-worker-channels`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      body: `WorkerSid=${selectedWorker}`
    })
      .then(response => response.json())
      .then(jsonResponse => {
        this.setState({
          channels: this.mapResponseToInputs(jsonResponse),
          isDirty: false
        });
      });
  }

  onSwitchChange = channelName => {
    const updatedChannelAvailabilty = this.state.channels.map(channel => {
      if (channel.name === channelName) {
        channel.isAvailable = !channel.isAvailable;
      }

      return channel;
    });

    this.setState({ channels: updatedChannelAvailabilty, isDirty: true });
  };

  onCapacityChange = e => {
    const updatedChannelCapacity = this.state.channels.map(channel => {
      if (channel.name === e.target.name) {
        channel.capacity = parseInt(e.target.value, 10);
      }
      return channel;
    });

    this.setState({ channels: updatedChannelCapacity, isDirty: true });
  };

  submitData() {
    fetch(`${this.props.url}/update-worker-channels`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      body: `WorkerSid=${this.props.selectedWorker}&channels=${JSON.stringify(
        this.state.channels
      )}`
    })
      .then(response => response.json())
      .then(jsonResponse => {
        this.setState({
          channels: this.mapResponseToInputs(jsonResponse),
          isDirty: false
        });
      });
  }

  onResetClick = () => {
    this.fetchData();
  };

  onSubmitClick = () => {
    this.submitData();
  };

  render() {
    const { classes } = this.props;

    return (
      <div style={channelManagementStyles}>
        <ChannelAvailabilityList
          classes={classes}
          channels={this.state.channels}
          onSwitchChange={this.onSwitchChange}
          onCapacityChange={this.onCapacityChange}
        />
        <div style={buttonStyles}>
          <Button
            variant="contained"
            className={classes.submitButton}
            onClick={this.onSubmitClick}
            disabled={!this.state.isDirty}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            className={classes.resetButton}
            onClick={this.onResetClick}
            disabled={!this.state.isDirty}
          >
            Reset
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedWorker: state.flex.view.selectedWorkerInSupervisorSid,
    url:
      state.flex.config.serviceBaseUrl.slice(0, 5) === "https"
        ? state.flex.config.serviceBaseUrl.slice(-1) === "/"
          ? state.flex.config.serviceBaseUrl.substring(
              0,
              state.flex.config.serviceBaseUrl.length - 1
            )
          : state.flex.config.serviceBaseUrl
        : "https://" +
          (state.flex.config.serviceBaseUrl.slice(-1) === "/"
            ? state.flex.config.serviceBaseUrl.substring(
                0,
                state.flex.config.serviceBaseUrl.length - 1
              )
            : state.flex.config.serviceBaseUrl)
  };
};

ChannelManagement.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(ChannelManagement));
