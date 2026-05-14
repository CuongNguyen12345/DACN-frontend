export const BLOG_CATEGORIES = [
  "Góc học tập",
  "Tin giáo dục",
  "Hướng nghiệp",
  "Kỹ năng mềm",
  "Review sách",
];

export const BLOG_POSTS = [
  {
    id: 1,
    slug: "lo-trinh-on-thi-dai-hoc-cho-hoc-sinh-mat-goc",
    title: "Lộ trình ôn thi đại học cho học sinh mất gốc",
    excerpt:
      "Một kế hoạch 12 tuần giúp bạn rà lại nền tảng, luyện đúng dạng câu hỏi và giữ nhịp học đều trước kỳ thi.",
    category: "Góc học tập",
    author: "Edu4All",
    date: "15/10/2026",
    readTime: "7 phút",
    tags: ["Toán", "Đại học", "Tự học"],
    accent: "from-blue-500 to-cyan-400",
    icon: "book",
    featured: true,
    sections: [
      {
        heading: "Bắt đầu từ việc đo lại nền tảng",
        content:
          "Trước khi lao vào luyện đề, học sinh nên dành 2 đến 3 ngày làm bài kiểm tra ngắn theo từng chuyên đề. Mục tiêu không phải là lấy điểm cao ngay, mà là biết rõ phần nào đang hổng: công thức cơ bản, kỹ năng biến đổi, đọc đề hay quản lý thời gian.",
      },
      {
        heading: "Chia 12 tuần thành ba giai đoạn",
        content:
          "Bốn tuần đầu dùng để học lại kiến thức trọng tâm và ghi chép công thức. Bốn tuần tiếp theo luyện bài theo dạng, mỗi dạng cần có ví dụ mẫu và bài tự làm. Bốn tuần cuối chuyển sang luyện đề tổng hợp, bấm giờ nghiêm túc và chữa lỗi sau mỗi đề.",
      },
      {
        heading: "Giữ nhịp học nhỏ nhưng đều",
        content:
          "Mỗi ngày chỉ cần 90 đến 120 phút học tập trung, nhưng phải có đầu ra rõ ràng: hoàn thành một nhóm bài, ghi lại lỗi sai, hoặc tự giải thích được một công thức. Cách học đều giúp giảm áp lực và tránh tình trạng học dồn sát ngày thi.",
      },
      {
        heading: "Theo dõi tiến bộ bằng lỗi sai",
        content:
          "Một cuốn sổ lỗi sai sẽ hữu ích hơn rất nhiều so với việc chỉ đếm số đề đã làm. Hãy ghi lại dạng bài, nguyên nhân sai và cách sửa. Sau 2 tuần, bạn sẽ thấy mình lặp lại một số lỗi quen thuộc và biết chính xác cần ưu tiên phần nào.",
      },
    ],
  },
  {
    id: 2,
    slug: "cach-chia-thoi-gian-lam-de-trac-nghiem-hieu-qua",
    title: "Cách chia thời gian làm đề trắc nghiệm hiệu quả",
    excerpt:
      "Gợi ý cách đọc đề, đánh dấu câu khó và kiểm tra lại đáp án để tránh mất điểm vì áp lực thời gian.",
    category: "Kỹ năng mềm",
    author: "Minh Anh",
    date: "08/10/2026",
    readTime: "5 phút",
    tags: ["Thi cử", "Quản lý thời gian"],
    accent: "from-emerald-500 to-teal-400",
    icon: "timer",
    sections: [
      {
        heading: "Đừng làm bài theo cảm tính",
        content:
          "Với đề trắc nghiệm, chiến thuật quan trọng không kém kiến thức. Hãy quét nhanh toàn bộ đề, làm trước các câu chắc chắn, đánh dấu câu phân vân và tạm bỏ qua câu quá dài. Việc này giúp bạn không bị kẹt ở một câu khó rồi mất thời gian cho các câu dễ.",
      },
      {
        heading: "Chia thời gian theo vòng",
        content:
          "Vòng một dành cho câu dễ và trung bình, chỉ nên dùng khoảng 60% tổng thời gian. Vòng hai quay lại câu đã đánh dấu để suy luận kỹ hơn. Vòng cuối kiểm tra đáp án, tô nhầm, câu bỏ sót và các phép tính dễ sai.",
      },
      {
        heading: "Luôn để lại thời gian kiểm tra",
        content:
          "Nhiều bạn mất điểm vì tính đúng nhưng chọn nhầm đáp án, hoặc quên tô câu đã làm nháp. Hãy dành ít nhất 5 phút cuối để soát lại phiếu trả lời. Đây là phần nhỏ nhưng có thể giữ lại rất nhiều điểm.",
      },
    ],
  },
  {
    id: 3,
    slug: "nhung-diem-moi-trong-tuyen-sinh-dai-hoc-nam-nay",
    title: "Những điểm mới trong tuyển sinh đại học năm nay",
    excerpt:
      "Tổng hợp các mốc thời gian quan trọng, phương thức xét tuyển phổ biến và lưu ý khi đăng ký nguyện vọng.",
    category: "Tin giáo dục",
    author: "Ban biên tập",
    date: "02/10/2026",
    readTime: "6 phút",
    tags: ["Tuyển sinh", "Đại học"],
    accent: "from-orange-400 to-amber-300",
    icon: "news",
    sections: [
      {
        heading: "Theo dõi mốc thời gian chính thức",
        content:
          "Điều đầu tiên học sinh cần làm là lưu lại các mốc đăng ký, điều chỉnh nguyện vọng và xác nhận nhập học. Mỗi trường có thể có thông báo riêng, nhưng các mốc chung từ hệ thống tuyển sinh vẫn là nền tảng để tránh bỏ lỡ cơ hội.",
      },
      {
        heading: "Hiểu rõ từng phương thức xét tuyển",
        content:
          "Các phương thức phổ biến gồm xét điểm thi tốt nghiệp, xét học bạ, xét điểm đánh giá năng lực và tuyển thẳng theo chứng chỉ hoặc thành tích. Mỗi phương thức có điều kiện, hạn nộp và cách tính điểm khác nhau, vì vậy không nên dùng một bộ hồ sơ cho tất cả.",
      },
      {
        heading: "Đăng ký nguyện vọng có chiến lược",
        content:
          "Một danh sách nguyện vọng tốt nên có nhóm an toàn, nhóm vừa sức và nhóm thử thách. Hãy ưu tiên ngành học phù hợp năng lực và mục tiêu nghề nghiệp, thay vì chỉ chạy theo tên trường hoặc điểm chuẩn năm trước.",
      },
    ],
  },
  {
    id: 4,
    slug: "chon-nganh-theo-nang-luc-hay-theo-xu-huong",
    title: "Chọn ngành theo năng lực hay theo xu hướng?",
    excerpt:
      "Một khung ra quyết định đơn giản để bạn cân bằng sở thích, năng lực, cơ hội nghề nghiệp và điều kiện gia đình.",
    category: "Hướng nghiệp",
    author: "Hoàng Nam",
    date: "28/09/2026",
    readTime: "8 phút",
    tags: ["Hướng nghiệp", "Kỹ năng"],
    accent: "from-rose-500 to-pink-400",
    icon: "compass",
    sections: [
      {
        heading: "Xu hướng là tín hiệu, không phải đáp án",
        content:
          "Một ngành đang được quan tâm có thể mở ra nhiều cơ hội, nhưng không đảm bảo phù hợp với tất cả mọi người. Học sinh nên xem xu hướng như dữ liệu tham khảo, sau đó đối chiếu với năng lực, sở thích và môi trường học tập mình mong muốn.",
      },
      {
        heading: "Đặt năng lực vào trung tâm quyết định",
        content:
          "Năng lực không chỉ là điểm số. Đó còn là khả năng tự học, giao tiếp, tư duy logic, chịu áp lực và mức độ kiên trì với lĩnh vực đó. Nếu chọn ngành chỉ vì hấp dẫn trên mạng, bạn có thể nhanh chóng mất động lực khi gặp môn học nền tảng.",
      },
      {
        heading: "Dùng ma trận bốn yếu tố",
        content:
          "Hãy chấm điểm từng lựa chọn theo bốn yếu tố: thích gì, giỏi gì, thị trường cần gì và gia đình có thể hỗ trợ ra sao. Ngành phù hợp thường không phải ngành cao nhất ở một yếu tố, mà là ngành cân bằng tốt nhất giữa cả bốn.",
      },
    ],
  },
  {
    id: 5,
    slug: "5-cuon-sach-giup-hoc-sinh-hoc-tap-chu-dong-hon",
    title: "5 cuốn sách giúp học sinh học tập chủ động hơn",
    excerpt:
      "Danh sách sách dễ đọc, thực tế và phù hợp với học sinh muốn xây dựng thói quen tự học bền vững.",
    category: "Review sách",
    author: "Linh Chi",
    date: "20/09/2026",
    readTime: "4 phút",
    tags: ["Sách", "Tự học"],
    accent: "from-violet-500 to-indigo-400",
    icon: "library",
    sections: [
      {
        heading: "Chọn sách để hành động, không chỉ để đọc",
        content:
          "Một cuốn sách học tập tốt nên giúp bạn thay đổi cách học sau khi đọc xong. Hãy ưu tiên sách có ví dụ cụ thể, bài tập nhỏ, phương pháp ghi nhớ hoặc cách quản lý thời gian có thể áp dụng ngay trong tuần.",
      },
      {
        heading: "Đọc chậm và ghi lại một việc sẽ làm",
        content:
          "Sau mỗi chương, hãy viết ra một hành động nhỏ: thử Pomodoro trong 3 ngày, ghi sổ lỗi sai, hoặc lập kế hoạch học buổi tối. Việc đọc sẽ hiệu quả hơn khi được chuyển thành thói quen cụ thể.",
      },
      {
        heading: "Tự học là một kỹ năng có thể luyện",
        content:
          "Không ai tự nhiên biết tự học. Bạn cần luyện cách đặt mục tiêu, chia nhỏ nhiệm vụ, kiểm tra kết quả và tự điều chỉnh. Sách chỉ là người hướng dẫn, còn sự tiến bộ đến từ những lần bạn thực hành đều đặn.",
      },
    ],
  },
];

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export const filterBlogPosts = (posts = [], { keyword = "", category = "all" } = {}) => {
  const normalizedKeyword = normalize(keyword);

  return posts.filter((post) => {
    const matchesCategory = category === "all" || post.category === category;
    const searchable = normalize([post.title, post.excerpt, post.category, ...(post.tags || [])].join(" "));
    const matchesKeyword = !normalizedKeyword || searchable.includes(normalizedKeyword);
    return matchesCategory && matchesKeyword;
  });
};

export const getBlogCategoryCounts = (posts = []) =>
  posts.reduce(
    (counts, post) => ({
      ...counts,
      [post.category]: (counts[post.category] || 0) + 1,
      all: counts.all + 1,
    }),
    { all: 0 },
  );

export const getBlogTags = (posts = []) => {
  const seen = new Set();

  posts.forEach((post) => {
    (post.tags || []).forEach((tag) => {
      if (tag) seen.add(tag);
    });
  });

  return Array.from(seen);
};

export const getBlogPostBySlug = (slug) =>
  BLOG_POSTS.find((post) => post.slug === slug);

export const getRelatedBlogPosts = (post, limit = 3) => {
  if (!post) return [];

  return BLOG_POSTS.filter(
    (candidate) => candidate.id !== post.id && candidate.category === post.category,
  )
    .concat(BLOG_POSTS.filter((candidate) => candidate.id !== post.id && candidate.category !== post.category))
    .slice(0, limit);
};
