/**
 * Creates an object with user info
 */
export const setUserInfo = (req = {}) =>
  new Promise((resolve) => {
    let user = {
      _id: req._id,
      companyName: req.companyName,
      email: req.email,
      isAdmin: req.isAdmin,
    }

    resolve(user)
  })
