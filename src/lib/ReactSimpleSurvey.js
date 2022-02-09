import SurveyScreen from "./SurveyScreen";

export default class ReactSimpleSurvey {
  title
  screens

  /**
   * @param {string} title 
   * @param {Array} screens 
   */
  constructor(title) 
  {
    this.title = title
    this.screens = []
  }


  /**
   * @param {SurveyScreen} screen 
   * @returns this
   */
  addScreen(screen)
  {
    if (screen instanceof SurveyScreen === false) {
      throw new Error ("Only a SurveyScreen can be passed in this method")
    }

    this.screens.push(screen)

    return this
  }
}