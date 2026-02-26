// Mock user data
export type UserRole = "student" | "admin" | "assistant_admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  grade: string
  phone: string
  region?: string
  school?: string
}

export const currentUser: User = {
  id: "user-1",
  name: "김민준",
  email: "minjun@example.com",
  role: "student",
  grade: "고등학교 2학년",
  phone: "010-1234-5678",
  region: "서울특별시",
  school: "가고등학교",
}

export const adminUser: User = {
  id: "admin-1",
  name: "서이연",
  email: "admin@example.com",
  role: "admin",
  grade: "",
  phone: "010-9999-0000",
}

export const assistantAdminUser: User = {
  id: "asst-1",
  name: "손현우",
  email: "sohn.hyunwoo@example.com",
  role: "assistant_admin",
  grade: "",
  phone: "010-9999-9999",
}

// Q&A Board
export interface QnaPost {
  id: string
  authorId: string
  authorName: string
  title: string
  content: string
  createdAt: string
  isPrivate: boolean
  answer: string
  answeredAt: string | null
  attachments: Array<{
    name: string
    size: number
    type: string
    url: string
  }>
}

export const qnaPosts: QnaPost[] = [
  {
    id: "qna-1",
    authorId: "user-1",
    authorName: "김민준",
    title: "미적분 치환적분 질문드립니다",
    content:
      "교재 145페이지 3번 문제에서 치환적분 과정이 이해되지 않습니다. 어떤 변수를 기준으로 치환해야 하는지 단계별 설명 부탁드립니다.",
    createdAt: "2026-02-08",
    isPrivate: true,
    answer:
      "해당 문제는 t = x+1로 치환하면 계산이 단순해집니다. 치환 후 적분 구간도 함께 변환해 주세요.",
    answeredAt: "2026-02-09",
    attachments: [
      {
        name: "calculus_problem.png",
        size: 245000,
        type: "image/png",
        url: "https://picsum.photos/400/300",
      },
    ],
  },
  {
    id: "qna-2",
    authorId: "user-2",
    authorName: "이서연",
    title: "수열 일반항 구하는 방법 질문",
    content:
      "등차수열과 등비수열이 함께 나오는 문제에서 일반항을 어떻게 구해야 하는지 헷갈립니다. 접근 방법을 알려주세요.",
    createdAt: "2026-02-07",
    isPrivate: true,
    answer: "",
    answeredAt: null,
    attachments: [],
  },
  {
    id: "qna-3",
    authorId: "user-3",
    authorName: "정하준",
    title: "확률과 통계 경우의 수 문제 질문",
    content:
      "경우의 수 문제에서 중복조합과 조합을 구분하는 기준이 잘 이해되지 않습니다. 예시와 함께 설명 부탁드립니다.",
    createdAt: "2026-02-06",
    isPrivate: true,
    answer:
      "같은 원소를 여러 번 선택할 수 있으면 중복조합, 한 번만 선택 가능하면 조합을 사용합니다. 교재 3단원 예제를 참고하세요.",
    answeredAt: "2026-02-06",
    attachments: [],
  },
  {
    id: "qna-4",
    authorId: "user-4",
    authorName: "최은서",
    title: "기하 벡터 내적 계산 확인 요청",
    content:
      "벡터 내적 계산 과정에서 부호 처리가 헷갈립니다. 풀이 과정이 맞는지 확인 부탁드립니다.",
    createdAt: "2026-02-05",
    isPrivate: true,
    answer: "",
    answeredAt: null,
    attachments: [
      {
        name: "vector_solution.pdf",
        size: 182000,
        type: "application/pdf",
        url: "#",
      },
    ],
  },
  {
    id: "qna-5",
    authorId: "user-5",
    authorName: "박지호",
    title: "모의고사 수학 오답노트 작성법 문의",
    content:
      "2월 모의고사에서 틀린 수학 문제를 어떻게 정리하면 좋을까요? 오답노트 작성 방법이 궁금합니다.",
    createdAt: "2026-02-04",
    isPrivate: true,
    answer:
      "틀린 문제를 개념 오류, 계산 실수, 시간 부족으로 구분해 정리하세요. 같은 유형 문제를 2~3개 추가로 풀어보는 것이 좋습니다.",
    answeredAt: "2026-02-05",
    attachments: [],
  },
  {
    id: "qna-6",
    authorId: "user-1",
    authorName: "김민준",
    title: "부정적분과 정적분의 차이가 뭔가요?",
    content: "부정적분과 정적분의 개념 차이를 명확히 알고 싶습니다. 언제 어떤 것을 사용하는지 알려주세요.",
    createdAt: "2026-02-03",
    isPrivate: true,
    answer: "부정적분은 미분하기 전의 함수(원시함수)를 구하는 것이고, 정적분은 곡선 아래의 넓이를 구하는 것입니다.",
    answeredAt: "2026-02-03",
    attachments: [],
  },
  {
    id: "qna-7",
    authorId: "user-2",
    authorName: "이서연",
    title: "로그함수의 밑 변환 공식 활용법",
    content: "로그함수 밑 변환 공식을 사용하는 이유와 실제 문제 풀이에서의 활용법을 알고 싶습니다.",
    createdAt: "2026-02-02",
    isPrivate: true,
    answer: "",
    answeredAt: null,
    attachments: [],
  },
  {
    id: "qna-8",
    authorId: "user-3",
    authorName: "정하준",
    title: "지수함수 문제 풀이 방법",
    content: "밑이 다른 지수함수 비교 문제를 어떻게 풀어야 하나요? 구체적인 예시를 들어 설명해주세요.",
    createdAt: "2026-02-01",
    isPrivate: true,
    answer: "로그를 취하거나 그래프를 비교하는 방법이 있습니다. 주어진 조건에 따라 적절한 방법을 선택하세요.",
    answeredAt: "2026-02-02",
    attachments: [],
  },
  {
    id: "qna-9",
    authorId: "user-4",
    authorName: "최은서",
    title: "삼각함수 덧셈 정리 이해하기",
    content: "삼각함수의 덧셈 정리가 왜 그렇게 유도되는지 원리를 알고 싶습니다.",
    createdAt: "2026-01-31",
    isPrivate: true,
    answer: "",
    answeredAt: null,
    attachments: [],
  },
  {
    id: "qna-10",
    authorId: "user-5",
    authorName: "박지호",
    title: "역함수 존재 조건 정리",
    content: "역함수가 존재하기 위한 조건들을 정리해주세요. 정의역과 치역의 관계는?",
    createdAt: "2026-01-30",
    isPrivate: true,
    answer: "함수가 전단사(일대일 대응)여야 역함수가 존재합니다. 일대일 함수이면서 치역이 공역과 같아야 합니다.",
    answeredAt: "2026-01-31",
    attachments: [],
  },
  {
    id: "qna-11",
    authorId: "user-1",
    authorName: "김민준",
    title: "합성함수의 미분법",
    content: "합성함수를 미분할 때 연쇄법칙을 어떻게 적용하는지 단계적으로 설명해주세요.",
    createdAt: "2026-01-29",
    isPrivate: true,
    answer: "",
    answeredAt: null,
    attachments: [],
  },
  {
    id: "qna-12",
    authorId: "user-2",
    authorName: "이서연",
    title: "함수의 극한과 연속성의 관계",
    content: "함수가 연속이려면 극한이 존재해야 한다고 배웠는데, 그 역은 성립하나요?",
    createdAt: "2026-01-28",
    isPrivate: true,
    answer: "연속 ⟹ 극한 존재는 참이지만, 역은 거짓입니다. 극한이 존재해도 불연속인 경우가 있습니다.",
    answeredAt: "2026-01-29",
    attachments: [],
  },
  {
    id: "qna-13",
    authorId: "user-3",
    authorName: "정하준",
    title: "확률 계산에서 조건부 확률의 활용",
    content: "조건부 확률 공식을 여러 상황에서 어떻게 적용하는지 알고 싶습니다.",
    createdAt: "2026-01-27",
    isPrivate: true,
    answer: "",
    answeredAt: null,
    attachments: [],
  },
  {
    id: "qna-14",
    authorId: "user-4",
    authorName: "최은서",
    title: "베이즈 정리 이해하기",
    content: "베이즈 정리의 의미와 실제 문제에서의 활용 사례를 알려주세요.",
    createdAt: "2026-01-26",
    isPrivate: true,
    answer: "베이즈 정리는 조건부 확률을 역으로 계산할 때 사용합니다. P(A|B) = P(B|A)×P(A) / P(B)",
    answeredAt: "2026-01-27",
    attachments: [],
  },
  {
    id: "qna-15",
    authorId: "user-5",
    authorName: "박지호",
    title: "정규분포의 표준화 이유",
    content: "정규분포를 표준정규분포로 변환하는 이유가 뭔가요? 어떤 이점이 있나요?",
    createdAt: "2026-01-25",
    isPrivate: true,
    answer: "",
    answeredAt: null,
    attachments: [],
  },
];


