import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { disableScroll, editFromArray, enableScroll, rand } from '../functions';
import Assert from '../Validation/Assert';
import ProgressBar from './ProgressBar';
import { useEventListener } from '../hooks/useEventListener';
import ReactSimpleSurvey from './ReactSimpleSurvey';
import '../styles/Survey.css'

const Survey = ({ 
  onCloseRequest, 
  dirAxis = 'x', 
  survey, 
  onSubmit 
}) => {
  if (survey instanceof ReactSimpleSurvey === false) {
    throw new Error("A ReactSimpleSurvey instance is required")
  }

  const [currentPage, setCurrentPage] = useState(0)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRejected, setIsRejected] = useState(false)
  const [screensTracked, setScreensTracked] = useState(survey.screens)
  const screenGroup = useRef()
  const [scrollY, setScrollY] = useState(window.scrollY + 'px')
  useEventListener('resize', () => {
    setScrollY(window.scrollY + 'px')
  })


  useEffect(() => {
    disableScroll()

    return () => {
      //enableScroll()
    }
  }, [])



  useEffect(() => {
    setCompletionPercentage((100 / screensTracked.length) * currentPage)
  }, [currentPage])



  /**
   * Calculate the transform value to display the right screen
   */
  function handleNextScreen () {
    if (currentPage + 1 === screensTracked.length) {
      return
    }

    setCurrentPage(currentPage + 1)
    if (dirAxis === 'x') {
      screenGroup.current.style.transform = `translate${dirAxis}(-${100 / (screensTracked.length / (currentPage + 1))}%)`
    } else {
      screenGroup.current.style.transform = `translate${dirAxis}(-${currentPage + 1}00%)`
    }
    disableScroll()
  }



  /**
   * Calculate the transform value to display the right screen
   */
  function handlePrevScreen () {
    if (currentPage === 0) {
      return
    }

    setCurrentPage(currentPage - 1)
    if (dirAxis === 'x') {
      screenGroup.current.style.transform = `translate${dirAxis}(-${100 / (screensTracked.length / (currentPage - 1))}%)`
    } else {
      screenGroup.current.style.transform = `translate${dirAxis}(-${currentPage - 1}00%)`
    }
    disableScroll()
  }



  function handleCloseRequest () {
    const isWanted = window.confirm("Souhaitez-vous vraiment annuler la demande ? Toutes les informations entrées jusqu'ici seront supprimées")
    if (!isWanted) {
      return
    }
    onCloseRequest()
  }



  async function handleSurveySubmit () {
    setIsSubmitting(true)
    try {
      await onSubmit({title: survey.title, screens: screensTracked})
      setIsSubmitting(false)
      setCompletionPercentage(100)
    } catch (e) {
      setIsSubmitting(false)
      setIsRejected(true)
      setCompletionPercentage(0)
    } 
  }



  function handleUpdate (updData, original) {
    setScreensTracked(editFromArray(screensTracked, updData, original))
  }

  

  return ( 
    <div className="survey" style={{top: scrollY}}>
      <SurveyArrow onClick={handleCloseRequest} className="survey__closer"/>
      <ProgressBar 
        now={completionPercentage} 
        showLabel={false}
        fillerColor="#db5971"
        bgColor="#db59715d"
      />
      <span className="survey__title">{survey.title}</span>
      <div 
        ref={screenGroup} 
        className="screen-group" 
        style={{
          height: '100%', 
          width: `${dirAxis === 'x' ? screensTracked.length * 100 : 100}%`,
          display: `${dirAxis === 'x' ? 'flex' : 'block'}`
          }}
        >
        {screensTracked.map((screen, i) => 
          <SurveyQuestion 
            key={i}
            content={screen} 
            onFieldUpdate={(updData) => handleUpdate(updData, screen)}
            onNextRequest={handleNextScreen}
            onPrevRequest={handlePrevScreen}
            onSubmitRequest={handleSurveySubmit}
            showNext={currentPage + 1 < screensTracked.length}
            showPrev={currentPage > 0 && completionPercentage !== 100}
            showSubmit={currentPage === (screensTracked.length - 1) && completionPercentage !== 100}
            screenWidth={`${dirAxis === 'x' ? 100/screensTracked.length : '100'}%`}
            isActive={currentPage === i}
            isSurveySubmitting={isSubmitting}
            isSurveyCompleted={completionPercentage === 100}
            isSurveyRejected={isRejected}
          />
        )}
      </div>
      
    </div>
  );
}




