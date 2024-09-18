var $ = jQuery;

// first modal - toggle filter

$(".welcome-close-button").on("click", function () {
  $("div.visible-filter-box").removeClass("visible-filter-box");
});
// end first modal - toggle filter

// second modal - toggle legend

$(".button-toggle-legend").on("click", function () {
  $("div.toggle-legend-box").addClass("visible-legend-box");
});

$(".welcome-close-button").on("click", function () {
  $("div.visible-legend-box").removeClass("visible-legend-box");
});
// end second modal - toggle legend

mapboxgl.accessToken =
  "pk.eyJ1Ijoid2FpeWFuMTk5NiIsImEiOiJjbTBwdTkxdnMwNWF4MnFvbG9yOTQ5aTdnIn0.bQNsCkvX2tmDRfaI4GHrzg";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/waiyan1996/cm1642if001uv01qk11qvfhy1",
  center: [-81.353806, 28.28678],
  // cooperativeGestures: true,
  zoom: 6,
  // preserveDrawingBuffer: true,
  customAttribution:
    'created by <a style="padding: 0 3px 0 3px; color:#ffffff; background-color: #DB3069;" target="_blank" href=http://www.geocadder.bg/en/portfolio.html>GEOCADDER</a>',
});

// start registering a new control position - "top-right"
function registerControlPosition(map, positionName) {
  if (map._controlPositions[positionName]) {
    return;
  }
  var positionContainer = document.createElement("div");
  positionContainer.className = `mapboxgl-ctrl-${positionName}`;
  map._controlContainer.appendChild(positionContainer);
  map._controlPositions[positionName] = positionContainer;
}
registerControlPosition(map, "top-center");
// end registering a new control position - "top-right"

var zoomButton = new mapboxgl.NavigationControl({ showCompass: false });
map.addControl(zoomButton, "bottom-right");

/* Adding custom control / custom button for chanigng base map style*/
class MapboxGLButtonControl {
  constructor({ className = "", title = "", eventHandler = evtHndlr }) {
    this._className = className;
    this._title = title;
    this._eventHandler = eventHandler;
  }

  onAdd(map) {
    this._btn = document.createElement("button");
    this._btn.className = "mapboxgl-ctrl-icon" + " " + this._className;
    this._btn.type = "button";
    this._btn.title = this._title;
    this._btn.onclick = this._eventHandler;

    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

// var currentStyle = "streets-v8";
// /* Event Handlers */
// function one(event) {
//   if (currentStyle === "streets-v8") {
//     currentStyle = "satellite-streets-v11";
//   } else {
//     currentStyle = "streets-v8";
//   }
//   map.setStyle("mapbox://styles/mapbox/" + currentStyle);
// }

/* Instantiate new controls with custom event handlers */
// const ctrlPoint = new MapboxGLButtonControl({
//   className: "toggle-layers-control",
//   title: "Change base map",
//   eventHandler: one,
// });

// map.addControl(ctrlPoint, "bottom-right");

// ctrlPoint._container.parentNode.className="mapboxgl-ctrl-top-center"

/* end adding custom control / custom button for changing the base map style*/

/* start legend custom control button */

/* Event Handlers */
// function two(event) {
//   $("div.toggle-legend-box").addClass("visible-legend-box");
// }

/* Instantiate new controls with custom event handlers */
// const ctrlTwoPoint = new MapboxGLButtonControl({
//   className: "toggle-legend-control",
//   title: "View legend",
//   eventHandler: two,
// });

// map.addControl(ctrlTwoPoint, "top-center");
// ctrlTwoPoint._container.parentNode.className="mapboxgl-ctrl-top-center"
/* end filter custom control button */

/* start filter custom control button */

/* Event Handlers */
function three(event) {
  $("div.toggle-filter-box").addClass("visible-filter-box");
}

/* Instantiate new controls with custom event handlers */
const ctrlThreePoint = new MapboxGLButtonControl({
  className: "toggle-filter-control",
  title: "View filter",
  eventHandler: three,
});

map.addControl(ctrlThreePoint, "top-center");
/* end filter custom control button */

// Add the geocoding control to the map.
var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  countries: "us",
  language: "en-US",
  placeholder: "Search for address ...",
});
map.addControl(geocoder, "top-center");
// End adding the geocoding control to the map.

var bounds = new mapboxgl.LngLatBounds();

