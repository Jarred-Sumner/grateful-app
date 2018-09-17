import React from "react";
import {
  View,
  StyleSheet,
  DatePickerIOS,
  DatePickerAndroid,
  Animated,
  Platform
} from "react-native";

const IOS_DATEPICKER_HEIGHT = 216;

const styles = StyleSheet.create({});

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusValue: new Animated.Value(props.focused ? 1 : 0)
    };
  }

  componentDidMount() {
    if (Platform.OS === "android") {
      if (this.props.focused) {
        this.openDatePicker();
      }
    }
  }

  openDatePicker = async () => {
    try {
      const { date, minimumDate, maximumDate, onDateChange } = this.props;
      const { action, year, month, day } = await DatePickerAndroid.open({
        date,
        minDate: minimumDate,
        maxDate: maximumDate
      });

      if (action !== DatePickerAndroid.dismissedAction) {
        onDateChange(new Date(year, month, day));
      } else {
        onDateChange(null);
      }
    } catch (exception) {
      console.warn("Cannot open date picker", exception.message);
      onDateChange(null);
    }
  };

  componentWillReceiveProps(props) {
    if (props.focused !== this.props.focused && Platform.OS === "ios") {
      Animated.spring(this.state.focusValue, {
        toValue: props.focused ? 1 : 0
      }).start();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.focused && !prevProps.focused && Platform.OS === "android") {
      this.openDatePicker();
    }
  }

  render() {
    const {
      style,
      focused,
      backgroundColor,
      containerProps = {},
      ...otherProps
    } = this.props;

    if (Platform.OS !== "ios") {
      return null;
    }

    return (
      <View style={{ position: "relative" }}>
        <Animated.View
          style={[
            containerProps.style,
            {
              width: 1,
              height: this.state.focusValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, IOS_DATEPICKER_HEIGHT]
              })
            }
          ]}
          {...containerProps}
        />

        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor,
            transform: [
              {
                translateY: this.state.focusValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [IOS_DATEPICKER_HEIGHT, 1]
                })
              }
            ]
          }}
        >
          <DatePickerIOS {...otherProps} />
        </Animated.View>
      </View>
    );
  }
}
