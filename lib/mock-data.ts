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
  name: "서이연",
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
];

// Lecture Video Board
export interface LectureCategory {
  id: string
  name: string
  description: string
  instructor: string
  thumbnail: string
  courseCount: number
  assignedTo: string[]
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
    assignedTo: ["user-1", "user-2", "user-3"],
  },
  {
    id: "cat-2",
    name: "수열",
    description: "등차·등비수열, 점화식, 귀납법",
    instructor: "서이연",
    thumbnail: "",
    courseCount: 3,
    assignedTo: ["user-1", "user-4"],
  },
  {
    id: "cat-3",
    name: "확률과 통계",
    description: "확률, 경우의 수, 통계 추론",
    instructor: "서이연",
    thumbnail: "",
    courseCount: 3,
    assignedTo: [],
  },
  {
    id: "cat-4",
    name: "기하와 벡터",
    description: "평면벡터, 공간도형, 기하적 해석",
    instructor: "서이연",
    thumbnail: "",
    courseCount: 2,
    assignedTo: ["user-1", "user-3"],
  },
  {
    id: "cat-5",
    name: "모의고사 분석",
    description: "기출 분석, 오답 정리, 유형별 전략",
    instructor: "서이연",
    thumbnail: "",
    courseCount: 2,
    assignedTo: [],
  },
];

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
];
