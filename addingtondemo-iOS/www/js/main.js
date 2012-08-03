// Name: Christopher Addington
// Assignment: AVF Demo
// AVF Term 1207

console.log("Hello!");

$(function(){

    var toggleControls = function(n){
        var displayNone = { 'display': 'none' };
        var displayInline = { 'display': 'inline' };
        var displayBlock = { 'display': 'block' };
  
        switch(n){
            case "on":
                $('#teamForm').css(displayNone)
                $('#clearData').css(displayInline)
                $('#displayData').css(displayNone)
                $('#addNew').css(displayInline)
                break;
            case "off":
                $('#teamForm').css(displayBlock)
                $('#clearData').css(displayInline)
                $('#displayData').css(displayInline)
                $('#addNew').css(displayNone)
                $('#items').css(displayNone)
                break;
            default:
                return false;
        }
    }

    var saveLocal = function(key) {
        if(!key){
           var id                  = Math.floor(Math.random()*42000000); 
        }else{
            id = key;
        }
        var item                = {};
            item.sports         = ["Sport: ", $('#selectsport').val()];
            item.teamname       = ["Name: ", $('#teamname').val()];
            item.teamsize       = ["Team Size: ", $('#teamsize').val()];
            item.availabletime  = ["Only evening games: ", $('#availabletime').val()];
            item.nextdate       = ["Next available date: ", $('#nextdate').val()];
            item.notes          = ["Notes: ", $('#notes').val()];
        //Save data into Local Storage: Use Stringify to convert our object to a string
        localStorage.setItem(id, JSON.stringify(item));
        alert("Team saved!");
    }

  
    var getData = function(){
        toggleControls("on");
        if(localStorage.length === 0){
            alert("There is no data in storage.  Please add a team.");
            window.location.reload();
            return false;
        }
        $('#displaycontent')
            .append($('<div id="items"></div>'))
        ;
        $('<ul id="itemsUl"></ul>')
            .appendTo('#items')
        ;
        $('#items').css({
            'display': 'block'
        });
        for(i = 0, j = localStorage.length; i < j; i++){
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            var obj = JSON.parse(value);
            $('#itemsUl')
                .append('<li><h3><img src="' + obj.sports[1] + '_10px.png" />' + obj.sports[1] + '</h3></li')
            ;
            $('#itemsUl li:last')
                .append('<ul>' + obj.sports[1] + '</ul>')
            getImage(obj.sports[i]);
            for (var n in obj){
                var optSubText = $('<li id="subLi">' + obj[n][0] + " " + obj[n][1] + '</li');
                var subLi = $('#subLi');
                $('#itemsUl li:last ul:last')
                    .append(optSubText)
                    .append('<li id="linksLi"></li>')
                ;
            }            
            makeItemLinks(key); //Create edit/delete links for each item.
        }
    console.log(obj);
    }
    
    //Function to get a unique image for each sport.
    function getImage(catName){
        $('#itemsUl li:last ul:last')
            .append('<li><img src="' + catName + '".png"')
        ;        
    }
    
    //makeItemLinks function
    //Incorporates edit/delete links for local storage on display.
    var makeItemLinks = function (key){
        var linksLi =   $('#itemsUl li:last ul:last li:last');
            linksLi.key = key;
        linksLi
            .append('<a id="editLink" href="#">Edit Team</a>')
            .append('<br>')
            .append('<a id="deleteLink" href="#">Delete Team</a>')
        ;
        $('#editLink').on("click", editItem);
        $('#deleteLink').on("click", deleteItem);
    }
    
    var editItem = function(){
        //Retrieve data from specified team.
        var value = localStorage.getItem(this.key);
        var item = JSON.parse(value);
        
        //Display form
        toggleControls("off");
        
        //Populate form with local storage.
        $('#selectsport').val(item.sports[1]);
        $('#teamname').val(item.teamname[1]);
        $('#teamsize').val(item.teamsize[1]);
        $('#availabletime').val(item.availabletime[1]);
        $('#nextdate').val(item.nextdate[1]);
        $('#notes').val(item.notes[1]);
        
        //Remove listener from Add Team submission.
        $('#submit').unbind();
        //Change Add Team value to Edit Team
        $('#submit').replaceWith('<input type="submit" id="submit" value="Edit" data-icon="check" data-iconpos="left" data-iconshadow="true" data-shadow="true" data-theme="e" />');
        $('#submit').on("click", validate);
        $('#submit').key = this.key;
    }
    
    var deleteItem = function(){
        var ask = confirm("Are you sure you want to delete this team?");
        if (ask == true){
            localStorage.removeItem(this.key);
            alert("The team was deleted.");
            window.location.reload();
        }else{
            alert("Team was not deleted.");
        }
    }
    
    var clearLocal = function(){
        if(localStorage.length === 0){
            alert("There is no data to clear.");
            window.location.reload();
        }else{
            localStorage.clear();
            alert("All teams have been deleted!");
            window.location.reload();
            return false;
        }
    }
    
    var validate = function(e){
        //Define elements to validate
        var getSport = $('#selectsport');
        var getTeamName = $('#teamname');
        var getNextDate = $('#nextdate');
        
        //Reset error messages
        errMsg.html("");
        getSport.css({
            'border': '1px solid black'
        });
        getTeamName.css({
            'border': '1px solid black'
        });

        //Get error messages
        var messageAry = [];
        //Group validation
        if (getSport.val() === ""){
            var sportError = "Please choose a sport.";
            getSport.css({
                'border': '1px solid red'
            });
            messageAry.push(sportError);
        }
        //Team Name validation
        if (getTeamName.val() === ""){
            var teamNameError = "Please enter a team name."
            getTeamName.css({
                'border': '1px solid red'
            });
            messageAry.push(teamNameError);
        }
        //Next Date validation
        if (getNextDate.val() === ""){
            var nextDateError = "Please enter a date."
            getNextDate.css({
                'border': '1px solid red'
            });
            messageAry.push(nextDateError);
        }
        
        //Display errors
        if (messageAry.length >= 1){
            for( var i=0, j=messageAry.length; i<j; i++){
                $('#errors')
                    .append('<li></li>')
                ;
                $('#errors li:last')
                    .html(messageAry[i]);
            }
        return false;
        }else{
            saveLocal(this.key);
        }
    }

    var urlVars = function(){
    	var urlData = $($.mobile.activePage).data("url");
        var urlParts = urlData.split('?');
        var urlPairs = urlParts[1].split('&');
        var urlValues = {};
        for (var pair in urlPairs) {
        	var keyValue = urlPairs[pair].split('=');
        	var key = decodeURIComponent(keyValue[0]);
        	var value = decodeURIComponent(keyValue[1]);
        	urlValues[key] = value;
        }
        	return urlValues;
    };

    //Populate page with specific team data including Edit & Delete links
    $('#sport').live("pageshow", function(){
    	var sport = urlVars()["sport"];
    	var team = urlVars()["team"];
    	var date = urlVars()["nextdate"];
    	console.log(sport);
    	console.log(team);
    	console.log(date);

    	$.couch.db("pleague-app").openDoc(sport, {
    		success: function(answer) {
    			//Declaration of value variables, not sure how to reach these at this point though.
    			
    			$('#sportItems').append(
    				'<h1>' + sport + '</h1>' +
    					'<li id="' + team + '"> Team Name: ' + team + '></li>' + 
    					'<li id="' + date + '"> Next Date: ' + date + '></li>' + 
    					'<li><a href="#" id="editSTeam">Edit Team</a></li>' +
    					'<li><a href="#" id="deleteSTeam">Delete Team</a></li>'
    			).append(
    				$('<li id="' + team + '> Team Name: ' + team + '></li>')	
    			).append(
    				$('<li id="' + date + '> Next Date: ' + date + '></li>')
    			)
    		}
    	});
    });    
    //Geolocation feature for Demo landing page.
        //If successful, append concatenated snapshot image to newly-loaded page
    var successful = function (position) {
        $('#geoLink').click();
    var currentLoc = "<img src='http://maps.googleapis.com/maps/api/staticmap?center=" + position.coords.latitude+","+ position.coords.longitude + "&zoom=15&size=500x500&maptype=hybrid&markers=color:red%7Clabel:X%7C" + position.coords.latitude+","+ position.coords.longitude+"&sensor=false' width=100% />";
        $('#geoSnapshot').html(currentLoc);
    }
  
        //If unsuccessful, automatically notify User why
    var unsuccessful = function (error) {
        alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
    }
  
    //Geo snapshot function with success/failure
    $('#geo').on('click', function(){
        navigator.geolocation.getCurrentPosition(successful, unsuccessful);
    });
  
    //Notification feature for Demo landing page.
    $('#notify').on('click', function(){
        alert("Notification successful!");
        navigator.notification.beep(1);
    });

    //Populate edit form with info
    var errMsg = $('#errors');
    //Link/Submit Click events
  $('#displayData').on("click", getData);
  $('#clearData').on("click", clearLocal);
  $('#submit').on("click", validate);
});