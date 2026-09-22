import { ClassRoom, Student, Task, DocumentItem, Quiz, QuizResult, AppNotification } from '../types';

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: '11/1',
    name: '11/1',
    grade: 11,
    room: 'Phòng 201 - Tầng 2 (Dãy nhà B)',
    academicYear: '2025 - 2026',
    homeroomTeacher: 'Nguyễn Văn Khuyên',
    description: 'Lớp chuyên ban Tự nhiên (Toán - Lý - Hóa) - Ôn tập nâng cao & Học sinh giỏi'
  },
  {
    id: '11/4',
    name: '11/4',
    grade: 11,
    room: 'Phòng 204 - Tầng 2 (Dãy nhà B)',
    academicYear: '2025 - 2026',
    homeroomTeacher: 'Lê Văn Hoàng',
    description: 'Lớp định hướng Khoa học Tự nhiên & Công nghệ'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std_01',
    name: 'Nguyễn Hoàng Long',
    code: 'HS110101',
    classId: '11/1',
    gender: 'Nam',
    dob: '2008-04-15',
    academicStatus: 'Xuất sắc',
    phone: '0912 345 601',
    email: 'long.nh111@duytan.edu.vn',
    notes: 'Đội tuyển Học sinh giỏi Toán cấp Tỉnh, lớp trưởng nhiệt tình'
  },
  {
    id: 'std_02',
    name: 'Trần Mai Anh',
    code: 'HS110102',
    classId: '11/1',
    gender: 'Nữ',
    dob: '2008-08-22',
    academicStatus: 'Giỏi',
    phone: '0912 345 602',
    email: 'anh.tm111@duytan.edu.vn',
    notes: 'Học đều các môn, tích cực phát biểu xây dựng bài'
  },
  {
    id: 'std_03',
    name: 'Lê Quốc Bảo',
    code: 'HS110103',
    classId: '11/1',
    gender: 'Nam',
    dob: '2008-01-10',
    academicStatus: 'Xuất sắc',
    phone: '0912 345 603',
    email: 'bao.lq111@duytan.edu.vn',
    notes: 'Tư duy logic tốt, điểm môn Toán & Vật lý luôn đứng đầu khối'
  },
  {
    id: 'std_04',
    name: 'Phạm Thu Thảo',
    code: 'HS110104',
    classId: '11/1',
    gender: 'Nữ',
    dob: '2008-11-05',
    academicStatus: 'Khá',
    phone: '0912 345 604',
    email: 'thao.pt111@duytan.edu.vn',
    notes: 'Cần ôn tập thêm phần Hình học không gian'
  },
  {
    id: 'std_05',
    name: 'Đặng Tuấn Kiệt',
    code: 'HS110105',
    classId: '11/1',
    gender: 'Nam',
    dob: '2008-06-18',
    academicStatus: 'Cần cố gắng',
    phone: '0912 345 605',
    email: 'kiet.dt111@duytan.edu.vn',
    notes: 'Thầy Khuyên đang phụ đạo thêm vào thứ 5 hàng tuần'
  },
  {
    id: 'std_06',
    name: 'Vũ Minh Trang',
    code: 'HS110106',
    classId: '11/1',
    gender: 'Nữ',
    dob: '2008-09-30',
    academicStatus: 'Giỏi',
    phone: '0912 345 606',
    email: 'trang.vm111@duytan.edu.vn',
    notes: 'Bí thư chi đoàn gương mẫu, điểm trung bình 8.8'
  },
  {
    id: 'std_09',
    name: 'Đỗ Hải Đăng',
    code: 'HS110401',
    classId: '11/4',
    gender: 'Nam',
    dob: '2009-05-20',
    academicStatus: 'Xuất sắc',
    phone: '0912 345 609',
    email: 'dang.dh114@duytan.edu.vn',
    notes: 'Đam mê lập trình Tin học và nghiên cứu khoa học kỹ thuật'
  },
  {
    id: 'std_10',
    name: 'Hoàng Mỹ Duyên',
    code: 'HS110402',
    classId: '11/4',
    gender: 'Nữ',
    dob: '2009-07-09',
    academicStatus: 'Giỏi',
    phone: '0912 345 610',
    email: 'duyen.hm114@duytan.edu.vn',
    notes: 'Nắm vững kiến thức căn bản, làm việc nhóm tốt'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_01',
    title: 'Ôn tập chuyên đề Khảo sát hàm số & Ứng dụng đạo hàm',
    description: 'Học sinh làm các bài tập từ câu 1 đến câu 25 trong phiếu học tập tuần 4. Chú ý vẽ bảng biến thiên cẩn thận và xác định đúng tiệm cận đứng, tiệm cận ngang.',
    subject: 'Toán học',
    classId: '11/1',
    dueDate: '2026-09-25',
    priority: 'Cao',
    status: 'Đang làm',
    createdAt: '2026-09-18',
    submissions: [
      { studentId: 'std_01', studentName: 'Nguyễn Hoàng Long', status: 'Đã hoàn thành', submittedAt: '2026-09-20 19:30', note: 'Em đã hoàn thành đủ 25 câu và vẽ đồ thị chi tiết.' },
      { studentId: 'std_03', studentName: 'Lê Quốc Bảo', status: 'Đã hoàn thành', submittedAt: '2026-09-21 21:15', note: 'Đã nộp bài giải chi tiết đính kèm.' },
      { studentId: 'std_02', studentName: 'Trần Mai Anh', status: 'Đang làm', note: 'Em đang làm câu 20-25' },
      { studentId: 'std_04', studentName: 'Phạm Thu Thảo', status: 'Chưa làm' },
      { studentId: 'std_05', studentName: 'Đặng Tuấn Kiệt', status: 'Chưa làm' },
      { studentId: 'std_06', studentName: 'Vũ Minh Trang', status: 'Đã hoàn thành', submittedAt: '2026-09-21 16:45', note: 'Đã kiểm tra lại kết quả với bạn Long.' }
    ]
  },
  {
    id: 'task_03',
    title: 'Viết bài văn nghị luận xã hội: Ý chí vươn lên trong thời đại số',
    description: 'Bài viết khoảng 600 từ. Nêu rõ thực trạng, dẫn chứng tiêu biểu về thanh niên Việt Nam và bài học rút ra cho bản thân học sinh trường Duy Tân.',
    subject: 'Ngữ văn',
    classId: '11/1',
    dueDate: '2026-09-22',
    priority: 'Trung bình',
    status: 'Quá hạn',
    createdAt: '2026-09-12',
    submissions: [
      { studentId: 'std_01', studentName: 'Nguyễn Hoàng Long', status: 'Đã hoàn thành', submittedAt: '2026-09-21 10:00', note: 'Bài viết đạt 9 trang vở' },
      { studentId: 'std_02', studentName: 'Trần Mai Anh', status: 'Đã hoàn thành', submittedAt: '2026-09-20 08:30' },
      { studentId: 'std_04', studentName: 'Phạm Thu Thảo', status: 'Quá hạn' },
      { studentId: 'std_05', studentName: 'Đặng Tuấn Kiệt', status: 'Quá hạn' }
    ]
  },
  {
    id: 'task_04',
    title: 'Luyện tập phát âm và ngữ pháp: Câu điều kiện loại 1, 2, 3 và hỗn hợp',
    description: 'Hoàn thành các bài tập chia động từ trong sách bài tập trang 34-36. Chuẩn bị 3 câu hỏi để thảo luận nhóm vào tiết học tiếp theo.',
    subject: 'Tiếng Anh',
    classId: '11/4',
    dueDate: '2026-09-26',
    priority: 'Thấp',
    status: 'Đang làm',
    createdAt: '2026-09-19',
    submissions: [
      { studentId: 'std_09', studentName: 'Đỗ Hải Đăng', status: 'Đã hoàn thành', submittedAt: '2026-09-21 20:00' },
      { studentId: 'std_10', studentName: 'Hoàng Mỹ Duyên', status: 'Đang làm' }
    ]
  },
  {
    id: 'task_05',
    title: 'Thực hành lập trình Python: Cấu trúc rẽ nhánh & Vòng lặp for',
    description: 'Viết chương trình giải bài toán tìm số nguyên tố trong khoảng từ 1 đến N và xuất ra màn hình console theo định dạng yêu cầu.',
    subject: 'Tin học',
    classId: 'Tất cả',
    dueDate: '2026-09-28',
    priority: 'Cao',
    status: 'Đang làm',
    createdAt: '2026-09-20',
    submissions: [
      { studentId: 'std_01', studentName: 'Nguyễn Hoàng Long', status: 'Đang làm' },
      { studentId: 'std_03', studentName: 'Lê Quốc Bảo', status: 'Đã hoàn thành', submittedAt: '2026-09-21 15:10', note: 'File .py đã kiểm tra chạy test case 100/100' },
      { studentId: 'std_09', studentName: 'Đỗ Hải Đăng', status: 'Đã hoàn thành', submittedAt: '2026-09-20 22:30' }
    ]
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc_01',
    title: 'Đề cương tổng ôn Toán 12 - Học kỳ 1 (THPT Duy Tân)',
    description: 'Tổng hợp toàn bộ công thức Đạo hàm, Khảo sát hàm số, Hàm số mũ - Logarit và Hình học không gian Oxyz kèm 150 câu bài tập có đáp án.',
    subject: 'Toán học',
    category: 'Đề cương học kỳ',
    grade: 12,
    fileType: 'pdf',
    fileSize: '4.8 MB',
    uploadDate: '2026-09-15',
    author: 'Thầy Nguyễn Văn Khuyên',
    readTime: '45 phút đọc',
    url: 'https://duytan.edu.vn/tai-lieu/toan-12-hk1.pdf',
    previewContent: `NỘI DUNG CHÍNH:
1. Đạo hàm và ứng dụng khảo sát sự biến thiên của hàm số:
   - Tính đơn điệu: y' >= 0 trên K => hàm số đồng biến.
   - Cực trị: Điểm cực đại, cực tiểu thông qua dấu của đạo hàm cấp một và cấp hai.
   - Giá trị lớn nhất, nhỏ nhất trên đoạn [a; b].
2. Hàm số Lũy thừa, Mũ và Logarit:
   - Các công thức biến đổi cơ bản log_a(x.y) = log_a(x) + log_a(y).
   - Phương trình mũ và logarit cơ bản.
3. Hình học tọa độ Oxyz trong không gian:
   - Tọa độ vectơ, tích có hướng và ứng dụng tính diện tích, thể tích.
   - Phương trình mặt phẳng và mặt cầu.`
  },
  {
    id: 'doc_02',
    title: 'Slide bài giảng: Quy tắc tính đạo hàm và ý nghĩa hình học',
    description: 'Tài liệu trình chiếu điện tử chi tiết các bước tiếp tuyến, minh họa đồ thị trực quan và các dạng bài tập thực tế thường gặp trong đề thi.',
    subject: 'Toán học',
    category: 'Bài giảng điện tử',
    grade: 12,
    fileType: 'pptx',
    fileSize: '12.5 MB',
    uploadDate: '2026-09-10',
    author: 'Thầy Nguyễn Văn Khuyên',
    readTime: '30 slide',
    previewContent: `BÀI GIẢNG ĐIỆN TỬ - TỔ TOÁN THPT DUY TÂN
- Slide 1: Đặt vấn đề từ vận tốc tức thời và tiếp tuyến đường cong.
- Slide 2: Định nghĩa đạo hàm bằng giới hạn tỉ số gia phân.
- Slide 3: Bảng công thức đạo hàm hàm số sơ cấp và hàm hợp.
- Slide 4-15: Phương trình tiếp tuyến tại một điểm, đi qua một điểm, song song hoặc vuông góc với đường thẳng cho trước.
- Slide 16-30: Các ví dụ trắc nghiệm 30 giây rèn phản xạ tính nhanh.`
  },
  {
    id: 'doc_03',
    title: 'Chuyên đề: 100 câu trắc nghiệm Vật lý Chuyển động thẳng biến đổi đều',
    description: 'Phân loại từ mức độ Nhận biết, Thông hiểu đến Vận dụng cao, có phân tích sai lầm học sinh thường mắc phải khi chọn hệ quy chiếu.',
    subject: 'Vật lý',
    category: 'Bài tập trắc nghiệm',
    grade: 10,
    fileType: 'pdf',
    fileSize: '3.2 MB',
    uploadDate: '2026-09-12',
    author: 'Tổ Vật lý - Công nghệ',
    readTime: '60 phút',
    previewContent: `CHUYÊN ĐỀ VẬT LÝ 10 - CHƯƠNG ĐỘNG HỌC
- Công thức vận tốc: v = v0 + at.
- Công thức quãng đường: s = v0.t + 0.5 * a * t^2.
- Hệ thức độc lập thời gian: v^2 - v0^2 = 2as.
- Chú ý dấu của gia tốc a: Nhanh dần đều a.v > 0, chậm dần đều a.v < 0.
- Tuyển tập 25 câu phân loại có lời giải ngắn gọn.`
  },
  {
    id: 'doc_04',
    title: 'Sổ tay tổng hợp ngữ pháp Tiếng Anh 10 - 11 - 12 (Trọng tâm THPT)',
    description: 'Sơ đồ tư duy (Mindmap) về 12 thì tiếng Anh, mệnh đề quan hệ, câu gián tiếp, thể bị động và cụm động từ (Phrasal Verbs) thường xuất hiện.',
    subject: 'Tiếng Anh',
    category: 'Chuyên đề ôn tập',
    grade: 'Tất cả',
    fileType: 'docx',
    fileSize: '2.1 MB',
    uploadDate: '2026-09-14',
    author: 'Cô Trần Thị Mai Lan',
    readTime: '40 phút',
    previewContent: `ENGLISH GRAMMAR HANDBOOK - DUY TAN HIGH SCHOOL
1. Tenses Review: Present Perfect vs Simple Past, Past Continuous.
2. Relative Clauses: Defining vs Non-defining; Which, Who, Whom, Whose, That.
3. Conditionals: Type 1, 2, 3, Mixed & Inversion.
4. Passive Voice with reporting verbs (It is believed that... / He is said to...).
5. Key Collocations for High School Graduation Exam.`
  },
  {
    id: 'doc_05',
    title: 'Video bài giảng: Hướng dẫn kỹ thuật giải bài toán Tối ưu hóa thực tế bằng Đạo hàm',
    description: 'Bài giảng ghi hình thực tế của Thầy Khuyên: Ứng dụng đạo hàm giải bài toán chi phí nhỏ nhất, thể tích hộp lớn nhất, tối ưu năng suất.',
    subject: 'Toán học',
    category: 'Bài giảng điện tử',
    grade: 12,
    fileType: 'video',
    fileSize: '150 MB (Stream)',
    uploadDate: '2026-09-16',
    author: 'Thầy Nguyễn Văn Khuyên',
    readTime: '24 phút video',
    url: 'https://duytan.edu.vn/video/bai-toan-thuc-te-dao-ham',
    previewContent: `VIDEO BÀI GIẢNG CHUYÊN SÂU
Thời lượng: 24:15 phút
Giảng viên: Thầy Nguyễn Văn Khuyên - THPT Duy Tân
Nội dung:
- Phút 01-05: Phương pháp 4 bước chuyển đổi bài toán thực tế sang hàm số f(x).
- Phút 06-15: Bài toán làm máng nước bằng tôn và cắt 4 góc tấm kim loại để gấp thành hộp chữ nhật.
- Phút 16-22: Bài toán tối ưu hóa chi phí đường ống dẫn nước ngầm.
- Phút 23-24: Đúc kết kỹ thuật bấm máy tính Casio fx-880BTG kiểm tra nhanh.`
  },
  {
    id: 'doc_06',
    title: 'Tuyển tập Đề kiểm tra giữa học kỳ 1 các năm trước (Kèm Đáp án chuẩn)',
    description: 'Bao gồm 5 đề thi của trường THPT Duy Tân từ năm 2022 đến 2025, có ma trận đề thi và bảng phân bố điểm chuẩn của Sở GD&ĐT.',
    subject: 'Toán học',
    category: 'Đề cương học kỳ',
    grade: 11,
    fileType: 'pdf',
    fileSize: '5.1 MB',
    uploadDate: '2026-09-11',
    author: 'Tổ Toán THPT Duy Tân',
    readTime: '90 phút làm đề'
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz_01',
    title: 'Kiểm tra 15 phút: Cực trị & Sự biến thiên của hàm số (Toán 11)',
    subject: 'Toán học',
    grade: 11,
    classId: '11/1',
    timeLimitMinutes: 15,
    totalQuestions: 5,
    createdAt: '2026-09-18',
    description: 'Đánh giá mức độ nắm vững quy tắc tìm cực trị hàm số đa thức bậc 3, hàm số trùng phương và hàm phân thức bậc nhất trên bậc nhất.',
    questions: [
      {
        id: 'q1_1',
        questionText: 'Cho hàm số y = f(x) có đạo hàm f\'(x) = x(x - 1)(x + 2)^2 với mọi x thuộc R. Số điểm cực trị của hàm số đã cho là:',
        options: [
          'A. 1 điểm',
          'B. 2 điểm',
          'C. 3 điểm',
          'D. 4 điểm'
        ],
        correctAnswerIndex: 1, // B. 2 điểm
        explanation: 'Ta có f\'(x) = 0 <=> x = 0, x = 1 hoặc x = -2. Nghiệm x = -2 là nghiệm bội chẵn (bậc 2) nên qua x = -2 thì f\'(x) không đổi dấu. Chỉ có 2 nghiệm đơn x = 0 và x = 1 làm f\'(x) đổi dấu. Do đó hàm số có đúng 2 điểm cực trị.'
      },
      {
        id: 'q1_2',
        questionText: 'Giá trị cực tiểu của hàm số y = x^3 - 3x + 2 là:',
        options: [
          'A. y = 4',
          'B. y = 0',
          'C. y = 2',
          'D. y = -1'
        ],
        correctAnswerIndex: 1, // B. 0
        explanation: 'y\' = 3x^2 - 3 = 3(x^2 - 1). y\' = 0 <=> x = 1 hoặc x = -1. Bảng biến thiên cho thấy hàm số đạt cực tiểu tại x = 1. Giá trị cực tiểu là y(1) = 1^3 - 3(1) + 2 = 0.'
      },
      {
        id: 'q1_3',
        questionText: 'Đường tiệm cận đứng của đồ thị hàm số y = (2x + 1) / (x - 3) là đường thẳng có phương trình:',
        options: [
          'A. x = 3',
          'B. y = 2',
          'C. x = -3',
          'D. y = -1/2'
        ],
        correctAnswerIndex: 0, // A. x = 3
        explanation: 'Mẫu số triệt tiêu tại x = 3 và tử số tại x = 3 là 2(3)+1 = 7 khác 0. Do đó lim (khi x -> 3) của y = vô cực, phương trình tiệm cận đứng là x = 3.'
      },
      {
        id: 'q1_4',
        questionText: 'Hàm số nào dưới đây đồng biến trên toàn bộ tập xác định R?',
        options: [
          'A. y = (x - 1) / (x + 2)',
          'B. y = x^4 + 2x^2 + 1',
          'C. y = x^3 + 3x - 5',
          'D. y = -x^3 - x'
        ],
        correctAnswerIndex: 2, // C. y = x^3 + 3x - 5
        explanation: 'Với y = x^3 + 3x - 5, ta có y\' = 3x^2 + 3 = 3(x^2 + 1) > 0 với mọi x thuộc R. Vì vậy hàm số đồng biến trên toàn bộ R.'
      },
      {
        id: 'q1_5',
        questionText: 'Cho hàm số y = f(x) liên tục trên đoạn [-1; 3] và có đồ thị như hình vẽ. Giá trị lớn nhất của hàm số trên [-1; 3] đạt tại điểm nào nếu f(-1) = 2, f(1) = 5, f(3) = 1?',
        options: [
          'A. x = -1',
          'B. x = 1 (với max y = 5)',
          'C. x = 3',
          'D. x = 5'
        ],
        correctAnswerIndex: 1, // B. x = 1
        explanation: 'So sánh các giá trị hàm số: f(-1) = 2, f(1) = 5, f(3) = 1. Giá trị lớn nhất là 5, đạt được tại x = 1.'
      }
    ]
  },
  {
    id: 'quiz_03',
    title: 'Trắc nghiệm nhanh: Ngữ pháp & Trọng âm Tiếng Anh THPT',
    subject: 'Tiếng Anh',
    grade: 11,
    classId: '11/4',
    timeLimitMinutes: 15,
    totalQuestions: 4,
    createdAt: '2026-09-19',
    description: 'Rèn luyện kỹ năng nhận diện thì động từ, câu điều kiện và trọng âm từ 2-3 âm tiết.',
    questions: [
      {
        id: 'q3_1',
        questionText: 'If I ______ enough money right now, I would travel around Vietnam.',
        options: [
          'A. have',
          'B. had',
          'C. will have',
          'D. had had'
        ],
        correctAnswerIndex: 1, // B. had
        explanation: 'Đây là câu điều kiện loại 2 diễn tả giả định trái với hiện tại (right now): Mệnh đề If dùng thì Quá khứ đơn (had), mệnh đề chính dùng would + V.'
      },
      {
        id: 'q3_2',
        questionText: 'The students ______ English in room 204 when the bell suddenly rang.',
        options: [
          'A. were studying',
          'B. studied',
          'C. are studying',
          'D. have studied'
        ],
        correctAnswerIndex: 0, // A. were studying
        explanation: 'Hành động đang diễn ra trong quá khứ (were studying) thì có hành động khác xen vào (rang) dùng thì Quá khứ tiếp diễn.'
      },
      {
        id: 'q3_3',
        questionText: 'Choose the word whose underlined part is pronounced differently: A. invite, B. provide, C. decide, D. provide.',
        options: [
          'A. chemistry (/k/)',
          'B. children (/tʃ/)',
          'C. church (/tʃ/)',
          'D. teacher (/tʃ/)'
        ],
        correctAnswerIndex: 0,
        explanation: '"chemistry" phát âm là /k/, các từ còn lại phát âm là /tʃ/.'
      },
      {
        id: 'q3_4',
        questionText: 'Choose the word with different stress pattern: A. student, B. teacher, C. police, D. doctor.',
        options: [
          'A. student (1)',
          'B. teacher (1)',
          'C. police (2)',
          'D. doctor (1)'
        ],
        correctAnswerIndex: 2, // C. police
        explanation: '"police" có trọng âm rơi vào âm tiết thứ 2 (pəˈliːs), các từ còn lại rơi vào âm tiết thứ nhất.'
      }
    ]
  }
];

