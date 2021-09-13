import Ember from "ember";

// Date Time String used in App:
// "Tue Sep 14 2021 21:30:00 GMT+0530 (India Standard Time)" => "14/09/2021, 02:00:00""// HKT format

export default Ember.Helper.helper(function(value, params) {
  if (value) {
    return new Date(value).toLocaleString(undefined, {
      timeZone: "Asia/Hong_Kong"
    });
  } else {
    return "";
  }
});
