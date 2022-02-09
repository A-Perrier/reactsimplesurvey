import ReactSimpleSurvey from "./lib/ReactSimpleSurvey";
import SurveyScreen from "./lib/SurveyScreen";

const survey = new ReactSimpleSurvey("Get an appointment")
.addScreen(
  new SurveyScreen({
    name: 'Sample Survey',
    question: "Welcome to React Simple Survey ! Here is an exemple of survey made for an initial contact. Using the template used in src/surveyExemple.js, feel free to edit it, add/remove screens, or build a whole new one to inject in App.js !"
  })
)
.addScreen(
  new SurveyScreen({
      name: "About you",
      question: "What's your name ?"
  })
  .addField(
    "input", 
    { name: 'First name', placeholder: 'Your first name' },
    { between: [2, 30], required: true }
  )
  .addField(
    "input",
    { name: "Last name", placeholder: "Your last name"},
    { between: [2, 30], required: true }
  )
)
.addScreen(
  new SurveyScreen({
    name: "Contact details",
    question: "Please give us a phone number (french/belgian format (e.g.: 0612345678)) or an email address where you want to be contacted" 
  })
  .addField(
    "input",
    { name: 'Email or phone', placeholder: 'Email address or phone number' },
    { emailOrPhone: null }
  )
)
.addScreen(
  new SurveyScreen({
    name: "Your needs",
    question: "To give us the opportunity to prepare our call, please explain us what's bring you there."
  })
  .addField(
    "textarea",
    { name: 'Your situation', placeholder: 'Explain why you are requesting an appointment', value:""},
    { min: 40, required: true }
  )
)
.addScreen(
  new SurveyScreen({
    name: "About this form",
    question: `By clicking on "submit" button, you consent all data filled into the inputs to be send to us by email. However, nothing will be saved in our databases nor used to any other usage but preparing our contact.`
  })
)

export default survey