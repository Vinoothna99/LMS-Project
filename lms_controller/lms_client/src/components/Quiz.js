import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel, Button } from '@mui/material';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const location = useLocation();
  const { courseTitle, username } = location.state;

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`api/quiz/?title=${courseTitle}`);
        if (response.ok) {
          const data = await response.json();
          setQuestions(data['course quiz']);
        } else {
          console.error('Failed to fetch quiz data');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuizData();
  }, [courseTitle]);

  const handleOptionChange = (questionNumber, optionNumber) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionNumber]: optionNumber
    }));
  };

  const calculateGrade = () => {
   
    const correct_answers = questions.reduce((acc, question) => {
      if (question.option_number === question.answer_option_number) {
          acc[question.question_number] = question.answer_option_number;
      }
      return acc;
    }, {});
      
      const totalCorrect = Object.keys(answers).reduce((total, questionNumber) => {
        return total + (answers[questionNumber] === correct_answers[questionNumber] ? 1 : 0);
    }, 0);

    // Determine the total number of questions
    const totalQuestions = Object.keys(answers).length;

    // Calculate the percentage of correct answers
    const percentage = (totalCorrect / totalQuestions) * 100;
  

    // Determine the grade based on the percentage
    let grade;
    if (percentage >= 90) grade = 'A';
    else if (percentage >= 75) grade = 'B';
    else if (percentage >= 50) grade = 'C';
    else if (percentage >= 25) grade = 'D';
    else grade = 'F';


    submitGrade(grade);
  };

  const submitGrade = async (grade) => {
    const payload = { username, title: courseTitle, grade };
    try {
      const response = await fetch('api/submitquiz/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        console.error('Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4">{courseTitle}</Typography>
      {questions.filter(q => q.option_number === 100).map(question => (
        <Card key={question.question_number} style={{ margin: '20px 0' }}>
          <CardContent>
            <Typography variant="h6">{question.option_text}</Typography>
            <RadioGroup
              value={answers[question.question_number] || ''}
              onChange={(event) => handleOptionChange(question.question_number, parseInt(event.target.value))}
            >
              {questions.filter(q => q.question_number === question.question_number && q.option_number !== 100).map(option => (
                <FormControlLabel key={option.option_number} value={option.option_number} control={<Radio />} label={option.option_text} />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={calculateGrade}
        disabled={Object.keys(answers).length !== questions.filter(q => q.option_number === 100).length}
      >
        Submit Quiz
      </Button>
    </div>
  );
}

export default Quiz;