// Lecture Video Board
export interface LectureCategory {
  id: string
  name: string
  description: string
  instructor: string
  thumbnail: string
  courseCount: number
}

export interface Course {
  id: string
  categoryId: string
  name: string
  lessonCount: number
  assignedTo: string[]
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  videoUrl: string
  timemarks: Timemark[]
  resources: Resource[]
}

export interface Timemark {
  time: string
  label: string
}

export interface Resource {
  name: string
  type: string
  url: string
}

export const lectureCategories: LectureCategory[] = [
  {
    id: "cat-1",
    name: "미적분",
    description: "극한, 미분, 적분 및 응용 문제",
    instructor: "서이연",
    thumbnail: "",
    courseCount: 4,
  },
  {
    id: "cat-2",
    name: "수열",
    description: "등차·등비수열, 점화식, 귀납법",
    instructor: "서이연",
    thumbnail: "",
    courseCount: 3,
  },
  {
    id: "cat-3",
    name: "확률과 통계",
    description: "확률, 경우의 수, 통계 추론",
    instructor: "서이연",
    thumbnail: "",
    courseCount: 3,
  },
  {
    id: "cat-4",
    name: "기하와 벡터",
    description: "평면벡터, 공간도형, 기하적 해석",
    instructor: "서이연",
    thumbnail: "",
    courseCount: 2,
  },
  {
    id: "cat-5",
    name: "모의고사 분석",
    description: "기출 분석, 오답 정리, 유형별 전략",
    instructor: "서이연",
    thumbnail: "",
    courseCount: 2,
  },
];

