import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Plus,
  Search,
  FileText,
  FileSpreadsheet,
  Video,
  Link2,
  ExternalLink,
  Edit2,
  Trash2,
  Eye,
  Download,
  X,
  Sparkles,
  Layers,
  FileDown
} from 'lucide-react';
import { DocumentItem, DocumentType } from '../../types';
import { ConfirmModal } from '../ConfirmModal';

export const DocumentsView: React.FC = () => {
  const {
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    userRole,
    teacherName,
    currentStudent,
    classes
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'Toán học',
    category: 'Chuyên đề ôn tập' as DocumentItem['category'],
    grade: 12 as 10 | 11 | 12 | 'Tất cả',
    fileType: 'pdf' as DocumentType,
    fileSize: '3.5 MB',
    author: teacherName,
    readTime: '30 phút đọc',
    url: '',
    previewContent: ''
  });

  const subjects = ['Toán học', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Anh', 'Tin học', 'Lịch sử'];
  const categories: DocumentItem['category'][] = [
    'Sách giáo khoa',
    'Chuyên đề ôn tập',
    'Đề cương học kỳ',
    'Bài giảng điện tử',
    'Bài tập trắc nghiệm'
  ];

  const openAddDoc = () => {
    setEditingDoc(null);
    setFormData({
      title: '',
      description: '',
      subject: 'Toán học',
      category: 'Chuyên đề ôn tập',
      grade: 12,
      fileType: 'pdf',
      fileSize: '4.2 MB',
      author: teacherName,
      readTime: '30 phút đọc',
      url: '',
      previewContent: ''
    });
    setIsAddModalOpen(true);
  };

  const openEditDoc = (doc: DocumentItem) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      description: doc.description,
      subject: doc.subject,
      category: doc.category,
      grade: doc.grade,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      author: doc.author,
      readTime: doc.readTime || '30 phút đọc',
      url: doc.url || '',
      previewContent: doc.previewContent || ''
    });
    setIsAddModalOpen(true);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingDoc) {
      updateDocument({
        ...editingDoc,
        ...formData
      });
    } else {
      addDocument(formData);
    }
    setIsAddModalOpen(false);
  };

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    if (selectedSubject !== 'all' && doc.subject !== selectedSubject) return false;
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
    if (selectedGrade !== 'all') {
      if (doc.grade !== 'Tất cả' && doc.grade.toString() !== selectedGrade) {
        return false;
      }
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.subject.toLowerCase().includes(q) ||
        doc.author.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const getDocTypeIcon = (type: DocumentType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'pptx':
        return <FileSpreadsheet className="w-5 h-5 text-amber-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-500" />;
      case 'link':
        return <Link2 className="w-5 h-5 text-emerald-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  const getDocTypeBadge = (type: DocumentType) => {
    switch (type) {
      case 'pdf':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'docx':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pptx':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'video':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'link':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="documents-view-container" className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kho tài liệu & Học liệu số THPT Duy Tân
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tổng hợp {documents.length} giáo án, chuyên đề bồi dưỡng và đề thi học kỳ chọn lọc
          </p>
        </div>

        {userRole === 'teacher' && (
          <button
            id="btn-open-add-doc"
            onClick={openAddDoc}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tài liệu mới</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-documents"
            type="text"
            placeholder="Tìm theo tên tài liệu, môn học, giáo viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Subject filter */}
        <select
          id="select-filter-doc-subject"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả môn học</option>
          {subjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        {/* Category filter */}
        <select
          id="select-filter-doc-category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả phân loại</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Grade filter */}
        <select
          id="select-filter-doc-grade"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả các khối</option>
          <option value="10">Khối 10</option>
          <option value="11">Khối 11</option>
          <option value="12">Khối 12</option>
        </select>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-base font-semibold text-slate-700">Chưa có tài liệu phù hợp.</p>
            <p className="text-xs text-slate-400 mt-1">
              Thử đặt lại bộ lọc hoặc giáo viên thêm tài liệu mới vào kho.
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              id={`document-card-${doc.id}`}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between p-5 group"
            >
              <div className="space-y-3">
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {getDocTypeIcon(doc.fileType)}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getDocTypeBadge(
                        doc.fileType
                      )}`}
                    >
                      {doc.fileType.toUpperCase()}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500">
                    Khối {doc.grade}
                  </span>
                </div>

                {/* Title & Subject */}
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    {doc.subject} • {doc.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug line-clamp-2">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-3">
                    {doc.description}
                  </p>
                </div>
              </div>

              {/* Footer info & buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[150px]">{doc.author}</span>
                  <span>
                    {doc.fileSize} {doc.readTime ? `• ${doc.readTime}` : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    id={`btn-preview-doc-${doc.id}`}
                    onClick={() => setPreviewDoc(doc)}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem tài liệu</span>
                  </button>

                  {userRole === 'teacher' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditDoc(doc)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                        title="Sửa tài liệu"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteDocId(doc.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Xóa tài liệu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL: PREVIEW DOCUMENT ================= */}
      {previewDoc && (
        <div
          id="modal-preview-doc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                    {previewDoc.subject}
                  </span>
                  <span className="text-xs text-slate-500">{previewDoc.category}</span>
                  <span className="text-xs font-semibold text-slate-400">
                    • Khối {previewDoc.grade}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mt-1.5">{previewDoc.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tác giả: {previewDoc.author} • Đăng ngày: {previewDoc.uploadDate} • Dung lượng:{' '}
                  {previewDoc.fileSize}
                </p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mô tả tài liệu:
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">{previewDoc.description}</p>
              </div>

              {/* Rich Preview / Excerpt */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Nội dung tóm tắt & Hướng dẫn học tập:</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">{previewDoc.readTime}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                  {previewDoc.previewContent ||
                    `NỘI DUNG CHÍNH CỦA TÀI LIỆU:
1. Tổng quan lý thuyết và định nghĩa trọng tâm.
2. Hệ thống công thức và phương pháp giải nhanh theo từng dạng toán/bài tập.
3. 20 câu hỏi trắc nghiệm minh họa có lời giải chi tiết.
4. Đề cương rèn luyện kỹ năng tự học tại nhà.`}
                </div>
              </div>

              {previewDoc.url && (
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
                  <span className="truncate">Đường dẫn liên kết: {previewDoc.url}</span>
                  <a
                    href={previewDoc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline text-blue-700 shrink-0 ml-2"
                  >
                    Mở liên kết
                  </a>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Lưu trữ tại Thư viện số THPT Duy Tân
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    // Create simple text download
                    const element = document.createElement('a');
                    const file = new Blob(
                      [
                        `TÀI LIỆU: ${previewDoc.title}\nMôn: ${previewDoc.subject}\nTác giả: ${previewDoc.author}\n\n${previewDoc.description}\n\n${previewDoc.previewContent || ''}`
                      ],
                      { type: 'text/plain;charset=utf-8' }
                    );
                    element.href = URL.createObjectURL(file);
                    element.download = `${previewDoc.title.slice(0, 30)}.txt`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-slate-500" />
                  <span>Tải tệp đính kèm</span>
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT DOCUMENT ================= */}
      {isAddModalOpen && (
        <div
          id="modal-add-edit-doc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                {editingDoc ? 'Chỉnh sửa tài liệu' : 'Thêm tài liệu mới vào kho'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên tài liệu *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Đề cương ôn tập Toán 12 Học kỳ 1..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Môn học *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phân loại *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as DocumentItem['category']
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Khối lớp *</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormData({
                        ...formData,
                        grade: v === 'Tất cả' ? 'Tất cả' : (Number(v) as 10 | 11 | 12)
                      });
                    }}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="12">Khối 12</option>
                    <option value="11">Khối 11</option>
                    <option value="10">Khối 10</option>
                    <option value="Tất cả">Tất cả các khối</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Định dạng tệp *
                  </label>
                  <select
                    value={formData.fileType}
                    onChange={(e) =>
                      setFormData({ ...formData, fileType: e.target.value as DocumentType })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pdf">PDF (Tài liệu)</option>
                    <option value="docx">DOCX (Đề cương)</option>
                    <option value="pptx">PPTX (Bài giảng)</option>
                    <option value="video">Video bài giảng</option>
                    <option value="link">Đường link URL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dung lượng
                  </label>
                  <input
                    type="text"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô tả ngắn tài liệu
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Mô tả nội dung, hướng dẫn học sinh cách ôn tập..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nội dung tóm tắt & Kiến thức cốt lõi (Xem trước)
                </label>
                <textarea
                  rows={4}
                  placeholder="Ghi các điểm lý thuyết chính, công thức cần nhớ..."
                  value={formData.previewContent}
                  onChange={(e) => setFormData({ ...formData, previewContent: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {editingDoc ? 'Lưu thay đổi' : 'Thêm vào kho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteDocId !== null}
        title="Xác nhận xóa tài liệu khỏi kho?"
        message="Hành động này sẽ xóa tài liệu khỏi hệ thống. Học sinh sẽ không thể xem hoặc tải tệp này nữa."
        onConfirm={() => {
          if (deleteDocId) {
            deleteDocument(deleteDocId);
            setDeleteDocId(null);
          }
        }}
        onCancel={() => setDeleteDocId(null)}
      />
    </div>
  );
};