/**
 * Displays a screen
 */
const SurveyQuestion = ({ 
  showNext, 
  showPrev, 
  showSubmit,
  content, 
  onFieldUpdate,
  onPrevRequest, 
  onNextRequest,
  onSubmitRequest,
  screenWidth = "100%", 
  isActive,
  isSurveySubmitting,
  isSurveyCompleted,
  isSurveyRejected
}) => {
  const [fieldsSubmittable, setFieldsSubmittable] = useState(false)
  const [updateCount, setUpdateCount] = useState(0)

  useEffect(() => {
    setFieldsSubmittable(validateFields())
  }, [content])



  /**
   * Checks each field and its assertions. If each field passes all its constraints, returns true, else false.
   * If violations are detected, sets them into their respective field under field.violations property
   * @returns {boolean} 
   */
  function validateFields() {
    const form = content.form
    let fieldsValid = 0

    form.map(field => {
      const value = field.attr.value
      const asserts = field.assert
      let constraintsPassed = 0
      let constraintsToPass = Object.keys(asserts).length
      field.violations = []
      
      Object.entries(asserts).map(([constraint, val]) => {
        const { isValid, message } = checkAssertion(value, constraint, val)
        if (isValid)
          constraintsPassed += 1
        else
          field.violations.push(message)
          // Force to re-render the component. Else, violations aren't displayed in real time but n-1
          setUpdateCount(updateCount + 1)
      })

      if (constraintsPassed === constraintsToPass) {
        fieldsValid += 1
      }
    })

    return fieldsValid === content.form.length
  }



  /**
   * If the constraint exists in the class Assert, calls it and verify if the subject passes it
   * @param {string} subject 
   * @param {string} constraint 
   * @param {mixed} constraintValue 
   * @returns {object} {result: Boolean, message: String}
   */
  function checkAssertion(subject, constraint, constraintValue) {
    if (typeof Assert[constraint] !== 'function') {
      throw new Error(`The constraint ${constraint} is invalid. To check valid constraints, please refer to Assert class methods.`)
    }

    const notRequiresConstraintValue = ['email', 'phone', 'emailOrPhone', 'required']
    
    if (notRequiresConstraintValue.includes(constraint)) {
      return Assert[constraint](subject, false)
    } else {
      return Assert[constraint](subject, constraintValue, false)
    }
  }



  /**
   * According to the node value of the object passed in parameter, create a tracked JSX element.
   * Typing in it will update the whole "content" prop then trigger the "onFieldUpdate" event
   * @param {object} formEl 
   * @returns {ReactElement}
   */
  function createElement(formEl) {
    if (formEl.attr.type && formEl.attr.type !== "text") {
      throw new Error ("The support for other types of input than text isn't currently supported")
    }

    const Tag = formEl.node
    return (
      <div className="form-input">
        <label>{formEl.attr.name}</label>
        <Tag {...formEl.attr} 
          key={formEl}
          type={formEl.attr.type || "text"}
          value={formEl.attr.value} 
          onChange={(e) => updateValue(formEl, e.target.value)} 
        />
        {
          formEl.violations?.map((violation, i) => 
            // We use this way to set a key because of the redundancy of violations messages
            <p className="input-error" key={rand()}>{violation}</p>
          )
        }
      </div>
      )
  }


  
  /**
   * This function will copy each nested object to finally update a "content" prop copy that will be send through 
   * "onFieldUpdate" event
   * @param {Object} formEl 
   * @param {String} value 
   */
  function updateValue(formEl, value) {
    const updAttr = {... formEl.attr, value}
    const updEl = {...formEl, attr: updAttr}
    const updForm = editFromArray(content.form, updEl, formEl)
    const updContent = {...content, form: updForm}
    onFieldUpdate(updContent)
  }



  return (
    <div className={`survey__screen ${isActive ? 'active' : ''}`} style={{width: screenWidth}}>
      <div className="top">
      <div className="survey__question">
        {
          (!isSurveyCompleted && !isSurveySubmitting && !isSurveyRejected) &&
          <>
            <h1 className="slide-from-right">{content.name}</h1>
            <p className="slide-from-bottom">{content.question}</p>
          </>
        }
        {
          isSurveyCompleted &&
          <>
            <h1 className="slide-from-right">Thank you !</h1>
            <p className="slide-from-bottom">Your request have been sent. We're coming back to you soon.</p>
          </>
        }
        {
          isSurveySubmitting &&
          <>
            <h1 className="slide-from-right">Please wait...</h1>
            <p className="slide-from-bottom">Your informations are being send.</p>
          </>
        }
        {
          isSurveyRejected &&
          <>
            <h1 className="slide-from-right">Oops !</h1>
            <p className="slide-from-bottom">Something happened. We're cancelling the operation.</p>
          </>
        }
      </div>
      </div>
      <div className="bottom">
        <div className="survey__screen-form">
          {
            content.form.map((formEl, i) => 
              createElement(formEl)
            )
          }
        </div>
        <div className="btn-group">
          { showPrev && !isSurveyRejected && !isSurveySubmitting && <SurveyButton onClick={onPrevRequest} text="Back" type="reverse"/> }
          { showNext && !isSurveyRejected && fieldsSubmittable && <SurveyButton onClick={onNextRequest} /> }
          { showSubmit && !isSurveyRejected && !isSurveySubmitting && fieldsSubmittable && <SurveyButton onClick={onSubmitRequest} text="Submit" /> }
        </div>
      </div>
    </div>
  )
}




