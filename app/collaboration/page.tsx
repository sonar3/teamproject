'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CollaborationTool, CollaborationListResponse } from '@/app/lib/types/collaboration';
import { AuthGuard } from '@/app/lib/withAuth';
import CollaborationModal from '@/components/CollaborationModal';

export default function CollaborationPage() {
  const [tools, setTools] = useState<CollaborationTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<CollaborationTool | null>(null);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collaboration/tools');
      const data: CollaborationListResponse = await response.json();
      
      if (data.success && data.data) {
        setTools(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch collaboration tools:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleAddTool = () => {
    setEditingTool(null);
    setIsModalOpen(true);
  };

  const handleEditTool = (tool: CollaborationTool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTool(null);
  };

  const handleModalSuccess = () => {
    fetchTools();
    handleModalClose();
  };

  const handleDeleteTool = async (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/collaboration/tools/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchTools();
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete tool:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const getToolLabel = (toolValue: string) => {
    const toolOptions = [
      { value: 'slack', label: 'Slack' },
      { value: 'discord', label: 'Discord' },
      { value: 'teams', label: 'Microsoft Teams' },
      { value: 'zoom', label: 'Zoom' },
      { value: 'notion', label: 'Notion' },
      { value: 'trello', label: 'Trello' },
      { value: 'asana', label: 'Asana' },
      { value: 'jira', label: 'Jira' },
      { value: 'confluence', label: 'Confluence' },
      { value: 'github', label: 'GitHub' },
      { value: 'gitlab', label: 'GitLab' },
      { value: 'figma', label: 'Figma' },
      { value: 'miro', label: 'Miro' },
      { value: 'google-workspace', label: 'Google Workspace' },
      { value: 'office365', label: 'Office 365' },
      { value: 'dropbox', label: 'Dropbox' },
      { value: 'onedrive', label: 'OneDrive' },
      { value: 'other', label: '기타' }
    ];
    
    return toolOptions.find(option => option.value === toolValue)?.label || toolValue;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">협업툴관리</h1>
                <p className="mt-2 text-gray-600">팀에서 사용하는 협업 도구들을 관리합니다.</p>
              </div>
              <button
                onClick={handleAddTool}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + 협업툴 등록
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">로딩 중...</p>
              </div>
            ) : tools.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 협업툴이 없습니다</h3>
                <p className="text-gray-600 mb-4">새로운 협업툴을 등록해보세요.</p>
                <button
                  onClick={handleAddTool}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  첫 번째 협업툴 등록하기
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        이름
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        도구
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        로그인정보
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        등록일
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{tool.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getToolLabel(tool.tool)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={tool.loginInfo}>
                            {tool.loginInfo}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(tool.createdAt).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditTool(tool)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteTool(tool.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <CollaborationModal
            tool={editingTool}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
          />
        )}
      </div>
    </AuthGuard>
  );
}
