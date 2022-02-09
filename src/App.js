import { useState } from 'react';
import Survey from './lib/Survey';
import surveyExemple from './surveyExemple';

function App() {
  const [showSurvey, setShowSurvey] = useState(true)
  
  function handleSurveySubmit (survey) {
    const answers = []
    survey.screens.map(screen => {
      screen.form.map(field => {
        answers[field.attr.name] = field.attr.value
      })
    })
    
    console.log(answers)
  }

  return (
    <>
      <button 
        className="survey-btn" 
        onClick={() => setShowSurvey(true)}
        style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}
        >
        Start the survey !</button>
    {      
      showSurvey &&
        <Survey
          survey={surveyExemple}
          dirAxis="x"
          onSubmit={(surveyCompleted) => handleSurveySubmit(surveyCompleted)}
          onCloseRequest={() => setShowSurvey(false)}
        />
        }
    </>
  );
}

export default App;
