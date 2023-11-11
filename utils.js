const { allParkingUsers, countOfParkingPlaces } = require('./constants.js')

module.exports = {
  addUserToParking: (auto) => {
    let isAlreadyIn = false
    let isNoPlaces = false
    let isSuccess = false

    if (allParkingUsers.length >= countOfParkingPlaces) {
      return 'no places'
    }

    allParkingUsers?.forEach((el) => {
      if (el.username === auto.username) {
        isAlreadyIn = true
        return
      }
    })

    if (allParkingUsers.length === 0) {
      allParkingUsers.push(auto)
      return 'success'
    }
    if (isAlreadyIn) {
      return 'already in'
    }
    allParkingUsers.push(auto)
    return 'success'
  },

  deleteFromParking: (user) => {
    isSuccess = false

    allParkingUsers?.forEach((el, i) => {
      if (el.idUser === user.idUser) {
        allParkingUsers.splice(i, 1)
        isSuccess = true
      }
    })

    if (isSuccess) {
      return 'success'
    }

    return 'no user'
  },

  getFreeParkingPlaces: () => {
    return countOfParkingPlaces - allParkingUsers.length
  },

  getAllUsers: () => {
    return allParkingUsers
  },
}
