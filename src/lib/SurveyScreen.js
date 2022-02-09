export default class SurveyScreen {
  name
  question
  form = []

  /**
   * @param {{name, question, SurveyForm}} 
   * @param {string} question 
   * @param {SurveyForm} form 
   */
  constructor ({name = "", question = ""})
  {
    this.name = name
    this.question = question
  }


  /**
   * @param {string} node A node name such as 'input', 'textarea',...
   * @param {object} attr Must be an object with key value pairs. e.g. { className: "myWowInput" }
   * @param {object} assert Must be an object with key value pairs. e.g. { between: [2, 30] }
   * @returns this
   */
   addField (node, attr = {}, assert = {})
   {
     if ((!typeof attr === Object || Array.isArray(attr)) && (!typeof assert === Object || Array.isArray(assert))) {
       throw new Error ("Only an object can be passed in attr and assert parameters")
     }
 
     if (!attr.hasOwnProperty('value')) 
       attr = {...attr, value: ''}
 
     this.form.push({
       node,
       attr,
       assert
     }) 
 
     return this
   }
}