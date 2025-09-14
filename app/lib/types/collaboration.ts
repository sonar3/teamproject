export interface CollaborationTool {
  id: string;
  name: string;
  tool: string;
  loginInfo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationFormData {
  name: string;
  tool: string;
  loginInfo: string;
}

export interface CollaborationResponse {
  success: boolean;
  data?: CollaborationTool;
  message?: string;
}

export interface CollaborationListResponse {
  success: boolean;
  data?: CollaborationTool[];
  message?: string;
}

export const TOOL_OPTIONS = [
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