export const courses: Course[] = [
  { id: "course-1", categoryId: "cat-1", name: "미적분 기본 개념반", lessonCount: 3, assignedTo: ["user-1", "user-2"] },
  { id: "course-2", categoryId: "cat-1", name: "미적분 응용 문제반", lessonCount: 0, assignedTo: ["user-1", "user-3"] },
  { id: "course-3", categoryId: "cat-1", name: "미적분 심화 풀이반", lessonCount: 0, assignedTo: [] },
  { id: "course-4", categoryId: "cat-2", name: "수열 개념 완성반", lessonCount: 0, assignedTo: ["user-1", "user-4"] },
  { id: "course-5", categoryId: "cat-2", name: "수열 문제 풀이 전략반", lessonCount: 0, assignedTo: [] },
  { id: "course-6", categoryId: "cat-3", name: "확률과 통계 개념 완성", lessonCount: 0, assignedTo: ["user-2", "user-3", "user-4"] },
  { id: "course-7", categoryId: "cat-3", name: "확률과 통계 문제 풀이반", lessonCount: 0, assignedTo: [] },
  { id: "course-8", categoryId: "cat-4", name: "기하 개념 완성반", lessonCount: 0, assignedTo: [] },
  { id: "course-9", categoryId: "cat-4", name: "벡터 심화 풀이반", lessonCount: 0, assignedTo: [] },
  { id: "course-10", categoryId: "cat-4", name: "기하와 벡터 실전 문제반", lessonCount: 0, assignedTo: [] },
]

