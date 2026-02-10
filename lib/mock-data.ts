// Mock user data
export type UserRole = "student" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  grade: string
  phone: string
}

export const currentUser: User = {
  id: "user-1",
  name: "김민준",
  email: "minjun@example.com",
  role: "student",
  grade: "고등학교 2학년",
  phone: "010-1234-5678",
}

export const adminUser: User = {
  id: "admin-1",
  name: "박선생",
  email: "admin@example.com",
  role: "admin",
  grade: "",
  phone: "010-9999-0000",
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
  answer?: string
  answeredAt?: string
}

export const qnaPosts: QnaPost[] = [
  {
    id: "qna-1",
    authorId: "user-1",
    authorName: "김민준",
    title: "수학 미적분 문제 질문드립니다",
    content: "교재 145페이지 3번 문제에서 치환적분 과정이 이해가 안됩니다. 어떤 치환을 사용해야 하는지 설명 부탁드립니다.",
    createdAt: "2026-02-08",
    isPrivate: true,
    answer: "해당 문제는 t = x+1로 치환하면 쉽게 풀 수 있습니다. 자세한 풀이는 다음 수업 시간에 설명드리겠습니다.",
    answeredAt: "2026-02-09",
  },
  {
    id: "qna-2",
    authorId: "user-2",
    authorName: "이서연",
    title: "영어 에세이 첨삭 요청합니다",
    content: "이번 주 과제로 제출한 에세이 첨삭 부탁드립니다. 특히 결론 부분이 약한 것 같습니다.",
    createdAt: "2026-02-07",
    isPrivate: true,
  },
  {
    id: "qna-3",
    authorId: "user-3",
    authorName: "정하준",
    title: "과학 실험 보고서 양식 문의",
    content: "실험 보고서 양식을 어디서 다운로드할 수 있나요?",
    createdAt: "2026-02-06",
    isPrivate: true,
    answer: "복습 영상 게시판의 과학 카테고리 자료실에서 다운로드 가능합니다.",
    answeredAt: "2026-02-06",
  },
  {
    id: "qna-4",
    authorId: "user-4",
    authorName: "최은서",
    title: "국어 모의고사 범위 확인",
    content: "다음 주 국어 모의고사 범위가 어디까지인지 확인 부탁드립니다.",
    createdAt: "2026-02-05",
    isPrivate: true,
  },
  {
    id: "qna-5",
    authorId: "user-5",
    authorName: "박지호",
    title: "수업 시간 변경 가능한가요?",
    content: "월요일 수업을 화요일로 변경할 수 있을까요? 학교 일정이 겹칩니다.",
    createdAt: "2026-02-04",
    isPrivate: true,
    answer: "네, 화요일 같은 시간대로 변경 가능합니다. 다음 주부터 적용하겠습니다.",
    answeredAt: "2026-02-05",
  },
]

// Lecture Video Board
export interface LectureCategory {
  id: string
  name: string
  description: string
  instructor: string
  thumbnail: string
  courseCount: number
  color: string
}

export interface Course {
  id: string
  categoryId: string
  name: string
  lessonCount: number
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  videoUrl: string
  duration: string
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
    name: "수학",
    description: "미적분, 확률과 통계, 기하 등",
    instructor: "박선생",
    thumbnail: "",
    courseCount: 3,
    color: "bg-blue-500",
  },
  {
    id: "cat-2",
    name: "영어",
    description: "독해, 문법, 듣기 등",
    instructor: "이선생",
    thumbnail: "",
    courseCount: 2,
    color: "bg-emerald-500",
  },
  {
    id: "cat-3",
    name: "국어",
    description: "문학, 비문학, 화법과 작문 등",
    instructor: "최선생",
    thumbnail: "",
    courseCount: 2,
    color: "bg-amber-500",
  },
  {
    id: "cat-4",
    name: "과학",
    description: "물리, 화학, 생명과학 등",
    instructor: "김선생",
    thumbnail: "",
    courseCount: 3,
    color: "bg-rose-500",
  },
]

export const courses: Course[] = [
  { id: "course-1", categoryId: "cat-1", name: "미적분 기초반", lessonCount: 3 },
  { id: "course-2", categoryId: "cat-1", name: "확률과 통계", lessonCount: 0 },
  { id: "course-3", categoryId: "cat-1", name: "기하 심화반", lessonCount: 0 },
  { id: "course-4", categoryId: "cat-2", name: "수능 독해 마스터", lessonCount: 0 },
  { id: "course-5", categoryId: "cat-2", name: "영문법 완성", lessonCount: 0 },
  { id: "course-6", categoryId: "cat-3", name: "문학 개념 정리", lessonCount: 0 },
  { id: "course-7", categoryId: "cat-3", name: "비문학 독해 전략", lessonCount: 0 },
  { id: "course-8", categoryId: "cat-4", name: "물리학 I", lessonCount: 0 },
  { id: "course-9", categoryId: "cat-4", name: "화학 I", lessonCount: 0 },
  { id: "course-10", categoryId: "cat-4", name: "생명과학 I", lessonCount: 0 },
]

