import AuthenticationContract from '../../../../build/contracts/Authentication.json'
import { browserHistory } from 'react-router'

import { userLoggedIn } from '../../../utils/redux/actions/'
import Store from '../../../utils/redux/Store'

const contract = require('truffle-contract')



export function loginUser() {
  let web3 = Store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {
    return function(dispatch) {
      // Using truffle-contract we create the authentication object.
      const authentication = contract(AuthenticationContract)
      authentication.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on Authentication.
      var authenticationInstance

      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        authentication.deployed().then(function(instance) {
          authenticationInstance = instance
          console.log('one');

          // Attempt to login user.
          authenticationInstance.login({from: coinbase})
          .then(function(result) {
            console.log('two');
            // If no error, login user.
            var userName = web3.toUtf8(result)

            console.log(userName);

            dispatch(userLoggedIn({"name": userName}))

            // Used a manual redirect here as opposed to a wrapper.
            // This way, once logged in a user can still access the home page.
            var currentLocation = browserHistory.getCurrentLocation()

            if ('redirect' in currentLocation.query)
            {
              return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
            }

            return browserHistory.push('/profile')
          })
          .catch(function(result) {
            // If error, go to signup page.
            console.log("error ", result);
            console.error('Wallet ' + coinbase + ' does not have an account!')

            return browserHistory.push('/login')
          })
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.');
  }
}
