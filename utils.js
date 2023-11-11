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
      console.log('exist')
      console.log(el)
      console.log('new')
      console.log(auto)
      if (el.username === auto.username) {
        isAlreadyIn = true
      } else {
        allParkingUsers.push(auto)
        isSuccess = true
      }
    })
    if (allParkingUsers.length === 0) {
      allParkingUsers.push(auto)
      return 'success'
    }
    if (isAlreadyIn) {
      return 'already in'
    }
    if (isSuccess) {
      return 'success'
    }
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