const SurveyButton = ({ onClick, disabled = false, text = "Next", type = "regular" }) => {
  return (
    type === "regular" ?
      <button className="survey-btn" onClick={onClick} disabled={disabled}>{text}</button>
    : type === "reverse" ?
    <button className="survey-btn reverse" onClick={onClick} disabled={disabled}>{text}</button>
    : ''
  )
}

const SurveyArrow = ({ onClick = null, fill = null, className = "side-icon" }) => {
  return (
    <span onClick={onClick} className={"clickable " + className}>
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M15.0009 7.9999C15.0009 7.86729 14.9482 7.74011 14.8544 7.64635C14.7607 7.55258 14.6335 7.4999 14.5009 7.4999H2.70789L5.85489 4.3539C5.90138 4.30741 5.93826 4.25222 5.96342 4.19148C5.98858 4.13074 6.00153 4.06564 6.00153 3.9999C6.00153 3.93416 5.98858 3.86906 5.96342 3.80832C5.93826 3.74758 5.90138 3.69239 5.85489 3.6459C5.80841 3.59941 5.75322 3.56254 5.69248 3.53738C5.63174 3.51222 5.56664 3.49927 5.50089 3.49927C5.43515 3.49927 5.37005 3.51222 5.30931 3.53738C5.24857 3.56254 5.19338 3.59941 5.14689 3.6459L1.14689 7.6459C1.10033 7.69234 1.06339 7.74752 1.03818 7.80827C1.01297 7.86901 1 7.93413 1 7.9999C1 8.06567 1.01297 8.13079 1.03818 8.19153C1.06339 8.25228 1.10033 8.30745 1.14689 8.3539L5.14689 12.3539C5.19338 12.4004 5.24857 12.4373 5.30931 12.4624C5.37005 12.4876 5.43515 12.5005 5.50089 12.5005C5.56664 12.5005 5.63174 12.4876 5.69248 12.4624C5.75322 12.4373 5.80841 12.4004 5.85489 12.3539C5.90138 12.3074 5.93826 12.2522 5.96342 12.1915C5.98858 12.1307 6.00153 12.0656 6.00153 11.9999C6.00153 11.9342 5.98858 11.8691 5.96342 11.8083C5.93826 11.7476 5.90138 11.6924 5.85489 11.6459L2.70789 8.4999H14.5009C14.6335 8.4999 14.7607 8.44722 14.8544 8.35345C14.9482 8.25968 15.0009 8.13251 15.0009 7.9999Z" fill={fill || "#ffffff"}/>
      </svg>
    </span>
  )
}
 
export default Survey;