export const lessons: Lesson[] = [
  {
    id: "lesson-1",
    courseId: "course-1",
    title: "함수의 극한과 연속",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    timemarks: [
      { time: "00:00", label: "도입 - 함수의 극한 개념" },
      { time: "05:20", label: "극한값의 계산" },
      { time: "15:40", label: "부정형의 극한" },
      { time: "25:00", label: "함수의 연속성" },
      { time: "35:10", label: "연습문제 풀이" },
    ],
    resources: [
      { name: "수업 교안 PDF", type: "pdf", url: "#" },
      { name: "연습문제 모음", type: "pdf", url: "#" },
    ],
  },
  {
    id: "lesson-2",
    courseId: "course-1",
    title: "미분의 정의와 기본 공식",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    timemarks: [
      { time: "00:00", label: "미분의 정의" },
      { time: "10:30", label: "기본 미분 공식" },
      { time: "20:45", label: "합성함수의 미분" },
      { time: "35:00", label: "예제 풀이" },
      { time: "45:00", label: "정리 및 복습" },
    ],
    resources: [
      { name: "미분 공식 정리표", type: "pdf", url: "#" },
    ],
  },
  {
    id: "lesson-3",
    courseId: "course-1",
    title: "도함수의 활용",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    timemarks: [
      { time: "00:00", label: "접선의 방정식" },
      { time: "12:00", label: "함수의 증가와 감소" },
      { time: "24:00", label: "극대와 극소" },
      { time: "36:00", label: "실전 문제 풀이" },
    ],
    resources: [
      { name: "도함수 활용 워크시트", type: "pdf", url: "#" },
      { name: "기출문제 모음", type: "pdf", url: "#" },
    ],
  },
]

// Consultation Board
export interface Consultation {
  id: string
  authorId: string
  authorName: string
  title: string
  content: string
  createdAt: string
  status: "대기중" | "답변완료"
  answer?: string
  answeredAt?: string
}

export const consultations: Consultation[] = [
  {
    id: "consult-1",
    authorId: "user-1",
    authorName: "김민준",
    title: "수학 학습 방향 상담 요청합니다",
    content: "현재 수학 성적이 3등급인데 1등급까지 올리고 싶습니다. 어떤 방식으로 학습하면 좋을지 상담 부탁드립니다.",
    createdAt: "2026-02-08",
    status: "답변완료",
    answer: "현재 실력에서 1등급까지 충분히 가능합니다. 기본 개념 정리 후 기출문제 반복 풀이를 추천드립니다. 자세한 학습 계획은 상담 시간에 안내드리겠습니다.",
    answeredAt: "2026-02-09",
  },
  {
    id: "consult-2",
    authorId: "user-2",
    authorName: "이서연",
    title: "진로 관련 상담 신청",
    content: "문과에서 이과로 교차지원을 고려하고 있는데, 가능한 학과와 준비 방법이 궁금합니다.",
    createdAt: "2026-02-07",
    status: "대기중",
  },
  {
    id: "consult-3",
    authorId: "user-3",
    authorName: "정하준",
    title: "학습 스케줄 조정 상담",
    content: "학교 내신과 수능 준비를 병행하려면 어떻게 스케줄을 짜면 좋을까요?",
    createdAt: "2026-02-05",
    status: "대기중",
  },
  {
    id: "consult-4",
    authorId: "user-4",
    authorName: "최은서",
    title: "국어 독해 실력 향상 방법",
    content: "비문학 독해 속도가 느려서 시험 시간이 부족합니다. 빠르게 읽으면서 이해도를 높일 수 있는 방법을 알고 싶습니다.",
    createdAt: "2026-02-06",
    status: "답변완료",
    answer: "먼저 자주 출제되는 주제의 어휘를 익히고, 문단별 핵심 내용 파악 연습을 추천드립니다. 기출 지문으로 반복 학습하면 속도가 자연스럽게 올라갑니다.",
    answeredAt: "2026-02-07",
  },
  {
    id: "consult-5",
    authorId: "user-5",
    authorName: "박지호",
    title: "영어 문법 약점 보완",
    content: "특히 가정법과 수동태 부분에서 계속 틀립니다. 효과적인 학습 방법이 있을까요?",
    createdAt: "2026-02-04",
    status: "대기중",
  },
  {
    id: "consult-6",
    authorId: "user-1",
    authorName: "김민준",
    title: "과학탐구 과목 선택 상담",
    content: "물리, 화학, 생명과학 중 어느 과목을 선택해야 할지 고민입니다. 각 과목의 특징을 알려주세요.",
    createdAt: "2026-02-03",
    status: "답변완료",
    answer: "각 과목의 특징과 대학 입시에서의 반영도를 비교하여 설명드리겠습니다. 개인면담 예약 후 자세히 상담하겠습니다.",
    answeredAt: "2026-02-04",
  },
  {
    id: "consult-7",
    authorId: "user-6",
    authorName: "김철수",
    title: "중학교 수학 기초 다지기",
    content: "중1 때 놓친 개념들이 많아서 지금 고생하고 있습니다. 기초부터 다시 공부하는 방법을 알려주세요.",
    createdAt: "2026-02-02",
    status: "대기중",
  },
  {
    id: "consult-8",
    authorId: "user-7",
    authorName: "이영희",
    title: "모의고사 성적 분석 요청",
    content: "최근 모의고사 성적이 떨어졌는데, 어느 부분을 보완해야 할지 진단받고 싶습니다.",
    createdAt: "2026-02-01",
    status: "답변완료",
    answer: "모의고사 답안지와 오답노트를 가져오신 후 면대면 상담하겠습니다. 약점 분석 후 개인화된 학습계획을 제시하겠습니다.",
    answeredAt: "2026-02-02",
  },
  {
    id: "consult-9",
    authorId: "user-8",
    authorName: "조민지",
    title: "시간 관리와 학습 효율성",
    content: "하루를 어떻게 활용해야 효율적으로 공부할 수 있을까요? 저는 항상 계획만 세우고 실행을 못 합니다.",
    createdAt: "2026-01-31",
    status: "대기중",
  },
  {
    id: "consult-10",
    authorId: "user-9",
    authorName: "박지우",
    title: "한국사 학습 전략 상담",
    content: "한국사를 어떤 방식으로 공부해야 효과적일까요? 흐름 파악이 잘 안 되네요.",
    createdAt: "2026-01-30",
    status: "답변완료",
    answer: "시대별 흐름을 먼저 이해한 후 세부 사항을 추가하는 방식을 추천합니다. 연표와 함께 학습하면 효과적입니다.",
    answeredAt: "2026-01-31",
  },
  {
    id: "consult-11",
    authorId: "user-2",
    authorName: "이서연",
    title: "수능 특강 교재 활용법",
    content: "수능 특강을 어떻게 풀어야 효율적일까요? 너무 많은 문제가 있어서 어디서부터 시작해야 할지 모르겠습니다.",
    createdAt: "2026-01-29",
    status: "대기중",
  },
  {
    id: "consult-12",
    authorId: "user-3",
    authorName: "정하준",
    title: "수학 개념 복습 계획",
    content: "고3 1학기 때 배웠던 개념들을 다시 정리하려고 하는데, 어떤 순서로 복습하면 좋을까요?",
    createdAt: "2026-01-28",
    status: "답변완료",
    answer: "기본 정의부터 시작하여 정리 노트를 만들고, 기출문제로 검증하는 방식을 추천합니다.",
    answeredAt: "2026-01-29",
  },
]

