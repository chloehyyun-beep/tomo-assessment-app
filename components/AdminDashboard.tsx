import React, { useEffect, useRef, useState } from 'react';
import { AGE_GROUPS, JOB_FUNCTIONS } from '../constants';

// Chart.js가 전역 변수로 로드되므로 타입을 선언해줍니다.
declare var Chart: any;

interface Submission {
  id: number;
  timestamp: string;
  name: string;
  ageGroup: string;
  jobFunction: string;
  score: number;
}

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const ageChartRef = useRef<HTMLCanvasElement>(null);
  const jobChartRef = useRef<HTMLCanvasElement>(null);
  const ageChartInstance = useRef<any>(null);
  const jobChartInstance = useRef<any>(null);

  useEffect(() => {
    const storedSubmissions = JSON.parse(localStorage.getItem('tomoSubmissions') || '[]');
    setSubmissions(storedSubmissions);
  }, []);

  useEffect(() => {
    if (submissions.length > 0) {
      // 이전 차트가 존재하면 파괴합니다.
      if (ageChartInstance.current) {
        ageChartInstance.current.destroy();
      }
      if (jobChartInstance.current) {
        jobChartInstance.current.destroy();
      }

      // 연령대별 점수 차트
      const ageCtx = ageChartRef.current?.getContext('2d');
      if (ageCtx) {
        const ageData = {
          labels: AGE_GROUPS,
          datasets: [{
            label: '점수',
            data: submissions.map(s => ({ x: s.ageGroup, y: s.score })),
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: 'rgba(16, 185, 129, 1)',
            pointRadius: 6,
            pointHoverRadius: 8,
          }]
        };
        ageChartInstance.current = new Chart(ageCtx, {
          type: 'scatter',
          data: ageData,
          options: {
            scales: {
              x: { type: 'category', title: { display: true, text: '연령대', font: { weight: 'bold' } } },
              y: { beginAtZero: false, title: { display: true, text: '총동기 점수', font: { weight: 'bold' } } }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const submission = submissions[context.dataIndex];
                        return `${submission.name}: ${context.parsed.y.toFixed(2)}`;
                    }
                }
              }
            }
          }
        });
      }

      // 직무별 점수 차트
      const jobCtx = jobChartRef.current?.getContext('2d');
      if (jobCtx) {
        const jobData = {
          labels: JOB_FUNCTIONS,
          datasets: [{
            label: '점수',
            data: submissions.map(s => ({ x: s.jobFunction, y: s.score })),
            backgroundColor: 'rgba(13, 148, 136, 0.6)',
            borderColor: 'rgba(13, 148, 136, 1)',
            pointRadius: 6,
            pointHoverRadius: 8,
          }]
        };
        jobChartInstance.current = new Chart(jobCtx, {
          type: 'scatter',
          data: jobData,
          options: {
            scales: {
              x: { type: 'category', title: { display: true, text: '직무', font: { weight: 'bold' } } },
              y: { beginAtZero: false, title: { display: true, text: '총동기 점수', font: { weight: 'bold' } } }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const submission = submissions[context.dataIndex];
                        return `${submission.name}: ${context.parsed.y.toFixed(2)}`;
                    }
                }
              }
            }
          }
        });
      }
    }
    
    return () => {
      if (ageChartInstance.current) ageChartInstance.current.destroy();
      if (jobChartInstance.current) jobChartInstance.current.destroy();
    };
  }, [submissions]);

  return (
    <div className="w-full animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">관리자 대시보드</h2>
        <button
          onClick={onBack}
          className="bg-gray-700 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
        >
          나가기
        </button>
      </div>

      <div className="mb-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">제출된 데이터</h3>
        <div className="overflow-x-auto bg-white rounded-lg shadow max-h-96">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3">#</th>
                <th scope="col" className="px-6 py-3">입력시간</th>
                <th scope="col" className="px-6 py-3">이름</th>
                <th scope="col" className="px-6 py-3">연령대</th>
                <th scope="col" className="px-6 py-3">직무</th>
                <th scope="col" className="px-6 py-3 text-right">총점수</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length > 0 ? submissions.map((s, index) => (
                <tr key={s.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.timestamp}</td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{s.name}</th>
                  <td className="px-6 py-4">{s.ageGroup}</td>
                  <td className="px-6 py-4">{s.jobFunction}</td>
                  <td className="px-6 py-4 text-right font-semibold text-emerald-600">{s.score.toFixed(2)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">제출된 데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">데이터 시각화</h3>
        {submissions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-lg font-medium text-gray-800 mb-2 text-center">연령대별 점수 분포</h4>
              <canvas ref={ageChartRef}></canvas>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-lg font-medium text-gray-800 mb-2 text-center">직무별 점수 분포</h4>
              <canvas ref={jobChartRef}></canvas>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow text-gray-500">
            차트를 표시할 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