export const lessons: Lesson[] = [
  {
    id: "lesson-1",
    courseId: "course-1",
    title: "함수의 극한과 연속",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "45:30",
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
    duration: "50:15",
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
    duration: "42:00",
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
  status: "접수완료" | "상담진행중" | "답변완료"
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
    status: "상담진행중",
  },
  {
    id: "consult-3",
    authorId: "user-3",
    authorName: "정하준",
    title: "학습 스케줄 조정 상담",
    content: "학교 내신과 수능 준비를 병행하려면 어떻게 스케줄을 짜면 좋을까요?",
    createdAt: "2026-02-05",
    status: "접수완료",
  },
]

export const instructors = [
  {
    name: "박선생",
    subject: "수학",
    description: "서울대학교 수학교육과 출신, 10년 경력의 수학 전문 강사",
    image: "",
  },
  {
    name: "이선생",
    subject: "영어",
    description: "연세대학교 영어영문학과 출신, TOEFL 만점 강사",
    image: "",
  },
  {
    name: "최선생",
    subject: "국어",
    description: "고려대학교 국어국문학과 출신, EBS 출제위원 경력",
    image: "",
  },
  {
    name: "김선생",
    subject: "과학",
    description: "KAIST 물리학과 출신, 과학 올림피아드 지도 경력",
    image: "",
  },
]

// Students list (for admin view)
export interface Student {
  id: string
  name: string
  grade: string
}

export const students: Student[] = [
  { id: "user-1", name: "김민준", grade: "고등학교 2학년" },
  { id: "user-2", name: "이서연", grade: "고등학교 2학년" },
  { id: "user-3", name: "정하준", grade: "고등학교 1학년" },
  { id: "user-4", name: "최은서", grade: "고등학교 3학년" },
  { id: "user-5", name: "박지호", grade: "고등학교 2학년" },
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
    fileName: "미적분_연습문제_이서연.pdf",
    grade: 92,
    feedback: "풀이 과정이 매우 깔끔합니다. 15번 문제의 치환 과정을 조금 더 보완하면 좋겠습니다.",
  },
  {
    id: "sub-2",
    assignmentId: "assign-1",
    studentId: "user-3",
    studentName: "정하준",
    submittedAt: "2026-02-14",
    fileName: "미적분_풀이_정하준.pdf",
    grade: null,
    feedback: undefined,
  },
  {
    id: "sub-3",
    assignmentId: "assign-2",
    studentId: "user-4",
    studentName: "최은서",
    submittedAt: "2026-02-11",
    fileName: "영어에세이_최은서.docx",
    grade: 88,
    feedback: "논리적 전개가 좋습니다. 결론 부분을 좀 더 강화해보세요.",
  },
  {
    id: "sub-4",
    assignmentId: "assign-3",
    studentId: "user-2",
    studentName: "이서연",
    submittedAt: "2026-02-09",
    fileName: "비문학분석_이서연.hwp",
    grade: 95,
    feedback: "구조 분석이 정확합니다. 모범 답안 수준입니다.",
  },
  {
    id: "sub-5",
    assignmentId: "assign-4",
    studentId: "user-1",
    studentName: "김민준",
    submittedAt: "2026-02-04",
    fileName: "자유낙하실험_김민준.pdf",
    grade: 90,
    feedback: "실험 데이터 분석이 정확합니다.",
  },
  {
    id: "sub-6",
    assignmentId: "assign-3",
    studentId: "user-1",
    studentName: "김민준",
    submittedAt: "2026-02-09",
    fileName: "비문학분석_김민준.hwp",
    grade: null,
    feedback: undefined,
  },
  {
    id: "sub-7",
    assignmentId: "assign-2",
    studentId: "user-1",
    studentName: "김민준",
    submittedAt: "2026-02-11",
    fileName: "영어에세이_김민준.docx",
    grade: 85,
    feedback: "어휘력은 우수하나 문법적 오류가 일부 있습니다.",
  },
]

export const assignments: Assignment[] = [
  {
    id: "assign-1",
    title: "미적분 연습문제 풀이",
    description: "교재 Chapter 5 연습문제 1~20번을 풀고 풀이과정을 작성하여 제출하세요.",
    subject: "수학",
    dueDate: "2026-02-15",
    assignedTo: ["user-1", "user-2", "user-3"],
    status: "진행중",
  },
  {
    id: "assign-2",
    title: "영어 에세이 작성",
    description: "'Climate Change and Our Future'라는 주제로 500단어 이상의 에세이를 작성하세요.",
    subject: "영어",
    dueDate: "2026-02-12",
    assignedTo: ["user-1", "user-4"],
    status: "진행중",
  },
  {
    id: "assign-3",
    title: "국어 비문학 지문 분석",
    description: "제공된 비문학 지문 3개를 읽고 구조 분석표를 작성하세요.",
    subject: "국어",
    dueDate: "2026-02-10",
    assignedTo: ["user-1", "user-2"],
    status: "진행중",
  },
  {
    id: "assign-4",
    title: "물리 실험 보고서",
    description: "자유낙하 실험 보고서를 양식에 맞춰 작성하세요.",
    subject: "과학",
    dueDate: "2026-02-05",
    assignedTo: ["user-1"],
    status: "제출완료",
    submittedAt: "2026-02-04",
  },
  {
    id: "assign-5",
    title: "수학 모의고사 오답노트",
    description: "2월 모의고사 틀린 문제의 오답노트를 작성하세요.",
    subject: "수학",
    dueDate: "2026-02-03",
    assignedTo: ["user-1", "user-3"],
    status: "마감",
  },
]
