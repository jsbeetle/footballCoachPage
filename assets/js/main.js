
    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
    }); 



    // global variables, html containers, data 
    var playersContainer = $('.players-list');
    var playerInfo = $('.player-profile');
    var fieldContainer = $('.field');
    var fieldForward = $('.forward-area');
    var fieldMidfielder = $('.midfielder-area');
    var fieldDefender = $('.defender-area');
    var fieldKeeper = $('.goalkeeper-area');
    var profileCloseButton = $('.profile-close');
    var totalFieldPlayers = 11;
    var playerListData = {};
    var playerProfileData = {};

    playerInfo.hide();


    // Enum represents player role
    var playerRoles = {
        goalk: { id : 1, name: "goalkeeper", Description : "" },
        def: { id : 2, name: "defender", Description : "" },
        mid: { id : 3, name: "midfielder", Description : "" },
        forw: { id : 4, name: "forward", Description : "" }
    }

 
    // class represents team scheme
    var teamScheme = function(defAmount, midAmount, forwAmount){
        this.goalkAmount = 1;
        this.defAmount = defAmount;
        this.midAmount = midAmount;
        this.forwAmount = forwAmount;
    }

    // default scheme
    var chosenScheme = new teamScheme(4,4,2);


    // class represents player profile
    var playerDescription = function(number, name, imgUrl, role, age, nationality, descr){
        
        this.number = number;
        this.name = name;
        this.imgUrl = imgUrl;
        this.role = role;
        this.age = age;
        this.nationality = nationality;
        this.descr = descr;

        this.htmlMarkup = function(){
             return '<div class="profile-name">' + name +
                        '<div class="profile-close">' + '</div>' +
                    '</div>' +
                    '<img src="'+ imgUrl + '">' +
                    '<div class="profile-data">' +
                        '<div class="profile-age">' + ' age: ' + age + '</div>' +
                        '<div class="profile-number">' + ' number: ' + number + '</div>' +
                        '<div class="profile-role">' + ' player role: ' + role + '</div>' +
                        '<div class="profile-nationality">' + ' nationality: ' + nationality + '</div>' +
                    '</div>' +
                    '<div class="profile-description">' + descr + '</div>'
        };

        this.appendToField = function(fieldEl){
             fieldEl.append(this.htmlMarkup);
        };
    
    }

   

    // load players data from json file
    var loadPlayersData = function(){
       // console.log('loadPlayersData');
      
        $.ajax({
            url: "assets/data/first_team.json",
            dataType: "json"
           }
        ).then(
            function(data, textStatus, jqXHR){
                //console.log('Data received', data);
                loadPlayersDescription();
                playerListData = data;
                renderPlayers(playerListData);
            },

            function(jqXHR, textStatus, errorThrown) {
                var errorMes = "Error:" + textStatus + "\njqXHR:" + jqXHR + "\nerrorThrown:" + errorThrown;
                $('#myModal').modal('show');
                $('.modal-title').text("Ajax Error"); 
                $('.modal-body p').text(errorMes);
            }
        );
    };



    // load players description data from json file
    var loadPlayersDescription = function(){
       // console.log('loadPlayersData');
      
        $.ajax({
            url: "assets/data/players_description.json",
            dataType: "json"
           }
        ).then(
            function(data, textStatus, jqXHR){
               playerProfileData = data;
               console.log(playerProfileData);
                
            },

            function(jqXHR, textStatus, errorThrown) {
                var errorMes = "Error:" + textStatus + "\njqXHR:" + jqXHR + "\nerrorThrown:" + errorThrown;
                $('#myModal').modal('show');
                $('.modal-title').text("Ajax Error"); 
                $('.modal-body p').text(errorMes);
            }
        );
    };



    // render players into UI
    function renderPlayers(playerList){

        playersContainer.empty();
        //console.log('render');

        for (var i=0; i < playerList.length; i++) {


            var playerEntry = $('<div>').addClass('player-entry info').attr('draggable', true).attr('player-role', playerList[i].role).attr('id','player-' + playerList[i].number);
           // .attr('data-toggle','tooltip').attr('data-placement', 'right').attr('data-original-title', playerList[i].role);
            var playerNumber = $('<span>').addClass('player-number');
            var playerInfo = $('<span>').addClass('player-info');
            var playerName = $('<p>').addClass('player-name');
            var playerNationality = $('<p>').addClass('player-nationality');
            var playerFieldRole = $('<p>').addClass('player-fieldrole');

            playerNumber.text(playerList[i].number).appendTo(playerEntry);
            var imgUrl = playerList[i].imgurl;
            $('<img>').attr('src', imgUrl).appendTo(playerEntry);
            playerName.text(playerList[i].name).appendTo(playerInfo);
            playerNationality.text(playerList[i].nationality).appendTo(playerInfo);
            playerFieldRole.text(playerList[i].role.toUpperCase().substring(0,1)).appendTo(playerInfo);
            playerInfo.appendTo(playerEntry);

            playersContainer.append(playerEntry);
        }
    }


    $("#scheme-selector").change(function() {
        clearData();
        
        var selectedShceme = $(this).val();
        if (selectedShceme == 1){
            chosenScheme = new teamScheme(4,4,2);
        }
        
        if (selectedShceme == 2){
            chosenScheme = new teamScheme(4,3,3);
        }

        if (selectedShceme == 3){
            chosenScheme = new teamScheme(3,4,3);
        }
    });


    
    // show player info
    playersContainer.on('click', '.player-entry', function(ev){ 
        playersContainer.hide();
        playerInfo.show(); 

        var playerId = $(this).attr('id');
        
        // get current user info from profile data
        currentPlayerProfile = $.grep(playerProfileData, function (elem, index) {
            return elem.id == playerId;
        }); 

        var userAge = currentPlayerProfile[0].age;
        var userDescr = currentPlayerProfile[0].descr;
        var userNumber = $(this).find('.player-number').text();
        var userName = $(this).find('.player-name').text();
        var userNationality = $(this).find('.player-nationality').text();
        var userImgUrl =  $(this).find('img').attr('src');
        var userRole = $(this).find('.player-fieldrole').text();
         
        var playerData = new playerDescription(userNumber, userName, userImgUrl, userRole, userAge, userNationality, userDescr);
        playerData.appendToField(playerInfo);
        
      
    });

    
    // hide player info
    $(document).on('click', '.profile-close', function(ev){ 
        playerInfo.empty();
        playerInfo.hide();  
        playersContainer.show();
    });

  
    // start drugging player element from list to the field
    playersContainer.on('dragstart', '.player-entry', function(ev){
        console.log('start drag:', ev, ev.currentTarget.id);
        var playerRole = $(this).attr('player-role');
        $("." + playerRole + "-area").css("background-color", "rgba(0,0,0,0.4)");
        ev.originalEvent.dataTransfer.setData("text", ev.currentTarget.id);
    });

    
    // start drugging player element from field to the list
    fieldContainer.on('dragstart', '.player-entry', function(ev){ 
        var playerRole = $(this).attr('player-role');
        ev.originalEvent.dataTransfer.setData("text", ev.currentTarget.id);
       
    });

      
    // event when drag n drop event failed
    playersContainer.on('dragend', '.player-entry', function(ev){ 
        var playerRole = $(this).attr('player-role');
        $("." + playerRole + "-area").css("background-color", "transparent");

    });  


    // function which allows drop elements
    function allowDrop(ev) {
        ev.preventDefault();
    }


    // end of drugging player element from list to the field
    function dropToTheField(ev) {
        ev.preventDefault();
        var playersCount = $('.field .player-entry').length;
        var data = ev.dataTransfer.getData("text");

            if (playersCount > totalFieldPlayers){
                alert("You have 11 players are on the field!");
                return false;
            }
        
        var movedPlayer = $("#"+ data);
        var movedPlayerRole = movedPlayer.attr('player-role');
        var goalkeepersAmount = fieldContainer.find($("[player-role=goalkeeper]")).length;
        var defendersAmount = fieldContainer.find($("[player-role=defender]")).length;
        var midfieldersAmount = fieldContainer.find($("[player-role=midfielder]")).length;
        var forwardsAmount = fieldContainer.find($("[player-role=forward]")).length;
        
        if (movedPlayerRole == playerRoles.goalk.name && goalkeepersAmount == chosenScheme.goalkAmount){
            alert("You already have a goalkeeper on the field");
                return false;
        }

        if (movedPlayerRole == playerRoles.def.name && defendersAmount == chosenScheme.defAmount){
            alert("This scheme allows only " + chosenScheme.defAmount + " defenders");
                return false;
        }

        if (movedPlayerRole == playerRoles.mid.name && midfieldersAmount == chosenScheme.midAmount){
            alert("This scheme allows only " + chosenScheme.midAmount + " midfielders");
                return false;
        }

        if (movedPlayerRole == playerRoles.forw.name && forwardsAmount == chosenScheme.forwAmount){
            alert("This scheme allows only " + chosenScheme.forwAmount + " forwards");
                return false;
        }
        
        
       var thisTarget = $(ev.target);
       var thisTargetRole = $(ev.target).attr("field-role");

      

        if (thisTargetRole == movedPlayerRole) {
            thisTarget.append(movedPlayer);
            $("." + movedPlayerRole + "-area").css("background-color", "transparent");
        } else {
            alert("Please drop this player to the " + movedPlayerRole + " section");
            $("." + movedPlayerRole + "-area").css("background-color", "transparent");
            return false;
        }


    }


    // end of drugging player element from field to the list
    function dropToTheList(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        var movedPlayer = $("#"+ data);
        playersContainer.append(movedPlayer);
    }

    
    // clear field html and load data
    function clearData(){
        loadPlayersData();
        fieldForward.empty();
        fieldMidfielder.empty();
        fieldDefender.empty();
        fieldKeeper.empty();  
    }




    loadPlayersData();      
    