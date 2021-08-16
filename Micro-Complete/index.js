//Initial call to gather data
$.ajax({
  url: "https://data.austintexas.gov/resource/7d8e-dm7r.json",
  type: "GET",
  dataType: "json",
  data: {
    $limit: 10000,
  },
}).done(function (data) {
  document.addEventListener("keyup", logKey);

  //Some basic autofill as the user inputs their values
  function logKey(e) {
    var inputValue = document.getElementById("input").value;
    var inputLength = inputValue.length;
    if (e.keyCode != 8) {
      if (inputLength == 2) {
        document.getElementById("input").value = inputValue + "/";
      } else if (inputLength == 5) {
        document.getElementById("input").value = inputValue + "/";
      } else if (inputLength == 10) {
        document.getElementById("input").value = inputValue + " - ";
      } else if (inputLength == 15) {
        document.getElementById("input").value = inputValue + "/";
      } else if (inputLength == 18) {
        document.getElementById("input").value = inputValue + "/";
      }
    }
  }
  //setting up instance of date range picker
  var picker = new Litepicker({
    element: document.getElementById("input"),
    format: "MM/DD/YYYY",
    singleMode: false,
    numberOfMonths: 1,
    numberOfColumns: 1,
    resetButton: true,
    switchingMonths: 1,
    // dropdowns: {"months":true, "years": true},
    firstDay: 0,
    // startDate: new Date(),
    // endDate: new Date(),
    //This is the "on select" method that fires once the user has seleted a range
    setup: (picker) => {
      picker.on("selected", (date1, date2) => {
        // let sDate = new Date(date1.dateInstance).setHours(0,0,0,0)
        // let eDate = new Date(date2.dateInstance).setHours(0,0,0,0)
        // var dateDate = document.getElementById("date").value
        // var [splitStart, splitEnd] = dateDate.split("-")
        var selectedStartDate = new Date(date1.dateInstance).setHours(
          0,
          0,
          0,
          0
        );
        var selectedEndDate = new Date(date2.dateInstance).setHours(0, 0, 0, 0);
        let totalMeters = 0;
        let totalTrips = 0;
        let allVehicleIDs = new Array();
        let rawMeters = new Array();
        let rawTrips = new Array();
        //Main loop to go through the data
        for (let i = 0; i < data.length; i++) {
          let tripStartDate = new Date(data[i]["start_time"]).setHours(
            0,
            0,
            0,
            0
          );
          let tripEndDate = new Date(data[i]["start_time"]).setHours(
            0,
            0,
            0,
            0
          );
          let distanceMeters = new Number(data[i]["trip_distance"]);
          let allDeviceID = data[i]["device_id"];
          let tripID = data[i]["trip_id"];
          //Filtering data by date range and crunching from there
          if (
            tripStartDate >= selectedStartDate &&
            tripEndDate <= selectedEndDate
          ) {
            totalTrips += 1;
            totalMeters += distanceMeters;
            rawMeters.push(distanceMeters);
            rawTrips.push(tripID);
            allVehicleIDs.push(allDeviceID);
          }
        }
        //Setting up for grabbing unique vehicle IDs
        function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
        }
        // Creating variable in order to pass callback function of onlyUnique in order to get unique vehicle IDs
        var uniqueVehicleID = allVehicleIDs.filter(onlyUnique);

        //Quick math and clean up for miles as raw data is meters
        var meterToMiles = totalMeters / 1609;

        //Rounding the miles to two or less decimal places for user readability
        var roundedMiles = new Intl.NumberFormat("en-us").format(
          Math.round((meterToMiles + Number.EPSILON) * 100) / 100
        );
        //Pushing output to HTML
        const attt = (document.getElementById(
          "uniqueVehicles"
        ).innerHTML = new Intl.NumberFormat("en-us").format(
          uniqueVehicleID.length
        ));
        const attv = (document.getElementById(
          "totalTrips"
        ).innerHTML = new Intl.NumberFormat("en-us").format(totalTrips));
        const attM = (document.getElementById(
          "totalMiles"
        ).innerHTML = roundedMiles);
      });
    },
  });
});

//Setting initial values on the GUI
const attt = (document.getElementById("uniqueVehicles").innerHTML = 0);
const attv = (document.getElementById("totalTrips").innerHTML = 0);
const attM = (document.getElementById("totalMiles").innerHTML = 0);
