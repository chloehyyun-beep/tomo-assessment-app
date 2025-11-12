import React, { useState } from 'react';
import InputField from './components/InputField';
import SelectField from './components/SelectField';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { AGE_GROUPS, JOB_FUNCTIONS, QUESTIONS, WEIGHTS } from './constants';

// 진단 결과 데이터 타입을 정의합니다.
interface Submission {
  id: number;
  timestamp: string;
  name: string;
  ageGroup: string;
  jobFunction: string;
  score: number;
}

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [jobFunction, setJobFunction] = useState('');
  const [page, setPage] = useState<'form' | 'assessment' | 'results' | 'adminLogin' | 'adminDashboard'>('form');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);

  const handleStart = () => {
    if (!name || !ageGroup || !jobFunction) {
      alert('모든 항목을 입력 또는 선택해주세요.');
      return;
    }
    setPage('assessment');
  };

  const handleAnswerChange = (questionIndex: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };
  
  const handleComplete = () => {
    if (Object.keys(answers).length !== QUESTIONS.length) {
      alert('모든 문항에 답변해주세요.');
      return;
    }

    const calculatedScore = QUESTIONS.reduce((acc, _, index) => {
      const answer = answers[index] || 0;
      const weight = WEIGHTS[index];
      return acc + (answer * weight);
    }, 0);
    
    setScore(calculatedScore);

    // 진단 결과를 localStorage에 저장합니다.
    const newSubmission: Submission = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('ko-KR'),
      name: name,
      ageGroup: ageGroup,
      jobFunction: jobFunction,
      score: calculatedScore,
    };

    const existingSubmissions: Submission[] = JSON.parse(localStorage.getItem('tomoSubmissions') || '[]');
    const updatedSubmissions = [...existingSubmissions, newSubmission];
    localStorage.setItem('tomoSubmissions', JSON.stringify(updatedSubmissions));

    setPage('results');
  };

  const handleRestart = () => {
    setName('');
    setAgeGroup('');
    setJobFunction('');
    setAnswers({});
    setScore(null);
    setPage('form');
  };
  
  const handleAdminLogin = (password: string) => {
    if (password === '1234') {
      setPage('adminDashboard');
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const allAnswered = Object.keys(answers).length === QUESTIONS.length;
  
  const mainContentClass = `bg-white w-full ${
    page === 'adminDashboard' ? 'max-w-6xl' : 'max-w-2xl'
  } mx-auto p-8 md:p-12 rounded-2xl shadow-lg transition-all duration-500 ease-in-out`;

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col items-center justify-center p-4 font-sans relative">
      <main className={mainContentClass}>
        {(page === 'form' || page === 'assessment' || page === 'results') && (
           <header className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-600">
              Total Motivation Assessment
            </h1>
            <p className="text-lg text-gray-600 mt-2">ToMo, 총동기이론 진단</p>
          </header>
        )}

        {page === 'form' && (
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <InputField
              id="name"
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="성함을 입력해주세요"
            />
            <SelectField
              id="ageGroup"
              label="연령대"
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              options={AGE_GROUPS}
              placeholder="연령대를 선택해주세요"
            />
            <SelectField
              id="jobFunction"
              label="직무"
              value={jobFunction}
              onChange={(e) => setJobFunction(e.target.value)}
              options={JOB_FUNCTIONS}
              placeholder="직무를 선택해주세요"
            />

            <div className="pt-4">
              <button
                type="button"
                onClick={handleStart}
                className="w-full bg-emerald-500 text-white font-bold py-4 px-4 rounded-lg shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                진단 시작
              </button>
            </div>
            <div className="text-center mt-2">
              <button 
                type="button" 
                onClick={() => setPage('adminLogin')}
                className="text-xs text-gray-500 hover:text-gray-700 hover:underline focus:outline-none"
              >
                관리자 모드
              </button>
            </div>
          </form>
        )}
        
        {page === 'assessment' && (
          <div>
            <div className="space-y-10">
              {QUESTIONS.map((question, index) => (
                <div key={index} className="py-4 border-b border-gray-200 last:border-b-0">
                  <p className="text-md text-gray-900 font-bold mb-5 text-center md:text-left">{`${index + 1}. ${question}`}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-600 w-1/5 text-center hidden md:block">전혀 그렇지 않다</span>
                    <div className="flex justify-center items-center space-x-1 md:space-x-2 w-full md:w-3/5">
                      {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                        <label key={value} className="cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={value}
                            checked={answers[index] === value}
                            onChange={() => handleAnswerChange(index, value)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border border-gray-300 text-gray-500 transition-all peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-500 peer-checked:shadow-lg peer-checked:scale-110 hover:border-emerald-400">
                            {value}
                          </div>
                        </label>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 w-1/5 text-center hidden md:block">매우 그렇다</span>
                  </div>
                   <div className="flex justify-between mt-2 md:hidden">
                      <span className="text-xs text-gray-500">전혀 그렇지 않다</span>
                      <span className="text-xs text-gray-500">매우 그렇다</span>
                   </div>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-4">
              <button
                type="button"
                onClick={handleComplete}
                disabled={!allAnswered}
                className="w-full bg-emerald-500 text-white font-bold py-4 px-4 rounded-lg shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 ease-in-out transform hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                진단 완료
              </button>
            </div>
          </div>
        )}

        {page === 'results' && (
           <div className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">진단 결과</h2>
            <p className="text-gray-600 mb-8">{name}님의 총동기(ToMo) 점수는...</p>
            <div className="relative inline-block bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full p-2 shadow-2xl">
              <div className="bg-white rounded-full w-48 h-48 flex items-center justify-center">
                <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-600">
                  {score !== null ? score.toFixed(2) : '...'}
                </span>
              </div>
            </div>
            <p className="mt-8 text-gray-700 max-w-md mx-auto">
              이 점수는 현재 업무에 대한 동기 부여 수준을 나타냅니다. 점수가 높을수록 긍정적인 동기가 강하다는 의미입니다.
            </p>
            <div className="mt-10">
              <button
                type="button"
                onClick={handleRestart}
                className="w-full max-w-xs mx-auto bg-gray-700 text-white font-bold py-4 px-4 rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-all duration-300 ease-in-out"
              >
                다시 진단하기
              </button>
            </div>
          </div>
        )}

        {page === 'adminLogin' && (
          <AdminLogin onLogin={handleAdminLogin} onBack={() => setPage('form')} />
        )}

        {page === 'adminDashboard' && (
          <AdminDashboard onBack={() => setPage('form')} />
        )}
      </main>

      {page !== 'adminDashboard' && (
        <footer className="absolute bottom-5 w-full text-center px-4">
          <p className="text-xs text-gray-500">
            Total Motivation Assessment는 Neel Doshi와 Lindsay McGregor의 『무엇이 성과를 이끄는가』의 내용을 참고하여 개발되었습니다.
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;