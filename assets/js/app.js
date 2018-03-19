// document on page load
$(document).ready(function() {

    // global variables
    let lat = "";
    let lon = "";
    let onLoadSeatGeekQuery = "";

    // if session is still running, don't ask for GeoLocation, and store the lon and lat variables so that we can use it in the query. Then call the function with the GET method
    if(sessionStorage.getItem("lat") !== null && sessionStorage.getItem("lon") !== null) {
        lat = sessionStorage.getItem("lat");
        lon = sessionStorage.getItem("lon");
        onLoadSeatGeekQuery = "https://api.seatgeek.com/2/events?lat=" + lat + "&lon=" + lon + "&range=20mi&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
        seatGeekApiCall(onLoadSeatGeekQuery);
    } 
    // else ask for the GeoLocation
    else {
        geoFindMe();
    }
    

    // function to get/ask geolocation of user
    function geoFindMe(){
        // if geolocation is not supported in user's browser, set up a default value for the lattitude and longitude
        if(!navigator.geolocation){
            sessionStorage.setItem("lat", "41.881832");
            sessionStorage.setItem("lon", "-87.623177");

            // store the latitude and longitude in the variable
            lat = sessionStorage.getItem("lat");
            lon = sessionStorage.getItem("lon");

            // seatgeek query
            onLoadSeatGeekQuery = "https://api.seatgeek.com/2/events?lat=" + lat + "&lon=" + lon + "&range=" + 20 +  "mi&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
            
            // Function to display data on home page (with default geolocation) 
            seatGeekApiCall(onLoadSeatGeekQuery);
            return;
        }
        // If user clicks on "Allow", save "latitude" and "longitude" to session storage of your browser 
        function success(position){
            sessionStorage.setItem("lat", position.coords.latitude);
            sessionStorage.setItem("lon", position.coords.longitude);
            lat = sessionStorage.getItem("lat");
            lon = sessionStorage.getItem("lon");
            onLoadSeatGeekQuery = "https://api.seatgeek.com/2/events?lat=" + lat + "&lon=" + lon + "&range=20mi&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
            // Function to display data on home page (with user's geolocation)
            seatGeekApiCall(onLoadSeatGeekQuery);
        }
        // If user click on "Block", save default "latitude" and "longitude" to session storage of your browser
        function error(){
            sessionStorage.setItem("lat", "41.881832");
            sessionStorage.setItem("lon", "-87.623177");
            lat = sessionStorage.getItem("lat");
            lon = sessionStorage.getItem("lon");
            onLoadSeatGeekQuery = "https://api.seatgeek.com/2/events?lat=" + lat + "&lon=" + lon + "&range=20mi&client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";
            // Function to display data on home page (with default geolocation)
            seatGeekApiCall(onLoadSeatGeekQuery);
        }
        // get the current position based on the success and error functions
        navigator.geolocation.getCurrentPosition(success, error);
    }
    console.log("lat: " + lat);
    console.log("lon: " + lon);

    // function that will display the data on the home page based on the user's geolocation
    function seatGeekApiCall(query){
        $.ajax({
            url: query,
            type: 'GET'
        }).done(function(data) {
            console.log(data);
            displaySeatGeekEvent(data, "events");
        })
    }

    // function that takes in the data and the event type as a parameter
    function displaySeatGeekEvent(data, eventType) {
        // initialize variable record length which is the length of the events/perfomers/venues that come up
        let recordLength = 0;

        if(eventType === "events") {
            recordLength = data.events.length;
        }
        else if(eventType === "performers") {
            recordLength = data.performers.length;
        }
        else if (eventType === "venues"){
            recordLength = data.venues.length;
        }
        // if the record length is greater than zero...
        if(recordLength > 0){
            // loop through the records
            for(var i=0; i < recordLength; i++) {
                // using JQuery to build the html
                const card = $("<div class='card'></div>");
                const cardHeader = $("<div class='card-header' style='background-color:#8bd6ba; color: white;'></div>");
                const cardBody = $("<div class='card-body' style='background-color:#d3d3d3'></div>");
                const row = $("<div class='row'></div>");
                // this is the left side of the column, which contains the image of the event
                const imageColumn = $("<div class='col-md-2'></div>");
                const img = $("<img class='img-fluid rounded'>");
                // this is the right side of the column, which contains information of the event and the "more info" button
                const contentColumn = $("<div class='col-md-10'></div>");
                const btnMoreInfo = $("<button class='btn btn-secondary btn-more-info'>More Info</button>");
            
                // if the eventType is "events"...
                if(eventType === "events"){
                    // if there is an image for the event in the loop, then display that image from the data. Else display the logo
                    if(data.events[i].performers[0].image !== null) {
                        // gives the img variable an attribute src = image in the data
                        img.attr("src", data.events[i].performers[0].image);
                    } else {
                        // if no image, give the img variable an attribute src = logo image
                        img.attr("src", "assets/images/logo.jpeg");
                    }

                    // if there is an 'events' type, then add two attributes to the btnMoreInfo button. Add a record-id, and event-type
                    btnMoreInfo.attr("record-id", data.events[i].id);
                    btnMoreInfo.attr("event-type", eventType);
                    
                    // add the title of the event in the html of the cardHeader
                    cardHeader.html(data.events[i].title);

                    // add the venue name of the event, datetime of the event which is formatted in moment, and the venue address in the html of contentColumn
                    contentColumn.html(data.events[i].venue.name + " - " + moment(data.events[i].datetime_local).format("MMMM Do YYYY, h:mm:ss a") + 
                    "<br>" + data.events[i].venue.address + ", " + data.events[i].venue.extended_address + "<br>");
                }
                // else if the eventType is "performers"...
                else if(eventType === "performers"){
                    // if there is an image for the performer then display that image or else display the logo image.
                    if(data.performers[i].image !== null) {
                        // gives the img variable an attribute src = image in the data
                        img.attr("src", data.performers[i].image);
                    } else {
                        // if no image, give the img variable an attribute src = logo image
                        img.attr("src", "assets/images/logo.jpeg");
                    }

                    // if there is an 'performers' type, then add two attributes to the btnMoreInfo button. Add a record-id, and event-type
                    btnMoreInfo.attr("record-id", data.performers[i].id);
                    btnMoreInfo.attr("event-type", eventType);

                    // add the name of the performers to the cardHeader html and type of performer to the contentColumn html
                    cardHeader.html(data.performers[i].name);
                    contentColumn.html(data.performers[i].type + "<br>");
                }
                // else if the eventType is "venues"
                else if(eventType === "venues") {
                    // give the image attribute of the logo, give the btnMoreInfo two attributes, and give the cardHeader html the venue name and the contentColumn html the venue city.
                    img.attr("src", "assets/images/logo.jpeg");                    
                    btnMoreInfo.attr("record-id", data.venues[i].id);
                    btnMoreInfo.attr("event-type", eventType);
                    cardHeader.html(data.venues[i].name);
                    contentColumn.html(data.venues[i].city + "<br>");
                }            
                
                // at the end of the all this, append the btnMoreInfo to the contentColumn, append the img to the imageColumn.
                contentColumn.append(btnMoreInfo);
                imageColumn.append(img);
                
                // then append the image and content Column to the row
                row.append(imageColumn);
                row.append(contentColumn);

                // then append the row to the card body and the cardBody to the card.
                cardBody.append(row);
                card.append(cardHeader);
                card.append(cardBody);

                // then append the card to the html file that has the class "primary-content"
                $(".primary-content").append(card);
            }
        } else {
            // if there is no recordLength found, then call the function noDataFound();
            noDataFound();
        }
    }

    // displays the proper message when the API doesn't have any record
    function noDataFound() {
        var card = $("<div class='card'></div>");
        var cardHeader = $("<div class='card-header'style='background-color:#8bd6ba; color: white;'></div>");
        var cardBody = $("<div class='card-body'style='background-color:#d3d3d3'></div>");
        var row = $("<div class='row'></div>");

        var innerRow = $("<div class='row'></div>");

        var imageColumn = $("<div class='col-md-2'></div>");
        var img = $("<img width='100px' height='100px' src='assets/images/sorry.jpg'>");
        var contentColumn = $("<div class='col-md-10'></div>");

        cardHeader.html("Sorry, we couldn't find any data !");
        imageColumn.append(img);
        
        innerRow.append(imageColumn);

        cardBody.append(innerRow);

        card.append(cardHeader);
        card.append(cardBody);

        $(".primary-content").append(card);
    }

    // function for onclick of the html element that has class btn-more-info
    $(document.body).on("click", ".btn-more-info", function(){
        // empty the primary content on the page
        $(".primary-content").html('');

        // grab the event id and store it to the value
        const eventID = $(this).attr("record-id");
        const eventType = $(this).attr("event-type");

        // url query for specific seat geek event
        const sgEventURL = "https://api.seatgeek.com/2/" + eventType + "/" + eventID + "?client_id=OTM3ODIzNHwxNTA4ODAxNzUyLjY0";

        // ajax call to GET the information from the API
        $.ajax({
            url: sgEventURL,
            method: "GET"
        }).done(function(response){
            // store the data into variables
            var eventName = response.title;
            console.log(response);
            var eventCard = $("<div class='card'></div>");
            var eventCardHeader = $("<div class='card-header' style='background-color:#8bd6ba; color: white;'></div>");
            var eventCardBody = $("<div class='card-body'style='background-color:#d3d3d3'></div>");

            /* first row of the card */
            var eventCardRow = $("<div class='row'></div>");

            var eventCardImageColumn = $("<div class='col-md-2'></div>");
            var eventImg = $("<img class='rounded' width='100px' height='100px'>");
            
            var eventCardContentColumn = $("<div class='col-md-10'></div>");
            var eventStreetLocation = $("<h5></h5>");
            var eventStreetAddress = $("<h5></h5>");
            var hr = $("<hr>");
            var heading = $("<h4>Price Information</h4>");
            var price = $("<p></p>");
            var eventButton = $("<a class='btn btn-secondary' target='_blank'>Grab Tickets!</a>");

            if(eventType === "events"){
                if(response.performers[0].image !== null){
                    eventImg.attr("src", response.performers[0].image);
                } else {
                    eventImg.attr("src", "assets/images/logo.jpeg");
                }

                eventButton.attr("href", response.url);
                eventCardHeader.html(response.title);
                eventStreetLocation.html(response.venue.name + " - " + moment(response.datetime_local).format("MMMM Do YYYY, h:mm:ss a"));
                eventStreetAddress.html(response.venue.address + ", " + response.venue.extended_address);

                var averagePrice = checkNull(response.stats.average_price);
                var highestPrice = checkNull(response.stats.highest_price);
                var listingCount = checkNull(response.stats.listing_count);
                var lowestPrice = checkNull(response.stats.lowest_price);
                var goodDeals = checkNull(response.stats.lowest_price_good_deals);

                price.html("<strong>Average Price : " + averagePrice + "<br>" +
                           "Highest Price : " + highestPrice + "<br>" + 
                           "Listing Count : " + listingCount + "<br>" + 
                           "Lowest Price : " + lowestPrice + "<br>" + 
                           "Lowest Price Good Deals : " + goodDeals + "</strong><br>");
            } else if (eventType === "venues") {
            }

            /* appending everything into the card */
            eventCardImageColumn.append(eventImg);
            eventCardContentColumn.append(eventStreetLocation);
            eventCardContentColumn.append(eventStreetAddress);
            eventCardContentColumn.append(hr);
            eventCardContentColumn.append(heading);
            eventCardContentColumn.append(price);
            eventCardContentColumn.append(eventButton);

            eventCardRow.append(eventCardImageColumn);
            eventCardRow.append(eventCardContentColumn);

            eventCardBody.append(eventCardRow);
            eventCard.append(eventCardHeader);
            eventCard.append(eventCardBody);

            /* add the event card into the primary content container */
            $(".primary-content").html(eventCard);

            // call the function displayMap and displayWeather to display those two on the page
            // display map will take in two parameters, which are the lattitude and longitude of the venue's location
            displayMap(response.venue.location.lat, response.venue.location.lon);
            // displayWeather(response.datetime_local, response.venue.location.lat, response.venue.location.lon);
        });
    });

    // what to do if one of the stats from the response is missing
    function checkNull(param){
        if(param === null)
            return "N/A";
        else
            return "$ " + param;
    }

    // function that will display the map of the location
    function displayMap(lat, lon){
        // create the card
        var row = $("<div class='row weather-map'></div>");
        var mapColumn = $("<div class='col-md-8'></div>");
        var mapCard = $("<div class='card map-card'></div>");
        var mapCardHeader = $("<div class='card-header text-white' style='background-color:#8bd6ba;'>Map</div>");
        var mapCardBody = $("<div class='card-body map-holder' id='map-area'></div>");

        // append everything together
        mapCard.append(mapCardHeader);
        mapCard.append(mapCardBody);
        mapColumn.append(mapCard);

        row.append(mapColumn);
        $(".primary-content").append(row);

        // call the initMap function using the lat and lon parameters
        initMap(lat, lon);
    }

    // function that will initialize the map
    function initMap(lat, lon){
        const geoLocation = {lat: lat, lng: lon};
        const map = new google.maps.Map(document.getElementById('map-area'), {
            zoom: 15,
            center: geoLocation
        });

        // marker for the position of the venue on the map
        var marker = new google.maps.Marker({
            position: geoLocation,
            map: map
        });
    }
});