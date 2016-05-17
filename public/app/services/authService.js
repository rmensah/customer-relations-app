// get the logged in user
   authFactory.getUser = function() {
     if (AuthToken.getToken())
       return $http.get('/api/me', { cache: true });
     else
       return $q.reject({ message: 'User has no token.' });    
   }

