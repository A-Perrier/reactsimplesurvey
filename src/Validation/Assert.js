export default class Assert 
{
  /**
   * @param {string} str 
   * @param {Array} arrayMinMax 
   * @returns {{isValid: boolean, message: string}}
   */
  static between (str, arrayMinMax) {
    if (arrayMinMax.length !== 2 || !(arrayMinMax instanceof Array) || !this.int(arrayMinMax, false).isValid) {
      throw new Error("arrayMinMax parameter must be an array with two int values.")
    }
    
    let min = arrayMinMax[0]
    let max = arrayMinMax[1]
    // Make sure the highest value to always be max
    if (min > max) {
      let c = min
      min = max
      max = c
    }

    const isInvalid = str.length < min || str.length > max
    let errMsg = isInvalid ? `This field must contain between ${min} and ${max} characters` : ''

    return {isValid: !isInvalid, message: errMsg}
  }



  
  /**
   * @param {string} str 
   * @param {number} min 
   * @returns {{isValid: boolean, message: string}}
   */
  static min (str, min) {
    const isInvalid = str.length < min
    let errMsg = isInvalid ? `This field must contain at least ${min} characters` : ''

    return {isValid: !isInvalid, message: errMsg}
  }




  /**
   * @param {string} str 
   * @param {number} max  
   * @returns {{isValid: boolean, message: string}}
   */
  static max (str, max) {
    const isInvalid = str.length > max
    let errMsg = isInvalid ? `This field must contain a maximum of ${max} characters` : ''

    return {isValid: !isInvalid, message: errMsg}
  }




  /**
   * @param {string} str 
   * @returns {{isValid: boolean, message: string}}
   */
  static email (str) {
    const regex = new RegExp(/^[^\W][a-zA-Z0-9\-\._]+[^\W]@[^\W][a-zA-Z0-9\-\._]+[^\W]\.[a-zA-Z]{2,6}$/gm)
    const isInvalid = !regex.test(str)
    let errMsg = isInvalid ? "This email address is not valid" : ''

    return {isValid: !isInvalid, message: errMsg}
  }


  /**
   * Based on French/Belgian phone number
   * @param {string} str 
   * @returns {{isValid: boolean, message: string}}
   */
  static phone (str) {
    const regex = new RegExp(/^(?:(?:\+|00)(32|33)[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/gm)
    const isInvalid = !regex.test(str)
    let errMsg = isInvalid ? "This phone number is not valid" : ''

    return {isValid: !isInvalid, message: errMsg}
  }



  /**
   * Based on French/Belgian phone number
   * @param {string} str 
   * @returns {{isValid: boolean, message: string}}
   */
  static emailOrPhone(str) {
    let isInvalid = false
    
    if (!this.email(str, false).isValid && !this.phone(str, false).isValid) {
      isInvalid = true
    }

    let errMsg = isInvalid ? "Neither the email address nor phone number is valid" : ''

    return {isValid: !isInvalid, message: errMsg}
  }



  /**
   * @param {string} str  
   * @returns {{isValid: boolean, message: string}}
   */
  static required (str) {
    let isInvalid = false
    if (str === null || str === undefined || str.length === 0) {
      isInvalid = true
    }

    let errMsg = isInvalid ? "This is a required field" : ''

    return {isValid: !isInvalid, message: errMsg}
  }


  /**
   * @param {number|Array} el 
   * @returns {{isValid: boolean, message: string}}
   */
  static int(el) {
    let isInvalid = false
    let errMsg;
    if (el instanceof Array) {
      if (el.length === 0) {
        isInvalid = true
        errMsg = "The array in parameter is empty"
      }

      el.map(val => {
        isInvalid = !Number.isInteger(val) ? true : false
        if (isInvalid) {
          errMsg = "A value in the array isn't an integer"
          return
        }
      })
    } else {
      isInvalid = !Number.isInteger(el) ? true : false
      errMsg = isInvalid ?? "Float numbers are not allowed"
    }
    return {isValid: !isInvalid, message: errMsg}
  }

}