export const instructors = [
  {
    name: "서이연",
    subject: "수학",
    description: `한 번 보면 이해되는 수학
    개념-응용을 연결해
    수학적 해석력을 키웁니다.

    풀이보다 '열쇠'를 준다
    문제의 잠금 해제
    수학 Unlonk`,
    description2: [
      "전) 목동 시대인재",
      "전) 서울 사대부고 보충수업 교사",
      "성균관대학교 수학과 졸업",
      "성균관대학교 전자전기공학부 복수전공",
    ],
    image: "",
  },
]

// Students list (for admin view)
export interface Student {
  id: string
  name: string
  grade: string
  region: string
  school: string
}

export const students: Student[] = [
  { id: "user-1", name: "김민준", grade: "고등학교 2학년", region: "서울특별시", school: "가고등학교" },
  { id: "user-2", name: "이서연", grade: "고등학교 2학년", region: "서울특별시", school: "나고등학교" },
  { id: "user-3", name: "정하준", grade: "고등학교 1학년", region: "서울특별시", school: "가고등학교" },
  { id: "user-4", name: "최은서", grade: "고등학교 3학년", region: "서울특별시", school: "다고등학교" },
  { id: "user-5", name: "박지호", grade: "고등학교 2학년", region: "서울특별시", school: "나고등학교" },
  { id: "user-6", name: "김철수", grade: "중학교 1학년", region: "서울특별시", school: "가중학교" },
  { id: "user-7", name: "이영희", grade: "중학교 3학년", region: "서울특별시", school: "나중학교" },
  { id: "user-8", name: "조민지", grade: "중학교 2학년", region: "서울특별시", school: "나중학교" },
  { id: "user-9", name: "박지우", grade: "중학교 2학년", region: "서울특별시", school: "다중학교" },
]

