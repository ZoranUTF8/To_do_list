//jshint esversion:6
// HOW TO EXPORT OUR OWN MODULE


exports.getDate = function() {
    const today = new Date();
    // .toLocaleDateString method options
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long"
    };
    return today.toLocaleDateString("en-US", options);

  }
exports.getDay = function() {
  const today = new Date();
  // .toLocaleDateString method options
  const options = {
    weekday: "long"
  };
  return today.toLocaleDateString("en-US", options);

}
