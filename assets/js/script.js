$(document).ready(function () {
  // On button click, text in the input field is stored in variable 'searchTerm' and applied to functions 'weatherFunction()' and 'weatherForecast()'
  $("#search-input").on("click", function () {
    var searchTerm = $("#search-value").val();
    $("#search-value").val("");
    weatherFunction(searchTerm);
    weatherForecast(searchTerm);
  });

  localStorage.setItem("history", JSON.stringify(["Seattle", "Philadelphia", "Atlanta", "Sacramento"]));

  // calls localStorage for previously searched terms into variable 'history'
  var history = JSON.parse(localStorage.getItem("history")) || [];

  if (history.length > 0) {
    weatherFunction(history[history.length - 1]);
    weatherForecast(history[history.length - 1]);
  }

  for (var i = 0; i < history.length; i++) {
    createRow(history[i]);
  }

  function createRow(text) {
    var listItem = $("<li>").addClass("nav-item");
    var buttonItem = $("<a>").addClass(`pure-button ${text}`).text(text);
    $(".history").append(listItem.append(buttonItem));
  }

  $(".history").on("click", "li", function () {
    weatherFunction($(this).text());
    weatherForecast($(this).text());
  });

  function weatherFunction(searchTerm) {
    $.ajax({
      Method: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        searchTerm +
        "&appid=3b7367f9686896190bdef7550bd1ac35",
    }).then(function (data) {
      if (history.indexOf(searchTerm) === -1) {
        history.push(searchTerm);

        localStorage.setItem("history", JSON.stringify(history));
        createRow(searchTerm);
      }

      $("#today").empty();

      var title = $("<h1>").text(
        "Current " +
          data.name +
          " Weather (" +
          new Date().toLocaleDateString() +
          ")"
      );
      var img = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
      );

      var cardBody = $("<div>").addClass("pure-u-1-2");
      var wind = $("<p>")
        .addClass("card-text")
        .text("Wind: " + data.wind.speed + " MPH");
      var humid = $("<p>")
        .addClass("card-text")
        .text("Humidity: " + data.main.humidity + " %");
      var temp = $("<p>")
        .addClass("card-text")
        .text(
          "Temp: " +
            Math.round(((data.main.temp - 273.15) * 1.8 + 32) * 100) / 100 +
            " °F"
        );

      cardBody.append(title, img, temp, humid, wind);
      $("#today").append(cardBody);
    });
  }

  function weatherForecast(searchTerm) {
    $.ajax({
      Method: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        searchTerm +
        "&appid=3b7367f9686896190bdef7550bd1ac35&units=imperial",
    }).then(function (data) {
      $("#forecast").empty();

      for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
          var dateFive = $("<p>")
            .text(new Date(data.list[i].dt_txt).toLocaleDateString());
          var imgFive = $("<img>").attr(
            "src",
            "https://openweathermap.org/img/w/" +
              data.list[i].weather[0].icon +
              ".png"
          );
          var cardFive = $('<div>').addClass("pure-u-1-5");
          var humidFive = $("<p>")
            .text("Humidity: " + data.list[i].main.humidity + "%");
          var tempFive = $("<p>")
            .text("Temp: " + data.list[i].main.temp + " °F");
          var wind = $("<p>")
            .text("Wind: " + data.list[1].wind.speed + " MPH");

            cardFive.append(dateFive, imgFive, humidFive, tempFive, wind);

          $("#forecast").append(cardFive);
        }
      }
    });
  }
});
