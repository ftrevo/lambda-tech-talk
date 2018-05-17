module.exports = (...authorizedRoles) => {
  return function (request, response, next) {
    for (let authorizedRole of authorizedRoles) {
      if (authorizedRole.toLowerCase() === request.user.role.toLowerCase()) {
        return next();
      }
    }
    return response.send(403);
  };
};