// Assignments
export interface Assignment {
  id: string
  title: string
  description: string
  subject: string
  dueDate: string
  assignedTo: string[]
  status: "진행중" | "마감" | "제출완료"
  submittedAt?: string
  files?: string[]
}

// Submissions
export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  studentName: string
  submittedAt: string
  fileName: string
  grade?: number | null
  feedback?: string
}

export const submissions: Submission[] = [
  {
    id: "sub-1",
    assignmentId: "assign-1",
    studentId: "user-2",
    studentName: "이서연",
    submittedAt: "2026-02-13",
    fileName: "미적분_연습문제풀이_이서연.pdf",
    grade: 92,
    feedback: "풀이 과정이 매우 논리적입니다. 15번 문제의 치환 과정 설명을 조금 더 구체적으로 작성하면 좋겠습니다.",
  },
  {
    id: "sub-2",
    assignmentId: "assign-1",
    studentId: "user-3",
    studentName: "정하준",
    submittedAt: "2026-02-14",
    fileName: "미적분_연습문제풀이_정하준.pdf",
    grade: null,
    feedback: undefined,
  },
  {
    id: "sub-3",
    assignmentId: "assign-2",
    studentId: "user-4",
    studentName: "최은서",
    submittedAt: "2026-02-11",
    fileName: "수열_심화문제풀이_최은서.pdf",
    grade: 88,
    feedback: "풀이 접근 방식이 좋습니다. 일반항 도출 과정을 조금 더 정리해보세요.",
  },
  {
    id: "sub-4",
    assignmentId: "assign-3",
    studentId: "user-2",
    studentName: "이서연",
    submittedAt: "2026-02-09",
    fileName: "확률과통계_기출분석_이서연.pdf",
    grade: 95,
    feedback: "문제 유형 분석이 정확합니다. 계산 실수 없이 깔끔한 풀이입니다.",
  },
  {
    id: "sub-5",
    assignmentId: "assign-4",
    studentId: "user-1",
    studentName: "김민준",
    submittedAt: "2026-02-04",
    fileName: "벡터_내적과외적_김민준.pdf",
    grade: 90,
    feedback: "벡터 개념 이해도가 높습니다. 풀이 설명을 조금 더 상세히 작성하면 좋겠습니다.",
  },
  {
    id: "sub-6",
    assignmentId: "assign-3",
    studentId: "user-1",
    studentName: "김민준",
    submittedAt: "2026-02-09",
    fileName: "확률과통계_기출분석_김민준.pdf",
    grade: null,
    feedback: undefined,
  },
  {
    id: "sub-7",
    assignmentId: "assign-2",
    studentId: "user-1",
    studentName: "김민준",
    submittedAt: "2026-02-11",
    fileName: "수열_심화문제풀이_김민준.pdf",
    grade: 85,
    feedback: "풀이 아이디어는 좋습니다. 수식 정리를 조금 더 명확히 해보세요.",
  },
];

