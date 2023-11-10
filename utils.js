const { allParkingUsers, countOfParkingPlaces } = require('./constants.js')

module.exports = {
  addUserToParking: (auto) => {
    if (allParkingUsers.length >= countOfParkingPlaces) {
      return 'no places'
    }
    allParkingUsers?.forEach((el) => {
      if (el.idUser === auto.idUser) {
        return 'already in'
      } else {
        allParkingUsers.push(auto)
        return 'success'
      }
    })
  },

  deleteFromParking: (user) => {
    allParkingUsers?.forEach((el, i) => {
      if (el.idUser === user.idUser) {
        allParkingUsers.splice(i, 1)
        return 'success'
      }
    })
    return 'no user'
  },

  getFreeParkingPlaces: () => {
    return countOfParkingPlaces - allParkingUsers.length
  },

  getAllUsers: () => {
    return allParkingUsers
  },
}