export const INITIAL_QUIZ_RESULTS: QuizResult[] = [
  {
    id: 'res_01',
    quizId: 'quiz_01',
    quizTitle: 'Kiểm tra 15 phút: Cực trị & Sự biến thiên của hàm số (Toán 11)',
    studentId: 'std_01',
    studentName: 'Nguyễn Hoàng Long',
    classId: '11/1',
    score: 10.0,
    correctCount: 5,
    totalCount: 5,
    completedAt: '2026-09-19 09:20',
    timeSpentSeconds: 480,
    answers: [1, 1, 0, 2, 1]
  },
  {
    id: 'res_02',
    quizId: 'quiz_01',
    quizTitle: 'Kiểm tra 15 phút: Cực trị & Sự biến thiên của hàm số (Toán 11)',
    studentId: 'std_03',
    studentName: 'Lê Quốc Bảo',
    classId: '11/1',
    score: 10.0,
    correctCount: 5,
    totalCount: 5,
    completedAt: '2026-09-19 09:25',
    timeSpentSeconds: 390,
    answers: [1, 1, 0, 2, 1]
  },
  {
    id: 'res_03',
    quizId: 'quiz_01',
    quizTitle: 'Kiểm tra 15 phút: Cực trị & Sự biến thiên của hàm số (Toán 11)',
    studentId: 'std_02',
    studentName: 'Trần Mai Anh',
    classId: '11/1',
    score: 8.0,
    correctCount: 4,
    totalCount: 5,
    completedAt: '2026-09-19 09:40',
    timeSpentSeconds: 610,
    answers: [1, 1, 0, 0, 1] // sai câu 4
  },
  {
    id: 'res_04',
    quizId: 'quiz_01',
    quizTitle: 'Kiểm tra 15 phút: Cực trị & Sự biến thiên của hàm số (Toán 11)',
    studentId: 'std_06',
    studentName: 'Vũ Minh Trang',
    classId: '11/1',
    score: 8.0,
    correctCount: 4,
    totalCount: 5,
    completedAt: '2026-09-19 10:15',
    timeSpentSeconds: 540,
    answers: [1, 1, 0, 2, 0] // sai câu 5
  },
  {
    id: 'res_05',
    quizId: 'quiz_01',
    quizTitle: 'Kiểm tra 15 phút: Cực trị & Sự biến thiên của hàm số (Toán 11)',
    studentId: 'std_05',
    studentName: 'Đặng Tuấn Kiệt',
    classId: '11/1',
    score: 4.0,
    correctCount: 2,
    totalCount: 5,
    completedAt: '2026-09-19 11:00',
    timeSpentSeconds: 780,
    answers: [0, 0, 0, 2, 2] // đúng câu 3, 4
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    title: 'Chào mừng năm học mới tại THPT Duy Tân',
    message: 'Thầy Nguyễn Văn Khuyên chúc các em học sinh có một học kỳ tràn đầy nhiệt huyết, gặt hái nhiều kết quả xuất sắc.',
    timestamp: '2026-09-15 07:30',
    type: 'general',
    isRead: false
  },
  {
    id: 'notif_02',
    title: 'Nhắc nhở nộp bài tập Chuyên đề Khảo sát hàm số',
    message: 'Hạn chót nộp bài tập lớp 11/1 là 23h59 ngày 25/09. Các em kiểm tra lại các bước vẽ bảng biến thiên.',
    timestamp: '2026-09-20 18:00',
    type: 'task',
    isRead: false
  },
  {
    id: 'notif_03',
    title: 'Đã cập nhật điểm Kiểm tra 15 phút Toán 11',
    message: 'Kết quả bài kiểm tra Cực trị & Sự biến thiên đã được công bố. 100% học sinh xem lại lời giải chi tiết.',
    timestamp: '2026-09-21 08:00',
    type: 'grade',
    isRead: true
  }
];
