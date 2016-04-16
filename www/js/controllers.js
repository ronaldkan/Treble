angular.module('starter.controllers', [])
.controller('LoginCtrl', function($scope, auth, $state, store) {
  function doAuth() {
    auth.signin({
      closable: false,
      // This asks for the refresh token
      // So that the user never has to log in again
      authParams: {
        scope: 'openid audible:content_read offline_access'
      }
    }, function(data, profile, idToken, accessToken, state, refreshToken) {
      store.set('accessToken', data.identities[0].access_token)
      store.set('profile', profile);
      store.set('token', idToken);
      store.set('refreshToken', refreshToken);
      $state.go('tab.dash');
      console.log(data.identities[0].access_token);
      console.log(idToken);
      console.log(data);
    }, function(error) {
      console.log("There was an error logging in", error);
    });
  }

  $scope.$on('$ionic.reconnectScope', function() {
    doAuth();
  });

  doAuth();
  
  
})

.controller('DashCtrl', function($scope, $http, store, auth) {
  $scope.callApi = function() {
    // Just call the API as you'd do using $http
    alert(store.get('accessToken'));
    $http({
      method: 'POST',
      url: 'https://api.audible.com/1.0/content/B00UX8ODPM/licenserequest',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'bearer' + store.get('accessToken'),
        'Client-ID': 'amzn1.application-oa2-client.8ce1be50cc2940bb820ab96ccb74811b',
        'Content-Type': 'application/json'
      },
      data: { 
        "Consumption_type":"Streaming",
        "Drm_type":"Hls"
      }
    }).success(function(data) {
        alert(data);
    },function() {
      alert("FAILED");
    });
  };
  $scope.listenCommand = function(){
    var vid = document.getElementById("myAud"); 
    vid.play();
  };
  $scope.restart = function(){
    var vid = document.getElementById("theVid");
    var aud = document.getElementById("myAud");
    var story = document.getElementById("myStory");
    vid.currentTime = 0;
    vid.load();
    vid.play();
    aud.currentTime = 0;
    aud.pause();
    story.currentTime = 0;
    story.pause();
  };
  $scope.listenStory = function(){
    var vid = document.getElementById("myStory");
    vid.play();
  };

})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, auth, store, $state) {
  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login', {}, {reload: true});
  };
});