export const assignments: Assignment[] = [
  {
    id: "assign-1",
    title: "미적분 연습문제 풀이",
    description: "교재 Chapter 5 미분 단원 연습문제 1~20번을 풀이과정과 함께 작성하여 제출하세요.",
    subject: "수학",
    dueDate: "2026-02-15",
    assignedTo: ["user-1", "user-2", "user-3"],
    status: "진행중",
  },
  {
    id: "assign-2",
    title: "수열 심화 문제 풀이",
    description: "등차·등비수열 및 점화식 관련 심화문제 10문제를 풀이과정과 함께 제출하세요.",
    subject: "수학",
    dueDate: "2026-02-12",
    assignedTo: ["user-1", "user-4"],
    status: "진행중",
  },
  {
    id: "assign-3",
    title: "확률과 통계 기출 분석",
    description: "최근 3개년 모의고사 확률과 통계 문제를 유형별로 분석하고 풀이를 정리하세요.",
    subject: "수학",
    dueDate: "2026-02-10",
    assignedTo: ["user-1", "user-2"],
    status: "진행중",
  },
  {
    id: "assign-4",
    title: "벡터 단원 정리 과제",
    description: "벡터의 내적·외적 개념을 정리하고 대표 문제 5개를 풀이하여 제출하세요.",
    subject: "수학",
    dueDate: "2026-02-05",
    assignedTo: ["user-1"],
    status: "제출완료",
    submittedAt: "2026-02-04",
  },
  {
    id: "assign-5",
    title: "2월 모의고사 오답노트",
    description: "2월 모의고사 수학 영역 오답 문제를 분석하고 풀이 과정을 정리하세요.",
    subject: "수학",
    dueDate: "2026-02-03",
    assignedTo: ["user-1", "user-3"],
    status: "마감",
  },
  {
    id: "assign-6",
    title: "삼각함수 기본 개념 정리",
    description: "삼각함수의 정의, 그래프, 주기성을 정리하고 기본 문제 15개를 풀이하세요.",
    subject: "수학",
    dueDate: "2026-02-20",
    assignedTo: ["user-1", "user-2", "user-3", "user-4"],
    status: "진행중",
  },
  {
    id: "assign-7",
    title: "함수의 연속과 미분가능성",
    description: "연속성과 미분가능성의 관계를 설명하고 반례를 찾아 제출하세요.",
    subject: "수학",
    dueDate: "2026-02-18",
    assignedTo: ["user-1", "user-2"],
    status: "진행중",
  },
  {
    id: "assign-8",
    title: "1월 모의고사 전과목 분석",
    description: "1월 모의고사 성적표를 분석하여 약점 과목과 개선 계획을 작성하세요.",
    subject: "종합",
    dueDate: "2026-02-08",
    assignedTo: ["user-1", "user-3", "user-4"],
    status: "마감",
  },
  {
    id: "assign-9",
    title: "지수와 로그 심화 문제",
    description: "지수함수와 로그함수의 성질을 이용한 심화 문제 20개를 풀고 풀이를 제출하세요.",
    subject: "수학",
    dueDate: "2026-02-25",
    assignedTo: ["user-1", "user-2", "user-3"],
    status: "진행중",
  },
  {
    id: "assign-10",
    title: "적분과 넓이 계산 연습",
    description: "정적분의 성질을 이용하여 곡선으로 둘러싸인 넓이를 구하는 문제를 풀이하세요.",
    subject: "수학",
    dueDate: "2026-02-22",
    assignedTo: ["user-1", "user-4"],
    status: "진행중",
  },
];

// Assistant Admin Management
export interface AssistantInvite {
  id: string
  name: string
  email: string
  invitedAt: string
  inviteCount: number
  lastInvitedAt: string
}

export interface AssistantSignup {
  id: string
  name: string
  email: string
  signedUpAt: string
  status: "대기중" | "수락" | "거절"
}

export interface Assistant {
  id: string
  name: string
  email: string
  assignedAt: string
}

export const assistantInvites: AssistantInvite[] = [
  {
    id: "invite-1",
    name: "박준호",
    email: "park.junho@example.com",
    invitedAt: "2026-02-01",
    inviteCount: 3,
    lastInvitedAt: "2026-02-20",
  },
  {
    id: "invite-2",
    name: "최수진",
    email: "choi.sujin@example.com",
    invitedAt: "2026-02-05",
    inviteCount: 2,
    lastInvitedAt: "2026-02-18",
  },
];

export const assistantSignups: AssistantSignup[] = [
  {
    id: "signup-1",
    name: "이준호",
    email: "lee.junho@example.com",
    signedUpAt: "2026-02-22",
    status: "대기중",
  },
  {
    id: "signup-2",
    name: "김민지",
    email: "kim.minji@example.com",
    signedUpAt: "2026-02-21",
    status: "대기중",
  },
];

export const assistants: Assistant[] = [
  {
    id: "asst-1",
    name: "손현우",
    email: "sohn.hyunwoo@example.com",
    assignedAt: "2026-01-15",
  },
  {
    id: "asst-2",
    name: "정유진",
    email: "jung.yujin@example.com",
    assignedAt: "2026-02-01",
  },
];