var citiesArray = [];
/// loading POIs data from Google Sheets table///
$.getJSON(
  "https://sheets.googleapis.com/v4/spreadsheets/1rcN8-LWyq5p_K3yRHCrg5Quk3KidfhS3VkxYQTMiM04/values/Sheet1!A2:J3000?majorDimension=ROWS&key=AIzaSyCDonJ_1zGp6bpDjZAf-YaJaLeOqsFrZ6w",
  function (response) {
    response.values.forEach(function (marker) {
      var id = marker[0];
      var name = marker[1];
      var fullAddress = marker[2];


      // first filter - static
      var firstFilter = marker[4];
      var firstFilterSmallLetters = firstFilter
        .toLowerCase()
        .replace(/\s/g, "-");
      var firstFilterSmallLetters = firstFilterSmallLetters
        .replaceAll(",", "")
        .replaceAll("/", "-");

      // second filter - static - with icons
      var secondFilter = marker[5];
      var secondFilterSmallLetters = secondFilter
        .toLowerCase()
        .replace(/\s/g, "-");
      var secondFilterSmallLetters = secondFilterSmallLetters
        .replaceAll(",", "")
        .replaceAll("/", "-");

      // third filter - dynamic
      var thirdFilter = marker[6];
      var thirdFilterSmallLetters = thirdFilter
        .toLowerCase()
        .replace(/\s/g, "-");
      var thirdFilterSmallLetters = thirdFilterSmallLetters
        .replaceAll(",", "")
        .replaceAll("/", "-");

      citiesArray.push({
        thirdFilterName: thirdFilter,
        thirdFilterNameSmallletters: thirdFilterSmallLetters,
      });

      var postUrl = marker[8];

      var imageUrl = marker[9];

      var longitude = parseFloat(marker[3]);
      var latitude = parseFloat(marker[2]);

      // var description = marker[7];

      var selectedPointDetails =
        "<div data-second-type-visible='true' data-tool-visible='true' data-estimated-completion-visible='true' data-first-type='" +
        firstFilterSmallLetters +
        "' data-second-type='first-" +
        secondFilterSmallLetters +
        "' data-third-type='third-" +
        thirdFilterSmallLetters +
        "' class='sidebar-details-points " +
        firstFilterSmallLetters +
        " " +
        secondFilterSmallLetters +
        "' id='sidebar-details-point-id-" +
        id +
        "'>";

      selectedPointDetails += "<p class='point-title'>" + name + "</p>";

      selectedPointDetails +=
        "<div class='sidebar-points-additional-info'  id='sidebar-point-additional-info-" +
        id +
        "'></div></div>";

      $("#sidebar").append(selectedPointDetails);

      $("sidebar-point-additional-info-" + id).css("display", "none");

      bounds.extend([longitude, latitude]);

      var popupContent = "<div>";

      popupContent +=
        "<div class='first-popup-row'><div class='location-image'><img src='" +
        imageUrl +
        "'></div><div class='location-destination-address-group'><div class='location-destination'>" +
        name +
        "</div><div class='location-address'>Risk: <b>" +
        firstFilter + "</b> | Tier: <b>" + secondFilter + 
        "</b></div><div class='location-address'>Market: <b>" +
        thirdFilter +
        "</b></div><div class='location-address'><a class='popup-link' href='" + postUrl + "'>Website</a></div><div class='third-popup-row'><a target='_blank' href='https://www.google.com/maps/dir//" +
            latitude +
            "," +
            longitude +
            "'>Get Direction</a></div></div>";

      popupContent += "</div>";

      popup = new mapboxgl.Popup({ closeOnClick: false }).setHTML(popupContent);

      // create a HTML element for each feature
      var el = document.createElement("div");
      el.className = "marker";
      el.id = id;
      $(el).attr("data-first-type", "first-" + firstFilterSmallLetters);
      $(el).attr("data-second-type", "second-" + secondFilterSmallLetters);
      $(el).attr("data-third-type", "third-" + thirdFilterSmallLetters);

      $(el).attr("data-first-type-visible", "true");
      $(el).attr("data-second-type-visible", "true");
      $(el).attr("data-third-type-visible", "true");

      var markerObj = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(map);

      el.style.backgroundImage =
        "url(icons/" + secondFilterSmallLetters + ".svg)";

      el.addEventListener("click", (e) => {
        // flyToStoreOnMarkerClick(markerObj);
        createPopup(markerObj);

        // $("#sidebar-popup").css("display", "block");
        // $("#sidebar-popup").html(popupContent);
        // $("#sidebar").css("display", "none");

        $(".popup-sidebar-close-button").click(function () {
          $("#sidebar").css("display", "block");
          $("#sidebar-popup").css("display", "none");
          $(".mapboxgl-popup").remove();
        });

        e.stopPropagation();

        // scroll to the selected item in the sidebar
        var selectedItem = document.getElementById(
          "sidebar-details-point-id-" + id
        );
        selectedItem.scrollIntoView({ behavior: "smooth", inline: "start" });
        // end scrolling to the selected item in the sidebar

        $(".sidebar-details-points").removeClass("active");

        $("#sidebar-point-additional-info-" + id).css("display", "block");
        $("#sidebar-details-point-id-" + id).addClass("active");
      });

      $(".sidebar-details-points").click(function (e) {
        var currentSidebaritemId = e.currentTarget.id;
        var currentId = currentSidebaritemId.split("-")[4];

        if (currentId === id) {
          var popupContent = "<div>";

      popupContent +=
        "<div class='first-popup-row'><div class='location-image'><img src='" +
        imageUrl +
        "'></div><div class='location-destination-address-group'><div class='location-destination'>" +
        name +
        "</div><div class='location-address'>Risk: <b>" +
        firstFilter + "</b> | Tier: <b>" + secondFilter + 
        "</b></div><div class='location-address'>Market: <b>" +
        thirdFilter +
        "</b></div><div class='location-address'><a class='popup-link' href='" + postUrl + "'>Website</a></div><div class='third-popup-row'><a target='_blank' href='https://www.google.com/maps/dir//" +
            latitude +
            "," +
            longitude +
            "'>Get Direction</a></div></div>";

      popupContent += "</div>";

          // if (description) {
          //   popupContent +=
          //     "<p class='description-text'>" + description + "</p>";
          // }

          const popUps = document.getElementsByClassName("mapboxgl-popup");
          if (popUps[0]) popUps[0].remove();

          // popup = new mapboxgl.Popup({ closeOnClick: false }).setHTML(
          //   "<div>" + name + "</div>"
          // );
          popup = new mapboxgl.Popup({ closeOnClick: false }).setHTML(
            popupContent
          );

          var markerObj = new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .setPopup(popup)
            .addTo(map);

          // $("#sidebar-popup").css("display", "block");
          // $("#sidebar-popup").html(popupContent);
          // $("#sidebar").css("display", "none");

          popup.addTo(map);

          $(".popup-sidebar-close-button").click(function () {
            $("#sidebar").css("display", "block");
            $("#sidebar-popup").css("display", "none");
            $(".mapboxgl-popup").remove();
          });

          // flyToStoreOnMarkerClick(markerObj);
        }

        $(".sidebar-details-points").removeClass("active");

        $("#sidebar-details-point-id-" + currentId).addClass("active");
      });
    });

    // start unique and sorted alphabetically array with objects
    var citiesArrayUnique = Object.values(
      citiesArray.reduce(
        (acc, obj) => ({ ...acc, [obj.thirdFilterName]: obj }),
        {}
      )
    );
    citiesArrayUnique.forEach((currentThirdFilterElement) =>
      $("#list3 ul.items").append(
        '<li><input name="filter-by-third-type-input" id="' +
          currentThirdFilterElement.thirdFilterNameSmallletters +
          '" type="checkbox" value="third-' +
          currentThirdFilterElement.thirdFilterNameSmallletters +
          '" checked /><label for="' +
          currentThirdFilterElement.thirdFilterNameSmallletters +
          '">' +
          currentThirdFilterElement.thirdFilterName +
          "</label></li>"
      )
    );
    // end unique and sorted alphabetically array with objects

    map.on("zoomend", function () {
      var visiblePointsIds = getVisibleMarkers();
      $(".sidebar-details-points").each(function (
        sidebarNumber,
        sidebarElement
      ) {
        $(sidebarElement).css("display", "none");
        var idOnlyArray = $(sidebarElement).attr("id").split("-");
        var idOnly = idOnlyArray[4];
        visiblePointsIds.forEach(function (visiblePointId) {
          if (visiblePointId == idOnly) {
            $("#sidebar-details-point-id-" + idOnly).css("display", "block");
          }
        });
      });
    });

    map.on("moveend", function () {
      var visiblePointsIds = getVisibleMarkers();
      $(".sidebar-details-points").each(function (
        sidebarNumber,
        sidebarElement
      ) {
        $(sidebarElement).css("display", "none");
        var idOnlyArray = $(sidebarElement).attr("id").split("-");
        var idOnly = idOnlyArray[4];
        visiblePointsIds.forEach(function (visiblePointId) {
          if (visiblePointId == idOnly) {
            $("#sidebar-details-point-id-" + idOnly).css("display", "block");
          }
        });
      });
    });

    map.fitBounds(bounds, { padding: 100 });

    $(".mapboxgl-canvas").click(function () {
      $(".mapboxgl-popup").remove();
      checkList.classList.remove("visible");
      checkListTwo.classList.remove("visible");
      checkListThree.classList.remove("visible");
    });

    //////////////// open/close dropdown menu for term type filter
    var checkList = document.getElementById("list1");
    checkList.getElementsByClassName("anchor")[0].onclick = function (evt) {
      if (checkList.classList.contains("visible"))
        checkList.classList.remove("visible");
      else checkList.classList.add("visible");
    };
    //////////////

    //////////// open/close dropdown menu for active adult filter
    var checkListTwo = document.getElementById("list2");
    checkListTwo.getElementsByClassName("anchor")[0].onclick = function (evt) {
      if (checkListTwo.classList.contains("visible"))
        checkListTwo.classList.remove("visible");
      else checkListTwo.classList.add("visible");
    };
    ////////////////

    //////////// open/close dropdown menu for thirdFilter filter
    var checkListThree = document.getElementById("list3");
    checkListThree.getElementsByClassName("anchor")[0].onclick = function (
      evt
    ) {
      if (checkListThree.classList.contains("visible"))
        checkListThree.classList.remove("visible");
      else checkListThree.classList.add("visible");
    };
    ////////////////

    $("input[type='checkbox'][name='filter-by-first-type-input']").click(
      function () {
        var currentFirstFilter = $(this).val();
        console.log(currentFirstFilter);
        if ($(this).is(":checked")) {
          $("[data-first-type='" + currentFirstFilter + "']").each(function (
            index
          ) {
            $(this).attr("data-first-type-visible", "true");
            if (
              $(this).attr("data-second-type-visible") === "true" &&
              $(this).attr("data-third-type-visible") === "true"
            ) {
              $(this).css("display", "block");
            }
          });
        } else {
          $("[data-first-type='" + currentFirstFilter + "']").each(function (
            index
          ) {
            $(this).attr("data-first-type-visible", "false");
            $(this).css("display", "none");
          });
        }

        var visiblePointsIds = getVisibleMarkers();
        $(".sidebar-details-points").each(function (
          sidebarNumber,
          sidebarElement
        ) {
          $(sidebarElement).attr("data-second-type-visible", "false");
          $(sidebarElement).css("display", "none");
          var idOnlyArray = $(sidebarElement).attr("id").split("-");
          var idOnly = idOnlyArray[4];
          visiblePointsIds.forEach(function (visiblePointId) {
            if (visiblePointId == idOnly) {
              $(sidebarElement).css("display", "block");
              $(sidebarElement).attr("data-second-type-visible", "true");
            }
          });
        });
      }
    );

    $("input[type='checkbox'][name='filter-by-second-type-input']").click(
      function () {
        var currentSecondFilter = $(this).val();
        if ($(this).is(":checked")) {
          $("[data-second-type='" + currentSecondFilter + "']").each(function (
            index
          ) {
            $(this).attr("data-second-type-visible", "true");
            if (
              $(this).attr("data-first-type-visible") === "true" &&
              $(this).attr("data-third-type-visible") === "true"
            ) {
              $(this).css("display", "block");
            }
          });
        } else {
          $("[data-second-type='" + currentSecondFilter + "']").each(function (
            index
          ) {
            $(this).attr("data-second-type-visible", "false");
            $(this).css("display", "none");
          });
        }

        var visiblePointsIds = getVisibleMarkers();
        $(".sidebar-details-points").each(function (
          sidebarNumber,
          sidebarElement
        ) {
          $(sidebarElement).css("display", "none");
          var idOnlyArray = $(sidebarElement).attr("id").split("-");
          var idOnly = idOnlyArray[4];
          visiblePointsIds.forEach(function (visiblePointId) {
            if (visiblePointId == idOnly) {
              $("#sidebar-details-point-id-" + idOnly).css("display", "block");
            }
          });
        });
      }
    );

    $("input[type='checkbox'][name='filter-by-third-type-input']").click(
      function () {
        var currentThirdFilter = $(this).val();
        if ($(this).is(":checked")) {
          $("[data-third-type='" + currentThirdFilter + "']").each(function (
            index
          ) {
            $(this).attr("data-third-type-visible", "true");
            if (
              $(this).attr("data-first-type-visible") === "true" &&
              $(this).attr("data-second-type-visible") === "true"
            ) {
              $(this).css("display", "block");
            }
          });
        } else {
          $("[data-third-type='" + currentThirdFilter + "']").each(function (
            index
          ) {
            $(this).attr("data-third-type-visible", "false");
            $(this).css("display", "none");
          });
        }

        var visiblePointsIds = getVisibleMarkers();
        $(".sidebar-details-points").each(function (
          sidebarNumber,
          sidebarElement
        ) {
          $(sidebarElement).attr("data-third-type-visible", "false");
          $(sidebarElement).css("display", "none");
          var idOnlyArray = $(sidebarElement).attr("id").split("-");
          var idOnly = idOnlyArray[4];
          visiblePointsIds.forEach(function (visiblePointId) {
            if (visiblePointId == idOnly) {
              $(sidebarElement).css("display", "block");
              $(sidebarElement).attr("data-third-type-visible", "true");
            }
          });
        });
      }
    );

    map.on("render", function () {
      getVisibleMarkers();
    });

    function scrollToTheSelectedItem(currentPointId) {
      $(".sidebar-details-points").removeClass("active");

      $("#sidebar-point-additional-info-" + currentPointId).css(
        "display",
        "block"
      );
      $("#sidebar-details-point-id-" + currentPointId).addClass("active");

      // scroll to the selected item in the sidebar
      var selectedItem = document.getElementById(
        "sidebar-details-point-id-" + currentPointId
      );
      selectedItem.scrollIntoView({ behavior: "smooth", inline: "start" });
      // end scrolling to the selected item in the sidebar
    }

    // function flyToStoreOnSidebarClick(currentFeature) {
    //   map.flyTo({
    //     center: currentFeature["_lngLat"],
    //     zoom: 14,
    //     offset: [0, -150],
    //     // speed: 20,
    //   });
    // }

    // function flyToStoreOnMarkerClick(currentFeature) {
    //   map.flyTo({
    //     center: currentFeature["_lngLat"],
    //     offset: [0, -150],
    //     // speed: 20,
    //   });
    // }

    /**
     * Create a Mapbox GL JS `Popup`.
     **/
    function createPopup(currentFeature) {
      const popUps = document.getElementsByClassName("mapboxgl-popup");
      if (popUps[0]) popUps[0].remove();

      const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature["_lngLat"])
        .setHTML(currentFeature["_popup"]["_content"]["innerHTML"])
        .addTo(map);
      $("#sidebar-popup").html(
        currentFeature["_popup"]["_content"]["innerHTML"]
      );
    }

    /* check if point is withing map view */
    function intersectRect(r1, r2) {
      return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
      );
    }

    function getVisibleMarkers() {
      var cc = map.getContainer();
      var els = cc.getElementsByClassName("marker");
      var ccRect = cc.getBoundingClientRect();
      var visibles = [];
      var visiblesIds = [];
      for (var i = 0; i < els.length; i++) {
        var el = els.item(i);
        var elRect = el.getBoundingClientRect();
        intersectRect(ccRect, elRect) && visibles.push(el);
      }
      if (visibles.length > 0) {
        visibles.forEach(function (visible) {
          var visibleId = $(visible).attr("id");
          visiblesIds.push(visibleId);
        });
      }
      return visiblesIds;
    }
    /* end checking if point is withing map view */
  }
);

// map.on('render', function () {
//   getVisibleMarkers()
// })

$(".mapboxgl-canvas").click(function () {
  $("#sidebar").css("display", "block");
  $("#sidebar-popup").css("display", "none");
});

// Create our number formatter.
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
