import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import TopBar from '../components/TopBar.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { getReadingPersonality } from '../data/personalities.js';
import { buildQuizSet, getTopWeightEntries, mergeWeightMaps } from '../data/quizQuestions.js';
import './ProfileQuizScreen.css';

const buildEmptyWeightMap = () => ({
  genres: {},
  moods: {},
  gives: {},
  pace: {},
  ending: {},
  length: {},
  style: {},
});

const getTopWeightKey = (weights = {}) => getTopWeightEntries(weights)[0] || null;

export default function ProfileQuizScreen() {
  const navigate = useNavigate();
  const { userProfile, setUserProfile } = useAppContext();
  const [quiz, setQuiz] = useState(() => buildQuizSet(userProfile?.lastQuizQuestionIds || []));
  const [answers, setAnswers] = useState(() => Array(5).fill(null));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [personality, setPersonality] = useState('The Cozy Escapist');

  const currentQuestion = useMemo(() => quiz[selectedIndex], [quiz, selectedIndex]);
  const currentAnswer = answers[selectedIndex];
  const answeredCount = answers.filter(Boolean).length;
  const progress = (answeredCount / Math.max(quiz.length, 1)) * 100;

  const generateNewQuiz = () => {
    const excludeIds = new Set([
      ...(userProfile?.lastQuizQuestionIds || []),
      ...quiz.map((question) => question.id),
    ]);
    const nextQuiz = buildQuizSet([...excludeIds]);
    setQuiz(nextQuiz);
    setAnswers(Array(nextQuiz.length).fill(null));
    setSelectedIndex(0);
    setCompleted(false);
    setStarted(true);
  };

  const handleAnswer = (choice) => {
    const nextAnswers = [...answers];
    nextAnswers[selectedIndex] = choice;
    setAnswers(nextAnswers);
  };

  const handlePrevious = () => {
    setSelectedIndex((current) => Math.max(0, current - 1));
  };

  const finishQuiz = () => {
    const totals = buildEmptyWeightMap();

    quiz.forEach((question, index) => {
      const selectedChoice = answers[index];
      if (!selectedChoice) return;

      Object.entries(selectedChoice.weights || {}).forEach(([group, values]) => {
        Object.entries(values || {}).forEach(([key, value]) => {
          totals[group][key] = (totals[group][key] || 0) + Number(value || 0);
        });
      });
    });

    const nextProfile = {
      ...(userProfile || {
        name: 'Reader',
        favoriteGenres: ['Fantasy'],
        languages: ['English'],
        thingsToAvoid: [],
        mood: 'calm',
      }),
      lastQuizQuestionIds: quiz.map((question) => question.id),
      quizWeights: mergeWeightMaps(userProfile?.quizWeights || {}, totals),
      mood: getTopWeightKey(totals.moods) || userProfile?.mood || 'calm',
      favoriteGenres: [...new Set([
        ...(userProfile?.favoriteGenres || []),
        ...getTopWeightEntries(totals.genres).slice(0, 3),
      ])].slice(0, 5),
      gives: getTopWeightEntries(totals.gives).slice(0, 3),
      pace: getTopWeightEntries(totals.pace).slice(0, 3),
      ending: getTopWeightEntries(totals.ending).slice(0, 3),
      length: getTopWeightEntries(totals.length).slice(0, 3),
      style: getTopWeightEntries(totals.style).slice(0, 3),
    };

    setPersonality(getReadingPersonality(nextProfile));
    setUserProfile(nextProfile);
    setCompleted(true);
  };

  const handleNext = () => {
    if (!currentAnswer) return;

    if (selectedIndex < quiz.length - 1) {
      setSelectedIndex((current) => current + 1);
      return;
    }

    finishQuiz();
  };

  if (!started && !completed) {
    return (
      <main className="profile-quiz-screen">
        <TopBar title="Quick quiz" backTo="/profile" />
        <section className="profile-quiz-card profile-quiz-card--intro">
          <span className="profile-quiz-step">Quiz mini-match</span>
          <h1>Find your next great read.</h1>
          <p>Answer five quick this-or-that prompts to sharpen your reading profile without changing your taste until you finish.</p>
          <div className="profile-quiz-actions">
            <button className="profile-quiz-button profile-quiz-button--primary" onClick={() => setStarted(true)} type="button">Start quiz</button>
            <button className="profile-quiz-button profile-quiz-button--secondary" onClick={() => generateNewQuiz()} type="button">🔀 Generate new questions</button>
          </div>
        </section>
      </main>
    );
  }

  if (completed) {
    return (
      <main className="profile-quiz-screen profile-quiz-screen--result">
        <TopBar title="Quick quiz" backTo="/profile" />
        <section className="profile-quiz-result">
          <p className="profile-quiz-result__eyebrow">Your taste got updated!</p>
          <h1>{personality}</h1>
          <p>You’ve refined your reading profile with a fresh mix of moods, genres, and instincts.</p>
          <div className="profile-quiz-actions">
            <Button to="/home">See new picks</Button>
            <button className="profile-quiz-button profile-quiz-button--secondary" onClick={() => generateNewQuiz()} type="button">🔀 Generate new questions</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-quiz-screen">
      <TopBar title="Quick quiz" backTo="/profile" />
      <section className="profile-quiz-card">
        <div className="profile-quiz-top-row">
          <button
            aria-label="Previous question"
            className="profile-quiz-nav"
            disabled={selectedIndex === 0}
            onClick={handlePrevious}
            type="button"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="profile-quiz-step">Question {selectedIndex + 1} of {quiz.length}</span>
          <button
            aria-label={selectedIndex === quiz.length - 1 ? 'Finish quiz' : 'Next question'}
            className="profile-quiz-nav"
            disabled={!currentAnswer}
            onClick={handleNext}
            type="button"
          >
            {selectedIndex === quiz.length - 1 ? 'Finish' : <ArrowRight size={18} />}
          </button>
        </div>

        <div className="profile-quiz-progress" aria-label="Quiz progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <h1>{currentQuestion.prompt}</h1>

        <div className="profile-quiz-options">
          {currentQuestion.options.map((option) => {
            const isSelected = currentAnswer?.label === option.label;

            return (
              <button
                className={['profile-quiz-option', isSelected ? 'profile-quiz-option--selected' : ''].join(' ')}
                key={option.label}
                onClick={() => handleAnswer(option)}
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
