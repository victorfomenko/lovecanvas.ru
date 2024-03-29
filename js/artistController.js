app.controller("artistController", function($scope, $state, $http, $timeout, Session){
    var artistId = $state.params.artistId,
        artistData;
    $http.post('/ajax/getArtistInfo.php', artistId)
        .success(function(data){
            artistData = data;
        })
        .error(function(){
            console.log("Something went wrong. AJAX ERROR.");
        }).then(function(){
            window.document.title = artistData.name + ' | Love Canvas'; //Set titles
            $scope.artist = artistData;
            $scope.pictures = artistData.pictures;
            if(!artistData.about) {
                artistData.about = 'Автор ничего не написал о себе ;('
            }
            if(!artistData.avatar) {
                artistData.avatar = 'noavatar.jpg';
            }
            $timeout(collage, 200);
            $timeout(caption, 0);
            $scope.isOwner = artistData.id === Session.userId;
        });
    $scope.artistId = artistId;

    // This is just for the case that the browser window is resized
    var resizeTimer = null;
    $(window).bind('resize', function() {
        // hide all the images until we resize them
        $('.gallery .Image_Wrapper').css("opacity", 0);
        // set a timer to re-apply the plugin
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(collage, 200);
    });

    // Here we apply the actual CollagePlus plugin
    function collage() {
        $('.gallery').collagePlus({
            'fadeSpeed': 1000,
            'targetHeight': 250,
            'allowPartialLastRow': true
        });
    }
    function caption() {
        $('.gallery').collageCaption();
    }
});